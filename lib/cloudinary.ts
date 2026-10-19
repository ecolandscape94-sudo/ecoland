import { v2 as cloudinary } from 'cloudinary';
import { randomUUID } from 'node:crypto';
import { detectImage } from './security';
export function mediaConfigured(){return !!(process.env.CLOUDINARY_CLOUD_NAME&&process.env.CLOUDINARY_API_KEY&&process.env.CLOUDINARY_API_SECRET);}
function client(){if(!mediaConfigured())throw new Error('Photo storage is not configured');cloudinary.config({cloud_name:process.env.CLOUDINARY_CLOUD_NAME,api_key:process.env.CLOUDINARY_API_KEY,api_secret:process.env.CLOUDINARY_API_SECRET,secure:true});return cloudinary;}
export async function uploadImage(file:File,privateImage=false){
 if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>(privateImage?1024*1024:4*1024*1024)||file.size===0)throw new Error('Invalid image type or size');
 const buffer=Buffer.from(await file.arrayBuffer());const format=detectImage(buffer);if(!format||file.type!==`image/${format}`)throw new Error('Image content does not match its file type');
 const result=await client().uploader.upload(`data:image/${format};base64,${buffer.toString('base64')}`,{resource_type:'image',type:privateImage?'authenticated':'upload',public_id:`ecoland/${privateImage?'inquiries':'website'}/${randomUUID()}`,overwrite:false,timeout:20000});
 return {publicId:result.public_id,format:result.format,url:result.secure_url};
}
export async function removePrivateImage(publicId:string){await client().uploader.destroy(publicId,{type:'authenticated',resource_type:'image'});}
export function privateImageUrl(publicId:string,format:string){return client().utils.private_download_url(publicId,format,{type:'authenticated',expires_at:Math.floor(Date.now()/1000)+60});}
