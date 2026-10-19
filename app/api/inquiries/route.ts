import { randomUUID } from 'node:crypto';
import { inquiryInputSchema, type Inquiry } from '@/lib/models';
import { sheetsConfigured } from '@/lib/sheets';
import { uploadImage, removePrivateImage, mediaConfigured } from '@/lib/cloudinary';
import { rateKey, rateLimit, sameOrigin } from '@/lib/security';
import { persistAndNotify } from '@/lib/inquiry-workflow';
export const runtime='nodejs';export const maxDuration=60;
export async function POST(request:Request){
 if(!sameOrigin(request))return Response.json({error:'This request is not allowed.'},{status:403});
 if(Number(request.headers.get('content-length')||0)>4*1024*1024)return Response.json({error:'Your submission is too large.'},{status:413});
 const uploaded:Inquiry['attachments']=[];let saved=false;
 try{
  if(!await rateLimit(rateKey(request,'inquiry')))return Response.json({error:'Too many requests. Please wait a few minutes and try again.'},{status:429});
  const form=await request.formData();const input=inquiryInputSchema.safeParse(JSON.parse(String(form.get('payload')||'{}')));
  if(!input.success)return Response.json({error:'Please check your contact details, project description and consent.',fields:input.error.flatten().fieldErrors},{status:400});
  if(!sheetsConfigured())return Response.json({error:'Online inquiries are temporarily unavailable. Please call or email the team using the contact details on this page.'},{status:503});
  const files=form.getAll('attachments').filter(f=>f instanceof File&&f.size>0) as File[];
  if(files.length>3||files.some(f=>f.size>1024*1024||!['image/jpeg','image/png','image/webp'].includes(f.type)))return Response.json({error:'Choose up to 3 JPG, PNG or WebP photographs, each no larger than 1 MB.'},{status:400});
  if(files.length&&!mediaConfigured())return Response.json({error:'Photo attachments are not connected yet. Please submit without photos.'},{status:503});
  for(const file of files){const media=await uploadImage(file,true);uploaded.push({publicId:media.publicId,format:media.format,name:file.name.replace(/[\r\n]/g,'').slice(0,200)});}
  const record:Inquiry={...input.data,id:randomUUID(),status:'New',notes:'',notification:'pending',createdAt:new Date().toISOString(),attachments:uploaded};
  const result=await persistAndNotify(record);saved=true;
  return Response.json({id:result.id},{status:201});
 }catch(e){if(!saved)await Promise.allSettled(uploaded.map(a=>removePrivateImage(a.publicId)));console.error('Inquiry submission failed',e instanceof SyntaxError?'Invalid JSON':e instanceof Error?e.message:'Unknown error');return Response.json({error:e instanceof SyntaxError?'Please check your submission.':'Your inquiry could not be saved. Please try again later.'},{status:e instanceof SyntaxError?400:503});}
}
