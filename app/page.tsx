import Link from 'next/link';
import { ArrowUpRight, Sprout } from 'lucide-react';
import { getContent } from '@/lib/content';
import { company } from '@/lib/company';
import { Photo } from '@/components/ui';
import { HomeHero } from '@/components/home-hero';
import { HomePartners } from '@/components/home-partners';

export const metadata = { alternates: { canonical: '/' } };

const coreCards = [
  { id: 'landscaping', image: '/1.webp', alt: 'Lawn, palms and stone-edged garden paths by Eco Landscapes', title: 'Landscaping & garden design', copy: 'Garden layouts, planting, lawns and outdoor finishes.' },
  { id: 'maintenance', image: '/5.webp', alt: 'Carefully maintained green lawn and shaped garden planting by Eco Landscapes', title: 'Garden care & maintenance', copy: 'Regular care to keep planted spaces healthy and neat.' },
  { id: 'supply', image: '/2.webp', alt: 'Ornamental conifers framed by natural rocks in an Eco Landscapes garden', title: 'Plants & seedling supply', copy: 'Flowers, fruit seedlings, trees, shrubs and Paspalum turf.' }
];
const finishingCards = [
  { id: 'decoration', image: '/images/service-concepts/decoration.webp', label: 'Garden decoration', title: 'The art of the finishing touch.', copy: 'Planting, colour and carefully chosen details.', alt: 'AI-created service illustration of a Kigali-style garden with flowers, palms, pebble borders and a terracotta planter' },
  { id: 'lighting', image: '/images/service-concepts/lighting-v2.webp', label: 'Snake lights & garden lighting', title: 'A garden that glows after dark.', copy: 'Warm light. Beautiful evenings. A different kind of atmosphere.', alt: 'AI-created service illustration of warm snake lights following both sides of a central stone path through a garden at evening blue hour' },
  { id: 'paving', image: '/images/service-concepts/paving.webp', label: 'Crazy paving & pathways', title: 'Every path has its own character.', copy: 'Natural texture and pathways that bring a space together.', alt: 'AI-created service illustration of an irregular natural-stone paved path through a Kigali-style garden' }
];

export default async function Home() {
  const data = await getContent();
  const serviceUrl = (id: string) => {
    const service = data.services.find(item => item.id === id);
    return service ? `/services/${service.slug}` : '/services';
  };
  return <div className="luxe-home">
    <HomeHero/>

    <div className="luxe-assurance luxe-wrap"><span><Sprout size={20} strokeWidth={1.3}/>From our nursery to your garden</span><span className="luxe-assurance-services">Landscaping <i/> Planting <i/> Garden care</span><a href={data.settings.profileUrl || company.profileUrl} download>Company profile <ArrowUpRight size={15}/></a></div>

    <section id="our-roots" className="luxe-about luxe-wrap luxe-section" aria-labelledby="about-heading">
      <div className="luxe-about-heading">
        <p className="luxe-eyebrow">01 / About us</p>
        <h2 id="about-heading">Your outdoors.<br/><em>Our passion.</em></h2>
      </div>
      <div className="luxe-about-visual">
        <Photo src="/10.webp" alt="An Eco Landscapes garden with sculpted shrubs, flowering plants and curved pathways edged in decorative pebbles" sizes="(max-width: 700px) 100vw, 45vw"/>
        <div className="luxe-about-seal"><Sprout size={30} strokeWidth={1.2}/><span>Rooted in care.<br/><em>Growing since 2021.</em></span></div>
        <span className="luxe-about-image-note">Thoughtful details. Beautiful outdoors.</span>
      </div>
      <div className="luxe-about-copy">
        <div className="luxe-about-card"><p className="luxe-about-card-label">Rooted in Kigali</p><p className="luxe-about-summary">We design, plant and care for gardens across Rwanda. Our nursery supplies flowers, seedlings, trees and Paspalum turf, with lighting, decoration and paving to complete each space.</p></div>
        <div className="luxe-about-actions"><Link href="/contact?service=Site%20visit" className="luxe-button">Let’s talk about your space <ArrowUpRight size={18}/></Link><Link href="/about" className="luxe-text-link">Our story <ArrowUpRight size={17}/></Link></div>
      </div>
    </section>

    <section className="luxe-services luxe-wrap luxe-section" aria-labelledby="services-heading">
      <div className="luxe-section-head"><div><p className="luxe-eyebrow">02 / What we do</p><h2 id="services-heading">From the first idea<br/>to the <em>last detail.</em></h2></div><Link href="/services" className="luxe-text-link">Explore our services <ArrowUpRight size={18}/></Link></div>
      <div className="luxe-service-grid">{coreCards.map((card, index) => <Link href={serviceUrl(card.id)} className={`luxe-service-card${index > 1 ? ' luxe-service-card-extra' : ''}`} key={card.id}>
        <div className="luxe-service-image"><Photo src={card.image} alt={card.alt} sizes="(max-width: 700px) 100vw, 33vw"/><span className="luxe-card-number">0{index + 1}</span><span className="luxe-circle-arrow"><ArrowUpRight size={22}/></span></div>
        <div className="luxe-service-body"><h3>{data.services.find(service => service.id === card.id)?.title || card.title}</h3><p>{card.copy}</p></div>
      </Link>)}</div>
      <div className="luxe-services-extra"><span>And a little more green.</span><Link href={serviceUrl('installation')}>Greening & beautification <ArrowUpRight size={16}/></Link><Link href={serviceUrl('greening')}>Tree planting <ArrowUpRight size={16}/></Link></div>
      <Link href="/services" className="luxe-mobile-projects-link"><span className="luxe-mobile-projects-copy"><small>Our services</small><strong>Explore all services</strong></span><ArrowUpRight size={19}/></Link>
    </section>

    <section className="luxe-work luxe-section" aria-labelledby="work-heading"><div className="luxe-wrap">
      <div className="luxe-section-head"><div><p className="luxe-eyebrow">03 / A closer look</p><h2 id="work-heading">Real spaces.<br/><em>Thoughtfully transformed.</em></h2></div></div>
      <div className="luxe-work-grid">
        <Link href="/projects#work-gallery-heading" className="luxe-work-card"><div className="luxe-work-image"><Photo src="/6.png" alt="An Eco Landscapes garden with a sweeping lawn and curved flower borders" sizes="(max-width: 700px) 100vw, 56vw"/><span className="luxe-circle-arrow"><ArrowUpRight size={22}/></span></div><div className="luxe-work-caption"><div><span>Garden design & beautification</span><h3>Nature, beautifully considered.</h3></div><span className="luxe-work-index">01</span></div></Link>
        <Link href="/projects#work-gallery-heading" className="luxe-work-card"><div className="luxe-work-image"><Photo src="/7.webp" alt="An entrance framed by ornamental conifers and rock planting by Eco Landscapes" sizes="(max-width: 700px) 100vw, 44vw"/><span className="luxe-circle-arrow"><ArrowUpRight size={22}/></span></div><div className="luxe-work-caption"><div><span>Planting & outdoor details</span><h3>A welcome worth coming home to.</h3></div><span className="luxe-work-index">02</span></div></Link>
      </div>
      <div className="luxe-work-action"><Link href="/projects#work-gallery-heading" className="luxe-work-cta">Step into our work <span><ArrowUpRight size={19}/></span></Link></div>
    </div></section>

    <HomePartners/>

    <section id="garden-finishes" className="luxe-finishes luxe-wrap luxe-section" aria-labelledby="finishes-heading">
      <div className="luxe-section-head"><div><p className="luxe-eyebrow">04 / The details make the garden</p><h2 id="finishes-heading">A touch of character.<br/><em>A whole new feeling.</em></h2></div><p>The glow of a garden at dusk.<br/>The path that draws you in.<br/>Small details. Lasting impressions.</p></div>
      <div className="luxe-finish-grid">{finishingCards.map(card => <Link href={serviceUrl(card.id)} className="luxe-finish-card" key={card.id}><div className="luxe-finish-image"><Photo src={card.image} alt={card.alt} sizes="(max-width: 700px) 100vw, 33vw"/></div><div className="luxe-finish-copy"><p className="luxe-card-label">{card.label}</p><h3>{card.title}</h3><div><p>{card.copy}</p><span className="luxe-circle-arrow"><ArrowUpRight size={20}/></span></div></div></Link>)}</div>
    </section>

    <section className="luxe-nursery luxe-wrap" aria-labelledby="nursery-heading">
      <div className="luxe-nursery-image"><Photo src="/9.webp" alt="Lush tropical foliage and red flowers in an Eco Landscapes garden" sizes="(max-width: 700px) 100vw, 50vw"/><span>Planting details from our work</span></div>
      <div className="luxe-nursery-copy"><p className="luxe-eyebrow"><Sprout size={18} strokeWidth={1.4}/>Grown with purpose</p><h2 id="nursery-heading">Every beautiful<br/>garden starts with<br/><em>good roots.</em></h2><p>Our own nursery. Our own care. From flowers and tree seedlings to Paspalum turf grass, we help you find the right beginning for your space.</p><div className="luxe-nursery-types"><span>Flowers & shrubs</span><span>Ornamental & indigenous trees</span><span>Paspalum turf grass</span></div><Link href="/nursery" className="luxe-button luxe-button-white">Discover the nursery <ArrowUpRight size={19}/></Link></div>
    </section>
    {!!data.testimonials.length && <section className="luxe-testimonials luxe-wrap"><p className="luxe-eyebrow">In our clients’ words</p>{data.testimonials.map(item => <blockquote key={item.id}><p>“{String(item.quote)}”</p><cite>{String(item.attribution)}</cite></blockquote>)}</section>}

    <section className="luxe-thoughtful-cta luxe-wrap" aria-labelledby="closing-heading">
      <div className="luxe-thoughtful-photo"><Photo src="/images/home-engineer-call.webp" alt="A smiling Eco Landscapes engineer taking a call at a garden project in Kigali" priority sizes="(max-width: 760px) 100vw, 42vw"/><span>Here when you’re ready to grow</span></div>
      <div className="luxe-thoughtful-copy"><p className="luxe-eyebrow">05 / A thoughtful beginning</p><p className="luxe-thoughtful-overline">There’s something beautiful ahead</p><h2 id="closing-heading">Your idea.<br/><em>Our care, every step.</em></h2><p className="luxe-thoughtful-intro">A better outdoor space begins with a simple conversation. Tell us about your space and we’ll help you explore what’s possible.</p><ol className="luxe-thoughtful-steps">{[
        ['01', 'Tell us about your space.', 'Share your ideas, location and what you would love your garden to become.'],
        ['02', 'Let’s explore the possibilities.', 'A conversation and site visit help us understand your space and agree the right scope.'],
        ['03', 'Watch your space come to life.', 'We bring the agreed plan to life with thoughtful planting and care.']
      ].map(([number, title, copy]) => <li key={number}><span>{number}</span><div><h3>{title}</h3><p>{copy}</p></div></li>)}</ol><div className="luxe-thoughtful-actions"><Link href="/contact?service=Site%20visit" className="luxe-button">Plan your landscape <ArrowUpRight size={19}/></Link><a href={`tel:${data.settings.phone || company.phone}`} className="luxe-call">Or give us a call <ArrowUpRight size={16}/></a></div></div>
    </section>
  </div>;
}
