import Link from 'next/link';
import { ArrowUpRight, ArrowDown, Leaf, Sprout, MoveRight } from 'lucide-react';
import { getContent } from '@/lib/content';
import { company } from '@/lib/company';
import { photos } from '@/lib/seed';
import { Photo } from '@/components/ui';

export const metadata = { alternates: { canonical: '/' } };

const coreCards = [
  { id: 'landscaping', image: '/1.webp', alt: 'Lawn, palms and stone-edged garden paths by Eco Landscapes', title: 'Landscapes with character.', copy: 'Thoughtful design. Natural beauty. A space that feels like yours.' },
  { id: 'maintenance', image: '/5.webp', alt: 'Carefully maintained green lawn and shaped garden planting by Eco Landscapes', title: 'Beautiful, season after season.', copy: 'The ongoing attention that keeps your garden looking its best.' },
  { id: 'supply', image: '/2.webp', alt: 'Ornamental conifers framed by natural rocks in an Eco Landscapes garden', title: 'Good things start at the roots.', copy: 'Plants, seedlings and turf to bring your next green space to life.' }
];
const finishingCards = [
  { id: 'decoration', image: '/images/service-concepts/decoration.webp', label: 'Garden decoration', title: 'The art of the finishing touch.', copy: 'Planting, colour and carefully chosen details.', alt: 'AI-created service illustration of a Kigali-style garden with flowers, palms, pebble borders and a terracotta planter' },
  { id: 'lighting', image: '/images/service-concepts/lighting-v2.webp', label: 'Snake lights & garden lighting', title: 'A garden that glows after dark.', copy: 'Warm light. Beautiful evenings. A different kind of atmosphere.', alt: 'AI-created service illustration of warm snake lights following both sides of a central stone path through a garden at evening blue hour' },
  { id: 'paving', image: '/images/service-concepts/paving.webp', label: 'Crazy paving & pathways', title: 'Every path has its own character.', copy: 'Natural texture and pathways that bring a space together.', alt: 'AI-created service illustration of an irregular natural-stone paved path through a Kigali-style garden' }
];

export default async function Home() {
  const data = await getContent();
  const hero = data.sections.find(section => section.id === 'hero');
  const serviceUrl = (id: string) => {
    const service = data.services.find(item => item.id === id);
    return service ? `/services/${service.slug}` : '/services';
  };
  return <div className="luxe-home">
    <section className="luxe-hero" aria-labelledby="welcome-heading">
      <Photo src={String(hero?.image || photos.hero)} alt="A lush garden with flowering borders and carefully shaped lawns by Eco Landscapes & Gardening Ltd" className="luxe-hero-photo" priority sizes="100vw"/>
      <div className="luxe-hero-shade"/>
      <div className="luxe-hero-content">
        <p className="luxe-welcome"><span/>Welcome to {company.name}</p>
        <h1 id="welcome-heading">A little closer<br/>to <em>nature.</em><br/>A little more <em>you.</em></h1>
        <p className="luxe-hero-description">Beautiful gardens. Thoughtful details.<br/>Outdoor spaces made for living.</p>
        <Link href="/contact?service=Site%20visit" className="luxe-button luxe-button-white">Let’s create your garden <ArrowUpRight size={19}/></Link>
      </div>
      <Link href="/projects#work-gallery-heading" className="luxe-hero-note">
        <Photo src="/10.webp" alt="Curved decorative pebble borders from our work" sizes="100px"/>
        <div><span>A glimpse of our work</span><strong>Details that make <br/>a difference.</strong></div><ArrowUpRight size={20}/>
      </Link>
      <div className="luxe-hero-bottom"><a href="#our-roots"><ArrowDown size={16}/>Discover our world</a><span>Kigali, Rwanda <i/> Est. 2021</span></div>
    </section>

    <div className="luxe-assurance luxe-wrap"><span><Sprout size={20} strokeWidth={1.3}/>From our nursery to your garden</span><span className="luxe-assurance-services">Landscaping <i/> Planting <i/> Garden care</span><a href={data.settings.profileUrl || company.profileUrl} download>Company profile <ArrowUpRight size={15}/></a></div>

    <section id="our-roots" className="luxe-intro luxe-wrap luxe-section">
      <div><p className="luxe-eyebrow">01 / Rooted in care</p><h2>Good gardens grow.<br/><em>Great spaces belong.</em></h2></div>
      <div className="luxe-intro-copy"><p className="luxe-lead">A garden is more than what you see.<br/>It’s how a place makes you feel.</p><p>We’re Eco Landscapes & Gardening Ltd, a Rwandan team bringing life to outdoor spaces. From a quiet corner at home to the grounds of a growing community, we shape, plant and care for places that matter.</p><Link href="/about" className="luxe-text-link">Get to know us <ArrowUpRight size={18}/></Link></div>
    </section>

    <section className="luxe-services luxe-wrap luxe-section" aria-labelledby="services-heading">
      <div className="luxe-section-head"><div><p className="luxe-eyebrow">02 / What we do</p><h2 id="services-heading">From the first idea<br/>to the <em>last detail.</em></h2></div><Link href="/services" className="luxe-text-link">Explore our services <ArrowUpRight size={18}/></Link></div>
      <div className="luxe-service-grid">{coreCards.map((card, index) => <Link href={serviceUrl(card.id)} className="luxe-service-card" key={card.id}>
        <div className="luxe-service-image"><Photo src={card.image} alt={card.alt} sizes="(max-width: 700px) 100vw, 33vw"/><span className="luxe-card-number">0{index + 1}</span><span className="luxe-circle-arrow"><ArrowUpRight size={22}/></span></div>
        <div className="luxe-service-body"><p className="luxe-card-label">{data.services.find(service => service.id === card.id)?.title || card.id}</p><h3>{card.title}</h3><p>{card.copy}</p></div>
      </Link>)}</div>
      <div className="luxe-services-extra"><span>And a little more green.</span><Link href={serviceUrl('installation')}>Greening & beautification <ArrowUpRight size={16}/></Link><Link href={serviceUrl('greening')}>Tree planting <ArrowUpRight size={16}/></Link></div>
    </section>

    <section className="luxe-work luxe-section" aria-labelledby="work-heading"><div className="luxe-wrap">
      <div className="luxe-section-head"><div><p className="luxe-eyebrow">03 / A closer look</p><h2 id="work-heading">Real spaces.<br/><em>Thoughtfully transformed.</em></h2></div><Link href="/projects#work-gallery-heading" className="luxe-text-link">Step into our work <ArrowUpRight size={18}/></Link></div>
      <div className="luxe-work-grid">
        <Link href="/projects#work-gallery-heading" className="luxe-work-card"><div className="luxe-work-image"><Photo src="/6.png" alt="An Eco Landscapes garden with a sweeping lawn and curved flower borders" sizes="(max-width: 700px) 100vw, 56vw"/><span className="luxe-circle-arrow"><ArrowUpRight size={22}/></span></div><div className="luxe-work-caption"><div><span>Garden design & beautification</span><h3>Nature, beautifully considered.</h3></div><span className="luxe-work-index">01</span></div></Link>
        <Link href="/projects#work-gallery-heading" className="luxe-work-card"><div className="luxe-work-image"><Photo src="/7.webp" alt="An entrance framed by ornamental conifers and rock planting by Eco Landscapes" sizes="(max-width: 700px) 100vw, 44vw"/><span className="luxe-circle-arrow"><ArrowUpRight size={22}/></span></div><div className="luxe-work-caption"><div><span>Planting & outdoor details</span><h3>A welcome worth coming home to.</h3></div><span className="luxe-work-index">02</span></div></Link>
      </div>
      <div className="luxe-references"><div><span className="luxe-eyebrow">Our project references include</span><Link href="/projects#directory-heading">View all references <MoveRight size={17}/></Link></div><span>Kepler<br/><em>College</em></span><span>Baho International<br/><em>Hospital</em></span><span>SOS Children’s Village<br/><em>Kinyinya</em></span></div>
    </div></section>

    <section id="garden-finishes" className="luxe-finishes luxe-wrap luxe-section" aria-labelledby="finishes-heading">
      <div className="luxe-section-head"><div><p className="luxe-eyebrow">04 / The details make the garden</p><h2 id="finishes-heading">A touch of character.<br/><em>A whole new feeling.</em></h2></div><p>The glow of a garden at dusk.<br/>The path that draws you in.<br/>Small details. Lasting impressions.</p></div>
      <div className="luxe-finish-grid">{finishingCards.map(card => <Link href={serviceUrl(card.id)} className="luxe-finish-card" key={card.id}><div className="luxe-finish-image"><Photo src={card.image} alt={card.alt} sizes="(max-width: 700px) 100vw, 33vw"/></div><div className="luxe-finish-copy"><p className="luxe-card-label">{card.label}</p><h3>{card.title}</h3><div><p>{card.copy}</p><span className="luxe-circle-arrow"><ArrowUpRight size={20}/></span></div></div></Link>)}</div>
    </section>

    <section className="luxe-nursery luxe-wrap" aria-labelledby="nursery-heading">
      <div className="luxe-nursery-image"><Photo src="/9.webp" alt="Lush tropical foliage and red flowers in an Eco Landscapes garden" sizes="(max-width: 700px) 100vw, 50vw"/><span>Planting details from our work</span></div>
      <div className="luxe-nursery-copy"><p className="luxe-eyebrow"><Sprout size={18} strokeWidth={1.4}/>Grown with purpose</p><h2 id="nursery-heading">Every beautiful<br/>garden starts with<br/><em>good roots.</em></h2><p>Our own nursery. Our own care. From flowers and tree seedlings to Paspalum turf grass, we help you find the right beginning for your space.</p><div className="luxe-nursery-types"><span>Flowers & shrubs</span><span>Ornamental & indigenous trees</span><span>Paspalum turf grass</span></div><Link href="/nursery" className="luxe-button luxe-button-white">Discover the nursery <ArrowUpRight size={19}/></Link></div>
    </section>

    <section className="luxe-process luxe-wrap luxe-section" aria-labelledby="process-heading"><div className="luxe-section-head"><div><p className="luxe-eyebrow">05 / A thoughtful beginning</p><h2 id="process-heading">Your idea.<br/><em>Our care, every step.</em></h2></div><p>A better outdoor space begins<br/>with a simple conversation.</p></div><div className="luxe-process-grid">{[
      ['Tell us about your space.', 'Share your ideas, your location and what you would love your garden to become.'],
      ['Let’s explore the possibilities.', 'A conversation and site visit help us understand your space and agree the right scope.'],
      ['Watch your space come to life.', 'From the first planting to ongoing care, we bring the agreed plan to life with diligence.']
    ].map(([title, copy], index) => <div key={title}><div className="luxe-step-line"><span>0{index + 1}</span><i/></div><h3>{title}</h3><p>{copy}</p></div>)}</div></section>

    {!!data.testimonials.length && <section className="luxe-testimonials luxe-wrap"><p className="luxe-eyebrow">In our clients’ words</p>{data.testimonials.map(item => <blockquote key={item.id}><p>“{String(item.quote)}”</p><cite>{String(item.attribution)}</cite></blockquote>)}</section>}

    <section className="luxe-closing" aria-labelledby="closing-heading"><Leaf size={35} strokeWidth={1.1}/><p className="luxe-eyebrow">There’s something beautiful ahead</p><h2 id="closing-heading">Your next chapter.<br/><em>A little greener.</em></h2><p>Let’s make a little room for nature.</p><div><Link href="/contact?service=Site%20visit" className="luxe-button">Plan your landscape <ArrowUpRight size={19}/></Link><a href={`tel:${data.settings.phone || company.phone}`} className="luxe-call">Or give us a call <ArrowUpRight size={16}/></a></div></section>
  </div>;
}
