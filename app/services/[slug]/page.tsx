import { notFound } from 'next/navigation';
import { Check, MessageCircle } from 'lucide-react';
import { getContent, whatsappLink } from '@/lib/content';
import { Breadcrumb, PageIntro, Photo } from '@/components/ui';
import { InquiryForm } from '@/components/inquiry-form';
type Props = { params: Promise<{slug:string}> };
export async function generateMetadata({params}:Props) {
  const {slug} = await params;
  const {services} = await getContent();
  const service = services.find(s => s.slug === slug);
  return { title: service?.title || 'Service not found', description: service?.description, alternates: { canonical: `/services/${slug}` } };
}
export default async function ServiceDetail({params}:Props) {
  const {slug} = await params;
  const {services,settings} = await getContent();
  const service = services.find(s => s.slug === slug);
  if (!service) notFound();
  const wa = whatsappLink(settings.whatsapp,service.title);
  return <><Breadcrumb items={[{label:'Services',href:'/services'},{label:service.title}]}/><PageIntro eyebrow="Our expertise" title={service.title} description={service.description}/><div className="container"><Photo src={service.image} alt={service.imagery === 'company' ? service.title : `${service.title}; illustrative photography`} className="wide-photo" priority sizes="100vw"/><span className="image-caption">{service.imagery === 'company' ? 'Eco Landscapes & Gardening Ltd' : 'Illustrative service photography'}</span><div className="detail-layout"><div className="detail-copy"><h2>What it means<br/><em>for your space.</em></h2><ul className="benefit-list">{service.benefits.map(benefit => <li key={benefit}><Check size={19}/><span>{benefit}</span></li>)}</ul><h2>A thoughtful beginning.</h2><p>Tell us about your location, the kind of space you have and what you would like to achieve. A conversation and site visit help identify suitable options and an agreed scope before work begins.</p>{service.id === 'supply' && <p>Our company has its own nursery for flowers, shrubs, and ornamental and indigenous tree seedlings, alongside Paspalum (Turf grass) plots on the outskirts of Kigali. Confirm current varieties, sizes and quantities with the team.</p>}{service.faqs.length > 0 && <div className="faq"><h2>A few useful answers</h2>{service.faqs.map(faq => <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</div>}{wa && <a href={wa} className="button secondary" target="_blank" rel="noreferrer"><MessageCircle size={17}/>Ask on WhatsApp</a>}</div><InquiryForm compact services={services} initialService={service.title}/></div></div></>;
}