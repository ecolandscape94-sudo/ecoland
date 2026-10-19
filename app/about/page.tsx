import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { PageIntro, Photo, Eyebrow, ButtonLink, CTA, Breadcrumb } from '@/components/ui';
import { BotanicalArt } from '@/components/botanical-art';
import { getContent } from '@/lib/content';
import { company } from '@/lib/company';
import { photos } from '@/lib/seed';
export const metadata = { title: 'Our story', description: 'Founded in 2021 by Theophile Karasira, Eco Landscapes & Gardening Ltd provides soft landscaping, gardening and nursery services from Kagugu, Kigali.', alternates: { canonical: '/about' } };
export default async function About() {
  const { settings, sections } = await getContent();
  const about = sections.find(s => s.id === 'about');
  return <>
    <Breadcrumb items={[{ label: 'Our story' }]}/>
    <header className="about-opening container"><div className="about-opening-copy"><Eyebrow>The roots of our work</Eyebrow><h1>A passion for nature.<br/><em>A purpose to grow.</em></h1><p>From a founder’s hands-on experience to a registered Rwandan landscaping company, our story begins with the belief that beautiful outdoor spaces matter.</p><div className="about-dates"><div><strong>2021</strong><span>Officially established</span></div><div><strong>Kagugu</strong><span>Our home in Kigali</span></div></div><ButtonLink href={settings.profileUrl} secondary>Download our company profile</ButtonLink></div><div className="about-opening-image"><Photo src={photos.foliage} alt="Palms, flowers and white stone garden borders by Eco Landscapes" priority/><span className="image-caption">Planting details - Eco Landscapes</span></div></header>
    <section className="company-story container"><div><Eyebrow>Our story</Eyebrow><h2>Rooted in Rwanda.<br/><em>Grown with care.</em></h2></div><div className="company-story-copy"><p>{String(about?.description || company.story)}</p><p>{company.background}</p><p>Our work serves homes, hospitals, real estate developments, learning institutions, schools, recreation centres and early childhood development spaces. We connect the supply of plant materials with landscape installation and garden maintenance.</p><div className="founder-strip"><span className="founder-monogram" aria-hidden="true">TK</span><div><h3>{company.founder}</h3><p>{company.founderRole}</p><p>Company registered on {company.founded}</p></div></div></div></section>
    <section className="company-purpose"><div className="company-purpose-grid container"><div><Eyebrow>Our mission</Eyebrow><h2>Quality, care<br/><em>and accessibility.</em></h2><p>{company.mission}</p></div><div><Eyebrow>Our vision</Eyebrow><h2>Living spaces.<br/><em>Lasting connection.</em></h2><p>{company.vision}</p></div></div><BotanicalArt/></section>
    <section className="company-nursery container"><Photo src={photos.plants} alt="Ornamental plants arranged among decorative garden rocks"/><div><Eyebrow>Our nursery advantage</Eyebrow><h2>The supply.<br/>The planting.<br/><em>The care that follows.</em></h2><p>{company.nursery}</p><p>This connection between nursery operations and landscape services is part of what makes our approach practical: plant materials, installation and maintenance in one company.</p><Link className="text-link" href="/nursery">Get to know our nursery <ArrowUpRight size={18}/></Link><span className="image-caption">Ornamental planting from our landscaping work.</span></div></section>
    <CTA/>
  </>;
}