import { randomUUID } from 'node:crypto';
import { staffUser } from '@/auth';
import { collectionSchemas, collections, type Collection, type ContentRecord, type Inquiry } from '@/lib/models';
import { listRecords, saveRecord, audit } from '@/lib/sheets';
import { sameOrigin, rateLimit, rateKey } from '@/lib/security';
import { notifyInquiry } from '@/lib/notifications';
import { revalidateTag, revalidatePath } from 'next/cache';
export const runtime='nodejs';export const maxDuration=60;
type Context={params:Promise<{collection:string}>};
export async function GET(request:Request,{params}:Context){const user=await staffUser();if(!user)return Response.json({error:'Sign in is required.'},{status:401});const {collection}=await params;if(!collections.includes(collection as Collection))return Response.json({error:'Unknown collection'},{status:404});if(user.role!=='admin'&&['inquiries','settings'].includes(collection))return Response.json({error:'Administrator access required.'},{status:403});try{return Response.json(await listRecords(collection as Collection),{headers:{'Cache-Control':'private, no-store'}});}catch{return Response.json({error:'Unable to read content storage.'},{status:503});}}
export async function POST(request:Request,{params}:Context){
 const user=await staffUser();if(!user)return Response.json({error:'Sign in is required.'},{status:401});if(!sameOrigin(request))return Response.json({error:'Request not allowed.'},{status:403});
 const {collection}=await params;if(!collections.includes(collection as Collection))return Response.json({error:'Unknown collection'},{status:404});const c=collection as Collection;
 if(user.role!=='admin'&&['inquiries','settings'].includes(c))return Response.json({error:'Administrator access required.'},{status:403});
 if(Number(request.headers.get('content-length')||0)>50000)return Response.json({error:'Record too large.'},{status:413});
 try{
  if(!await rateLimit(rateKey(request,`staff:${user.email}`),120,600))return Response.json({error:'Too many edits. Please wait a moment.'},{status:429});
  const body=await request.json();const existing=await listRecords(c);let record:ContentRecord;
  if(c==='inquiries'){
   const old=existing.find(r=>r.id===body.id) as Inquiry|undefined;if(!old)return Response.json({error:'Inquiry not found.'},{status:404});
   if(body.retryNotification){await audit(user.email,'notification:retry',old.id);old.notification=await notifyInquiry(old);record=old;}
   else record={...old,status:body.status,notes:body.notes};
  }else record={...body,id:body.id||randomUUID()};
  const parsed=collectionSchemas[c].safeParse(record);if(!parsed.success)return Response.json({error:'Please check the fields. JSON fields must use the format described in the editor.',fields:parsed.error.flatten().fieldErrors},{status:400});
  if(c==='projects'||c==='plants'){
   if('status' in parsed.data&&parsed.data.status==='published'&&(!('image' in parsed.data)||!parsed.data.image||!('description' in parsed.data)||parsed.data.description.length<20))return Response.json({error:'Add an approved description and a photograph before publishing.'},{status:400});
  }
  if(c==='testimonials'&&'status' in parsed.data&&parsed.data.status==='published'&&(!('approved' in parsed.data)||!parsed.data.approved))return Response.json({error:'Client approval is required before publishing a testimonial.'},{status:400});
  if(JSON.stringify(parsed.data).length>40000)return Response.json({error:'Please shorten this record.'},{status:400});
  await audit(user.email,`${c}:save-attempt`,parsed.data.id);
  const result=await saveRecord(c,parsed.data);
  if(c!=='inquiries'){revalidateTag('eco-public',{expire:0});revalidatePath('/','layout');}
  try{await audit(user.email,`${c}:saved`,result.id);}catch{console.error('Audit completion event failed; attempt recorded',result.id);}
  return Response.json(result);
 }catch{return Response.json({error:'The change could not be saved. Check the Sheets connection and unique URL slug.'},{status:503});}
}
