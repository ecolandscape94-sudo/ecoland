import Link from 'next/link';
import { ArrowDown, ArrowUpRight, Leaf, MapPin, Sprout, TreePine } from 'lucide-react';
import { Photo, CTA, Breadcrumb } from '@/components/ui';
import { getContent } from '@/lib/content';
import { company } from '@/lib/company';
import { photos } from '@/lib/seed';
import './about.css';

export const metadata = { title: 'Our story', description: 'Founded in 2021 by Theophile Karasira, Eco Landscapes & Gardening Ltd provides soft landscaping, gardening and nursery services from Kagugu, Kigali.', alternates: { canonical: '/about' } };

export default async function About() {
  const { settings, sections } = await getContent();
  const about = sections.find(s => s.id === 'about');

  return <div className="story-page">
    <Breadcrumb items={[{ label: 'Our story' }]}/>

    <header className="story-hero container">
      <div className="story-hero-copy">
        <p className="story-kicker"><Sprout size={17} aria-hidden="true"/> Our story <span>Rooted in Rwanda</span></p>
        <h1>Growing beauty.<br/><em>Growing belonging.</em></h1>
        <p>We believe a thoughtful outdoor space can bring people closer to nature, and make every day feel a little more welcoming.</p>
        <a className="story-button" href="#our-beginnings">Discover our story <ArrowDown size={18} aria-hidden="true"/></a>
        <div className="story-hero-facts"><div><strong>2021</strong><span>Established in Rwanda</span></div><div><strong>Kigali</strong><span>Rooted in Kagugu</span></div></div>
      </div>
      <div className="story-hero-visual"><Photo src={photos.foliage} alt="Palms, flowers and stone garden borders" priority sizes="(max-width: 700px) calc(100vw - 40px), (max-width: 1432px) 47vw, 650px"/><div className="story-hero-badge"><Leaf size={20} aria-hidden="true"/><span>Care for every<br/><strong>growing space.</strong></span></div></div>
    </header>

    <section id="our-beginnings" className="story-beginnings container" aria-labelledby="story-heading">
      <div className="story-section-heading"><p className="story-kicker">01 / Our beginnings</p><h2 id="story-heading">A local story,<br/><em>with room to grow.</em></h2><p>From hands-on beginnings to gardens and landscapes across Rwanda.</p></div>
      <div className="story-narrative">
        <article className="story-narrative-card"><span className="story-card-number">01</span><h3>Where it began</h3><p>{String(about?.description || company.story)}</p></article>
        <article className="story-narrative-card"><span className="story-card-number">02</span><h3>Experience in the soil</h3><p>{company.background}</p></article>
        <div className="story-founder"><span className="story-founder-mark" aria-hidden="true">TK</span><div><span>Meet our founder</span><h3>{company.founder}</h3><p>{company.founderRole} · Established {company.founded}</p></div><Sprout size={28} aria-hidden="true"/></div>
      </div>
    </section>

    <section className="story-purpose" aria-labelledby="purpose-heading"><div className="container">
      <div className="story-purpose-heading"><div><p className="story-kicker">02 / What guides us</p><h2 id="purpose-heading">Care with a purpose.<br/><em>Growth with a vision.</em></h2></div><p>Thoughtful landscapes begin with the values we bring to every space.</p></div>
      <div className="story-purpose-grid"><article><span className="story-purpose-icon"><Leaf size={25} aria-hidden="true"/></span><p className="story-purpose-label">Our mission</p><h3>Care within reach.</h3><p>{company.mission}</p></article><article><span className="story-purpose-icon"><TreePine size={25} aria-hidden="true"/></span><p className="story-purpose-label">Our vision</p><h3>More life outdoors.</h3><p>{company.vision}</p></article></div>
    </div></section>

    <section className="story-nursery container" aria-labelledby="story-nursery-heading">
      <div className="story-nursery-image"><Photo src={photos.plants} alt="Ornamental plants arranged among decorative garden rocks" sizes="(max-width: 700px) calc(100vw - 40px), (max-width: 1432px) 45vw, 620px"/><span><MapPin size={16} aria-hidden="true"/> Growing in Rwanda</span></div>
      <div className="story-nursery-copy"><p className="story-kicker"><Sprout size={17} aria-hidden="true"/> 03 / From our nursery</p><h2 id="story-nursery-heading">Good gardens begin<br/><em>with good roots.</em></h2><p>{company.nursery}</p><div className="story-nursery-tags"><span>Flowers & shrubs</span><span>Tree seedlings</span><span>Paspalum (Turf grass)</span></div><Link className="story-button" href="/nursery">Explore our nursery <ArrowUpRight size={18} aria-hidden="true"/></Link></div>
    </section>
    <div className="story-profile container"><span>Get to know us better</span><a href={settings.profileUrl || company.profileUrl} download>Download our company profile <ArrowUpRight size={18} aria-hidden="true"/></a></div>
    <CTA/>
  </div>;
}
