import { MapPin, Mail, Phone, MessageCircle, ArrowUpRight } from 'lucide-react';
import { getContent, whatsappLink } from '@/lib/content';
import { Breadcrumb } from '@/components/ui';
import { InquiryForm } from '@/components/inquiry-form';
import './contact.css';
export const metadata = { title: 'Contact & request a site visit', description: 'Contact Eco Landscapes & Gardening Ltd in Kagugu, Kigali. Call +250 788 755 016 or request a landscaping site visit, nursery inquiry or garden maintenance.', alternates: { canonical: '/contact' } };
export default async function Contact({searchParams}:{searchParams:Promise<{service?:string}>}) {
  const {services,settings} = await getContent();
  const {service} = await searchParams;
  const wa = whatsappLink(settings.whatsapp,service?.slice(0,150)||'a site visit');
  return <div className="contact-page"><Breadcrumb items={[{label:'Contact us'}]}/><div className="contact-page-inner container">
    <header className="contact-intro"><p className="contact-kicker">Let’s talk</p><h1>Let’s grow<br/><em>your idea.</em></h1><p>Tell us about your space. We’ll take it from there.</p></header>
    <div className="contact-main"><aside className="contact-details" aria-labelledby="contact-details-heading">
      <div><p className="contact-details-kicker">Here for your next project</p><h2 id="contact-details-heading">Get in touch<span>.</span></h2><p className="contact-details-intro">Prefer to talk? Reach us directly.</p></div>
      <div className="contact-methods">
        {settings.phone && <div className="contact-method"><Phone size={20} strokeWidth={1.5} aria-hidden="true"/><div><span>Call</span><a href={`tel:${settings.phone}`}>{settings.phone === '+250788755016' ? '+250 788 755 016' : settings.phone}</a></div></div>}
        {settings.email && <div className="contact-method"><Mail size={20} strokeWidth={1.5} aria-hidden="true"/><div><span>Email</span><a href={`mailto:${settings.email}`}>{settings.email}</a></div></div>}
        <div className="contact-method"><MapPin size={20} strokeWidth={1.5} aria-hidden="true"/><div><span>Find us</span><p>{settings.address || 'Rwanda'}</p><small>Call ahead for office or nursery visits.</small></div></div>
      </div>
      {wa && <a href={wa} className="contact-whatsapp" target="_blank" rel="noreferrer"><MessageCircle size={19}/>Chat on WhatsApp <ArrowUpRight size={17}/></a>}
    </aside><InquiryForm services={services} initialService={service?.slice(0,150)} minimal/></div>
  </div></div>;
}
