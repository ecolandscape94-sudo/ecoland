'use client';
import { useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import type { Service } from '@/lib/models';
declare global { interface Window { gtag?: (...args: unknown[]) => void; } }
export function InquiryForm({ services, initialService = '', compact = false, minimal = false }: { services: Service[]; initialService?: string; compact?: boolean; minimal?: boolean }) {
 const [pending,setPending] = useState(false); const [error,setError] = useState(''); const [success,setSuccess] = useState<{id:string;delivery:'email'|'saved'}|null>(null); const formRef = useRef<HTMLFormElement>(null);
 async function submit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault(); if (pending) return; setError(''); setPending(true);
  const form = new FormData(event.currentTarget); const data = new FormData();
  const payload = Object.fromEntries(['name','email','phone','service','location','size','description','website'].map(key => [key,String(form.get(key) || '')]));
  data.set('payload', JSON.stringify({ ...payload, consent: form.get('consent') === 'on' }));
  const files = form.getAll('attachments').filter(f => f instanceof File && f.size > 0) as File[];
  if (files.length > 3 || files.some(f => f.size > 1024 * 1024 || !['image/jpeg','image/png','image/webp'].includes(f.type))) { setError('Choose up to 3 JPG, PNG or WebP photos, each no larger than 1 MB.'); setPending(false); return; }
  files.forEach(file => data.append('attachments', file));
  try { const response = await fetch('/api/inquiries', { method: 'POST', body: data }); const result = await response.json(); if (!response.ok) throw new Error(result.error || 'Your inquiry could not be sent. Please try again.'); setSuccess({id:result.id,delivery:result.delivery==='email'?'email':'saved'}); formRef.current?.reset(); window.gtag?.('event','generate_lead',{ service: payload.service }); }
  catch (e) { setError(e instanceof Error ? e.message : 'Unable to send your inquiry. Please try again.'); }
  finally { setPending(false); }
 }
 if (success) return <div className="form-success" role="status"><CheckCircle2 size={30}/><h3>Thank you. Let’s grow your idea.</h3><p>{success.delivery==='email'?'Your inquiry has been sent to our team.':'Your inquiry has been saved for our team to review.'} We’ll contact you using the details you supplied.</p><p>Reference: {success.id}</p><button className="button secondary" onClick={() => setSuccess(null)}>Send another inquiry</button></div>;
 const options = ['Site visit', ...services.map(s => s.title), 'Nursery inquiry', 'General inquiry']; if (initialService && !options.includes(initialService)) options.unshift(initialService);
 return <form ref={formRef} onSubmit={submit} className="inquiry-form"><h2>{minimal ? 'Send us a message.' : compact ? 'Let’s talk about your space.' : 'Tell us what you have in mind.'}</h2><p>{minimal ? 'Fields marked * are required.' : 'Share a few details and we can discuss the right next step. Required fields are marked *.'}</p><div className="form-grid">
  <label className="field">Full name *<input name="name" required minLength={2} maxLength={100} autoComplete="name"/></label><label className="field">Email address *<input name="email" type="email" required maxLength={200} autoComplete="email"/></label>
  <label className="field">Telephone *<input name="phone" type="tel" required minLength={6} maxLength={40} autoComplete="tel" placeholder="+250 …"/></label><label className="field">I’m interested in *<select name="service" required defaultValue={initialService || ''}><option value="" disabled>Select a service</option>{options.map(o => <option key={o}>{o}</option>)}</select></label>
  <label className={`field${minimal ? ' full' : ''}`}>Your location *<input name="location" required minLength={2} maxLength={200} placeholder="District or neighbourhood"/></label>{!minimal && <label className="field">Approximate project size<input name="size" maxLength={200} placeholder="If you know it"/></label>}
  <label className="field full">About your project *<textarea name="description" required minLength={15} maxLength={5000} rows={4} placeholder="Tell us about the space and what you would like to achieve."/></label>
  {!minimal && <label className="field full">Photos of your space (optional)<input name="attachments" type="file" accept="image/jpeg,image/png,image/webp" multiple/><small>Up to 3 photos · JPG, PNG or WebP · 1 MB each. Only authorized staff can access inquiry attachments.</small></label>}
 </div>{minimal && <details className="contact-optional"><summary>Add project size or photos <span>Optional</span></summary><div className="contact-optional-fields"><label className="field">Approximate project size<input name="size" maxLength={200} placeholder="If you know it"/></label><label className="field">Photos of your space<input name="attachments" type="file" accept="image/jpeg,image/png,image/webp" multiple/><small>Up to 3 JPG, PNG or WebP photos · 1 MB each.</small></label></div></details>}<div className="honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off"/></label></div><label className="consent-field"><input type="checkbox" name="consent" required/><span>I agree that Eco Landscapes & Gardening Ltd may use these details to respond to my inquiry. <Link href="/privacy">Privacy details</Link>.</span></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="button" type="submit" disabled={pending}>{pending ? 'Sending your inquiry…' : 'Send inquiry'}<ArrowUpRight size={17}/></button></form>;
}
