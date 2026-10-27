'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowUpRight, Building2, GraduationCap, HeartPulse, Leaf, Pause, Play, Sprout } from 'lucide-react';
import { profileProjects } from '@/lib/company';

const partners = [1, 2, 0, 3, 4, 12].map(index => profileProjects[index]);

export function HomePartners() {
  const [paused, setPaused] = useState(false);

  return <section id="our-partners" className="luxe-partners" aria-labelledby="partners-heading">
    <div className="luxe-wrap luxe-partners-heading">
      <div>
        <p className="luxe-eyebrow"><Sprout size={17} strokeWidth={1.4}/>Our partners</p>
        <h2 id="partners-heading">Good company.<br/><em>Greener places.</em></h2>
      </div>
      <div className="luxe-partners-intro">
        <p>From learning spaces to communities, a shared appreciation for beautifully cared-for outdoors.</p>
      </div>
    </div>

    <div id="partners-slideshow" className={`luxe-partners-window${paused ? ' is-paused' : ''}`} role="region" aria-label="Partner cards sliding from right to left" tabIndex={0}>
      <div className="luxe-partners-track">
        {[false, true].map(duplicate => <div className="luxe-partners-group" key={String(duplicate)} aria-hidden={duplicate || undefined}>
          {partners.map(partner => {
            const Icon = partner.sector === 'Education' ? GraduationCap : partner.sector === 'Healthcare' ? HeartPulse : partner.category === 'Commercial' ? Building2 : Sprout;
            return <article className="luxe-partner-card" key={partner.name}>
              <div className="luxe-partner-card-top"><span className="luxe-partner-icon"><Icon size={27} strokeWidth={1.25} aria-hidden="true"/></span><span className="luxe-partner-sector">{partner.sector}</span></div>
              <h3>{partner.name}</h3>
              <div className="luxe-partner-card-foot"><span>Landscaping & garden care</span><Leaf size={17} strokeWidth={1.3} aria-hidden="true"/></div>
              <Leaf className="luxe-partner-watermark" size={130} strokeWidth={.6} aria-hidden="true"/>
            </article>;
          })}
        </div>)}
      </div>
    </div>

    <div className="luxe-wrap luxe-partners-reference-wrap">
      <Link href="/projects#directory-heading" className="luxe-partners-reference-cta">
        <span className="luxe-partners-reference-mark"><Leaf size={22} strokeWidth={1.5} aria-hidden="true"/></span>
        <span className="luxe-partners-reference-copy"><small>Discover the places we’ve helped grow</small><strong>Explore our references</strong></span>
        <span className="luxe-partners-reference-arrow"><ArrowUpRight size={21} strokeWidth={1.8} aria-hidden="true"/></span>
      </Link>
    </div>

    <div className="luxe-wrap luxe-partners-bottom">
      <p><span aria-hidden="true"/>Growing connections across Rwanda.</p>
      <button type="button" className="luxe-partners-pause" aria-controls="partners-slideshow" onClick={() => setPaused(value => !value)}>
        {paused ? <Play size={14} aria-hidden="true"/> : <Pause size={14} aria-hidden="true"/>}
        {paused ? 'Play slideshow' : 'Pause slideshow'}
      </button>
    </div>
  </section>;
}
