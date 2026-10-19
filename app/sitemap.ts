import type { MetadataRoute } from 'next';
import { getContent, siteUrl } from '@/lib/content';
import { getBlogPosts } from '@/lib/blog';
export default async function sitemap():Promise<MetadataRoute.Sitemap>{const [{services,projects},posts]=await Promise.all([getContent(),getBlogPosts()]);return ['','/about','/services','/projects','/nursery','/blog','/contact','/privacy',...services.map(s=>`/services/${s.slug}`),...projects.map(p=>`/projects/${p.slug}`),...posts.map(p=>`/blog/${p.slug}`)].map(path=>({url:`${siteUrl()}${path}`,changeFrequency:path==='/'||path==='/blog'||path==='/projects'||path==='/nursery'?'weekly':'monthly',priority:path===''?1:.7}));}
