import { getContent } from '@/lib/content';
import { Breadcrumb, CTA, ButtonLink, Photo } from '@/components/ui';
import { ArrowDownRight } from 'lucide-react';
import { Portfolio } from '@/components/catalogues';
import { ProfileDirectory } from '@/components/profile-directory';
import { WorkPhotoGallery } from '@/components/work-photo-gallery';
export const metadata = { title: 'Our work across Rwanda', description: 'Completed-work references from the Eco Landscapes company profile, including education, healthcare, community and residential landscapes in Rwanda.', alternates: { canonical: '/projects' } };
export default async function Projects() {
  const { projects } = await getContent();
  return <><Breadcrumb items={[{ label: 'Our work' }]}/><header className="work-opening container"><Photo src="/7.webp" alt="An Eco Landscapes garden entrance framed by ornamental trees and stone planting" priority sizes="(max-width: 700px) calc(100vw - 40px), (max-width: 1432px) calc(100vw - 112px), 1320px"/><div className="work-opening-shade"/><div className="work-opening-copy"><p className="opening-kicker">Our work <span>Rooted in Rwanda</span></p><h1>Spaces with<br/><em>room to grow.</em></h1><p>From gardens to community spaces, discover the places we have helped bring to life.</p><a href="#work-gallery-heading" className="work-opening-link">Explore the gallery <ArrowDownRight size={19}/></a></div><span className="work-opening-caption">A closer look at our work</span></header><WorkPhotoGallery/><ProfileDirectory/>{projects.length ? <><div className="container" style={{paddingBottom:35}}><h2 style={{fontSize:43}}>A closer look at our projects.</h2></div><Portfolio projects={projects}/></> : <div className="project-stories-note container"><div><h2>Let’s talk about your next space.</h2><p>Inspired by what you see? Our team can discuss the planting, garden details and care suited to your own space.</p></div><ButtonLink href="/contact?service=Landscaping">Discuss your project</ButtonLink></div>}<CTA/></>;
}
