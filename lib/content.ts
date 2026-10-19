import 'server-only';
import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { listRecords, sheetsConfigured } from './sheets';
import { defaultSettings, services as fallbackServices } from './seed';
import type { Project, Plant, Service, Settings, ContentRecord, Collection } from './models';
const publicRecords = unstable_cache(async (collection: Collection) => listRecords(collection), ['eco-public-content-v4-company-photos', process.env.GOOGLE_SHEETS_ID || 'preview'], { revalidate: 60, tags: ['eco-public'] });
export const getContent = cache(async () => {
  const [projects, plants, services, sections, testimonials, settings] = await Promise.all(['projects', 'plants', 'services', 'sections', 'testimonials', 'settings'].map(c => publicRecords(c as Collection)));
  const site = { ...defaultSettings, email: process.env.BUSINESS_EMAIL || '', phone: process.env.BUSINESS_PHONE || '', whatsapp: process.env.BUSINESS_WHATSAPP || '', address: process.env.BUSINESS_ADDRESS || '', ...settings[0] } as Settings;
  // Blank CMS defaults must not erase verified environment contact settings.
  for (const key of ['email', 'phone', 'whatsapp', 'address'] as const) if (!site[key]) site[key] = process.env[`BUSINESS_${key.toUpperCase()}`] || defaultSettings[key];
  if(!site.profileUrl)site.profileUrl=defaultSettings.profileUrl;
  return { projects: projects.filter(r => r.status === 'published') as Project[], plants: plants.filter(r => r.status === 'published') as Plant[], services: (services.length ? services : fallbackServices).filter(r => r.status === 'published') as Service[], sections: sections.filter(r => r.status === 'published') as ContentRecord[], testimonials: testimonials.filter(r => r.status === 'published' && r.approved), settings: site, demo: !sheetsConfigured() };
});
export function whatsappLink(number: string, subject: string) { return /^\d{7,15}$/.test(number) ? `https://wa.me/${number}?text=${encodeURIComponent(`Hello Eco Landscapes & Gardening Ltd, I would like to inquire about ${subject}.`)}` : null; }
export const siteUrl = () => (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
