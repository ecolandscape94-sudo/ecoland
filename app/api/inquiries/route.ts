import { randomUUID } from 'node:crypto';
import { inquiryInputSchema, type Inquiry } from '@/lib/models';
import { sheetsConfigured } from '@/lib/sheets';
import { uploadImage, removePrivateImage, mediaConfigured } from '@/lib/cloudinary';
import { detectImage, rateKey, rateLimit, sameOrigin } from '@/lib/security';
import { persistAndNotify } from '@/lib/inquiry-workflow';
import { notifyInquiry, type InquiryEmailAttachment } from '@/lib/notifications';
export const runtime='nodejs';export const maxDuration=60;
export async function POST(request:Request){
 if(!sameOrigin(request))return Response.json({error:'This request is not allowed.'},{status:403});
 if(Number(request.headers.get('content-length')||0)>4*1024*1024)return Response.json({error:'Your submission is too large.'},{status:413});
 const uploaded:Inquiry['attachments']=[];let saved=false;
 try{
  if(!await rateLimit(rateKey(request,'inquiry')))return Response.json({error:'Too many requests. Please wait a few minutes and try again.'},{status:429});
  const form=await request.formData();const input=inquiryInputSchema.safeParse(JSON.parse(String(form.get('payload')||'{}')));
  if(!input.success)return Response.json({error:'Please check your contact details, project description and consent.',fields:input.error.flatten().fieldErrors},{status:400});
  const files=form.getAll('attachments').filter(f=>f instanceof File&&f.size>0) as File[];
  if(files.length>3||files.some(f=>f.size>1024*1024||!['image/jpeg','image/png','image/webp'].includes(f.type)))return Response.json({error:'Choose up to 3 JPG, PNG or WebP photographs, each no larger than 1 MB.'},{status:400});
  if(!sheetsConfigured()){
   const emailAttachments:InquiryEmailAttachment[]=[];
   for(const [index,file] of files.entries()){
    const bytes=Buffer.from(await file.arrayBuffer());const format=detectImage(bytes);
    if(!format||file.type!==`image/${format}`)return Response.json({error:'Please choose valid JPG, PNG or WebP photographs.'},{status:400});
    const filename=file.name.replace(/[^a-zA-Z0-9._-]/g,'_').slice(0,150)||`photo-${index+1}.${format}`;
    emailAttachments.push({filename,content:bytes.toString('base64'),contentType:file.type});
   }
   const record:Inquiry={...input.data,id:randomUUID(),status:'New',notes:'',notification:'pending',createdAt:new Date().toISOString(),attachments:[]};
   const result=await notifyInquiry(record,emailAttachments);
   if(result!=='sent')return Response.json({error:'Your inquiry could not be sent. Please try again later or contact us by phone or email.'},{status:503});
   return Response.json({id:record.id,delivery:'email'},{status:201});
  }
  if(files.length&&!mediaConfigured())return Response.json({error:'Photo attachments are not connected yet. Please submit without photos.'},{status:503});
  for(const file of files){const media=await uploadImage(file,true);uploaded.push({publicId:media.publicId,format:media.format,name:file.name.replace(/[\r\n]/g,'').slice(0,200)});}
  const record:Inquiry={...input.data,id:randomUUID(),status:'New',notes:'',notification:'pending',createdAt:new Date().toISOString(),attachments:uploaded};
  const result=await persistAndNotify(record);saved=true;
  return Response.json({id:result.id,delivery:result.notification==='sent'?'email':'saved'},{status:201});
 }catch(e){if(!saved)await Promise.allSettled(uploaded.map(a=>removePrivateImage(a.publicId)));console.error('Inquiry submission failed',e instanceof SyntaxError?'Invalid JSON':e instanceof Error?e.message:'Unknown error');return Response.json({error:e instanceof SyntaxError?'Please check your submission.':'Your inquiry could not be saved. Please try again later.'},{status:e instanceof SyntaxError?400:503});}
}
