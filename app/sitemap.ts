import type { MetadataRoute } from 'next';
import { getContent, siteUrl } from '@/lib/content';
export default async function sitemap():Promise<MetadataRoute.Sitemap>{const {services,projects}=await getContent();return ['','/about','/services','/projects','/nursery','/contact','/privacy',...services.map(s=>`/services/${s.slug}`),...projects.map(p=>`/projects/${p.slug}`)].map(path=>({url:`${siteUrl()}${path}`,changeFrequency:path==='/projects'||path==='/nursery'?'weekly':'monthly',priority:path===''?1:.7}));}
