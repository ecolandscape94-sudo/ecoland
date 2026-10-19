'use client';
import { useState } from 'react';
import { ArrowUpRight, Sprout, GraduationCap, HeartPulse, Building2, Home, Leaf } from 'lucide-react';
import { profileProjects } from '@/lib/company';
export function ProfileDirectory() {
  const [category, setCategory] = useState('All work');
  const selected = profileProjects.filter(p => category === 'All work' || p.category === category);
  return <section className="profile-directory container" aria-labelledby="directory-heading">
    <div className="directory-heading"><div><p className="eyebrow">Our work. Rooted in care.</p><h2 id="directory-heading">Every place.<br/><em>A greener story.</em></h2></div><p>From learning spaces to neighbourhoods, explore the places we’ve worked and the landscaping, planting and garden care we delivered.</p></div>
    <div className="filters" role="group" aria-label="Filter company project references">
      {['All work', 'Residential', 'Commercial', 'Institutional'].map(c => <button className="filter" key={c} aria-pressed={category === c} onClick={() => setCategory(c)}>{c}</button>)}
    </div>
    <p className="directory-count" role="status">{selected.length} {selected.length === 1 ? 'project reference' : 'project references'} · Landscapes across Rwanda</p>
    <div className="reference-grid">{selected.map(p => {
      const number = String(profileProjects.indexOf(p) + 1).padStart(2, '0');
      const Icon = p.sector === 'Education' || p.sector === 'Early childhood development' ? GraduationCap : p.sector === 'Healthcare' ? HeartPulse : p.category === 'Residential' ? Home : p.category === 'Commercial' ? Building2 : Sprout;
      return <article className="reference-item" id={`project-${number}`} key={p.name}>
        <div className="reference-art" aria-hidden="true"><span className="reference-number">{number}</span><Icon className="reference-sector-icon" size={40} strokeWidth={1}/><span className="reference-contour"/><Leaf className="reference-botanical" strokeWidth={.5}/><span className="reference-art-caption">Cultivating better places</span></div>
        <div className="reference-card-copy"><span className="reference-category">{p.sector}</span><h3>{p.name}</h3>
        <div className="reference-delivery"><p>What we delivered</p><ul>{p.services.map(service => <li key={service}><Sprout size={17} strokeWidth={1.5} aria-hidden="true"/><span>{service}</span></li>)}</ul></div>
        <div className="reference-card-footer"><span>Eco Landscapes <Sprout size={15} aria-hidden="true"/></span><a href={`/documents/eco-landscapes-company-profile.pdf#page=${p.page}`} target="_blank" rel="noreferrer" aria-label={`Read ${p.name} reference in the company profile`}>View reference <span className="reference-arrow"><ArrowUpRight size={20}/></span></a></div></div>
      </article>;
    })}</div>
    <p className="directory-note">Project references from our company profile, with service details confirmed by our team. Residential premises are presented as a collective reference.</p>
  </section>;
}
