import { sheetRequest } from '../lib/sheets';
import { seed } from '../lib/seed';
async function main(){
 const metadata=await sheetRequest('?fields=sheets.properties');const existing=new Set(metadata.sheets.map((s:{properties:{title:string}})=>s.properties.title));
 const tabs=[...Object.keys(seed),'audit'];const missing=tabs.filter(t=>!existing.has(t));
 if(missing.length)await sheetRequest(':batchUpdate',{method:'POST',body:JSON.stringify({requests:missing.map(title=>({addSheet:{properties:{title,gridProperties:{frozenRowCount:1}}}}))})});
 for(const title of tabs){const range=encodeURIComponent(`'${title}'!A1:D`);const current=await sheetRequest(`/values/${range}`);if(current.values?.length){console.log(`${title}: existing data preserved`);continue;}const now=new Date().toISOString();const records=title==='audit'?[]:seed[title as keyof typeof seed];await sheetRequest(`/values/${range}?valueInputOption=RAW`,{method:'PUT',body:JSON.stringify({values:[['id','data','createdAt','updatedAt'],...records.map(record=>[record.id,JSON.stringify(record),now,now])]})});console.log(`${title}: initialized with ${records.length} records`);}
 console.log('Sheets initialized. Project and plant records remain drafts until client-approved content is supplied.');
}
main().catch(error=>{console.error(error instanceof Error?error.message:'Setup failed');process.exitCode=1;});
