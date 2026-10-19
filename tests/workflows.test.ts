import test from 'node:test';
import assert from 'node:assert/strict';
import { inquiryInputSchema, collectionSchemas, type Inquiry } from '../lib/models';
import { detectImage, sameOrigin, rateLimit } from '../lib/security';
import { parseRows, saveRecord, listRecords } from '../lib/sheets';
import { projects, plants } from '../lib/seed';
import { persistAndNotify } from '../lib/inquiry-workflow';
const valid = {name:'Test Gardener',email:'test@example.com',phone:'+250 788 000 000',service:'Garden maintenance',location:'Kigali',size:'Small garden',description:'Please help plan the care for my garden.',consent:true as const,website:''};
const inquiry:Inquiry={...valid,id:'inquiry-test',status:'New',notes:'',notification:'pending',createdAt:'2026-10-14T12:00:00Z',attachments:[]};
test('invalid inquiries, missing consent and honeypot submissions are rejected',()=>{
 for(const patch of [{email:'bad'},{phone:'not a phone'},{consent:false},{description:'short'},{website:'https://spam.example'},{name:''}])assert.equal(inquiryInputSchema.safeParse({...valid,...patch}).success,false);
 assert.equal(inquiryInputSchema.safeParse(valid).success,true);
});
test('image validation rejects disguised SVG and recognizes supported file signatures',()=>{
 assert.equal(detectImage(Buffer.from('<svg onload="alert(1)"></svg>')),null);
 assert.equal(detectImage(Buffer.from([137,80,78,71,13,10,26,10,0,0,0,0])),'png');
 assert.equal(detectImage(Buffer.from([255,216,255,0,0,0,0,0,0,0,0,0])),'jpeg');
 assert.equal(detectImage(Buffer.from('RIFFxxxxWEBPxxxx')),'webp');
});
test('mutations reject cross-origin and missing-origin requests',()=>{
 assert.equal(sameOrigin(new Request('http://localhost:3000/api/inquiries',{headers:{origin:'https://attacker.example'}})),false);
 assert.equal(sameOrigin(new Request('http://localhost:3000/api/inquiries')),false);
 assert.equal(sameOrigin(new Request('http://localhost:3000/api/inquiries',{headers:{origin:'http://localhost:3000'}})),true);
});
test('rate limit allows its quota then rejects additional requests',async()=>{const key=`test-${Date.now()}`;for(let i=0;i<3;i++)assert.equal(await rateLimit(key,3,30),true);assert.equal(await rateLimit(key,3,30),false);});
test('safe seed content has six project drafts, twenty plant drafts, no prices or invented testimonials',()=>{
 assert.equal(projects.length,6);assert.equal(plants.length,20);assert.ok([...projects,...plants].every(r=>r.status==='draft'));
 projects.forEach(r=>assert.equal(collectionSchemas.projects.safeParse(r).success,true));plants.forEach(r=>assert.equal(collectionSchemas.plants.safeParse(r).success,true));
});
test('corrupt or mismatched Sheet rows are not exposed as public content',()=>{const record=plants[0];assert.deepEqual(parseRows('plants',[[record.id,JSON.stringify(record)],['bad','{corrupt'],['different-id',JSON.stringify(record)]]),[record]);});
test('CMS content cannot inject unsafe image URL schemes',()=>{for(const image of ['javascript:alert(1)','https://attacker.example/x.png','http://res.cloudinary.com/x'])assert.equal(collectionSchemas.plants.safeParse({...plants[0],image}).success,false);});
test('draft read fallback is immutable and does not claim persistent writes',async()=>{const first=await listRecords('plants');first[0].title='Changed';assert.notEqual((await listRecords('plants'))[0].title,'Changed');await assert.rejects(saveRecord('plants',plants[0]),/not configured/);});
test('Sheet insert uses RAW values so formula-like text is stored safely',async()=>{let path='';let body:any;await saveRecord('plants',{...plants[0],title:'=IMPORTXML("example")'},true,async(p='',options={})=>{if(options.method){path=p;body=JSON.parse(String(options.body));}return {values:[]};});assert.match(path,/valueInputOption=RAW/);assert.match(path,/:append/);assert.equal(body.values[0][0],plants[0].id);assert.equal(JSON.parse(body.values[0][1]).title,'=IMPORTXML("example")');});
test('Sheet update targets the matching row and preserves its creation timestamp',async()=>{let path='';let body:any;const rows=[[plants[0].id,JSON.stringify(plants[0]),'original-date','old-update']];await saveRecord('plants',{...plants[0],title:'Updated title'},false,async(p='',options={})=>{if(options.method){path=decodeURIComponent(p);body=JSON.parse(String(options.body));}return {values:rows};});assert.match(path,/'plants'!A2:D2/);assert.equal(body.values[0][2],'original-date');assert.equal(JSON.parse(body.values[0][1]).title,'Updated title');});
test('Sheet insert rejects duplicate identities and duplicate slugs',async()=>{const transport=async()=>({values:[[plants[0].id,JSON.stringify(plants[0])]]});await assert.rejects(saveRecord('plants',plants[0],true,transport),/already exists/);await assert.rejects(saveRecord('plants',{...plants[0],id:'other'},true,transport),/slug is already/);});
test('storage failure never sends a notification or returns success',async()=>{let notified=false;await assert.rejects(persistAndNotify(inquiry,{save:async()=>{throw new Error('offline');},notify:async()=>{notified=true;return 'sent';}}),/offline/);assert.equal(notified,false);});
test('notification failure preserves the saved inquiry and marks it for retry',async()=>{const stored:Inquiry[]=[];const result=await persistAndNotify(inquiry,{save:async(record)=>{stored.push(structuredClone(record));return record;},notify:async()=>{throw new Error('SMTP offline');}});assert.equal(stored[0].notification,'pending');assert.equal(stored[1].notification,'failed');assert.equal(result.id,inquiry.id);assert.equal(result.notification,'failed');});
test('a notification-status write failure does not turn a saved inquiry into a false failure',async()=>{let saves=0;const result=await persistAndNotify(inquiry,{save:async(record)=>{if(++saves===2)throw new Error('status offline');return record;},notify:async()=> 'sent'});assert.equal(saves,2);assert.equal(result.id,inquiry.id);});
