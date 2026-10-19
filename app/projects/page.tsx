import { getContent } from '@/lib/content';
import { PageIntro, Breadcrumb, CTA, ButtonLink } from '@/components/ui';
import { Portfolio } from '@/components/catalogues';
import { ProfileDirectory } from '@/components/profile-directory';
import { WorkPhotoGallery } from '@/components/work-photo-gallery';
export const metadata = { title: 'Our work across Rwanda', description: 'Completed-work references from the Eco Landscapes company profile, including education, healthcare, community and residential landscapes in Rwanda.', alternates: { canonical: '/projects' } };
export default async function Projects() {
  const { projects } = await getContent();
  return <><Breadcrumb items={[{ label: 'Our work' }]}/><PageIntro eyebrow="A greener footprint" title={<>Different places.<br/><em>The same thoughtful care.</em></>} description="Schools and colleges. Healthcare and community spaces. Gardens around the places people call home. Our work brings green into everyday life."/><WorkPhotoGallery/><ProfileDirectory/>{projects.length ? <><div className="container" style={{paddingBottom:35}}><h2 style={{fontSize:43}}>A closer look at our projects.</h2></div><Portfolio projects={projects}/></> : <div className="project-stories-note container"><div><h2>Let’s talk about your next space.</h2><p>Inspired by what you see? Our team can discuss the planting, garden details and care suited to your own space.</p></div><ButtonLink href="/contact?service=Landscaping">Discuss your project</ButtonLink></div>}<CTA/></>;
}
