import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { workPhotos } from '@/lib/work-photos';
import { Eyebrow } from './ui';

export function WorkPhotoGallery({ preview = false }: { preview?: boolean }) {
  const photos = preview ? [workPhotos[0], workPhotos[5], workPhotos[9]] : workPhotos;
  return <section className="work-photography container" aria-labelledby={preview ? 'home-gallery-heading' : 'work-gallery-heading'}>
    <div className="section-heading"><div><Eyebrow>A closer look at our work</Eyebrow><h2 id={preview ? 'home-gallery-heading' : 'work-gallery-heading'}>The beauty is<br/><em>in the details.</em></h2></div><p>Real gardens. Thoughtful planting. Finishing touches that bring an outdoor space together.</p></div>
    <div className={`work-photo-grid ${preview ? 'work-photo-preview' : ''}`}>
      {photos.map(photo => <figure className="work-photo-card" key={photo.src}>
        <a href={photo.src} target="_blank" rel="noreferrer" aria-label={`Open full photograph: ${photo.title}`}><Image src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} sizes="(max-width: 700px) 100vw, (max-width: 1000px) 50vw, 33vw"/><span className="work-photo-expand"><ArrowUpRight size={20}/></span></a>
        <figcaption><span>Eco Landscapes</span><h3>{photo.title}</h3></figcaption>
      </figure>)}
    </div>
    {preview ? <Link href="/projects#work-gallery-heading" className="text-link">See all 15 photographs <ArrowUpRight size={18}/></Link> : <p className="work-photo-note">A selection of our landscaping work. The named project references below are listed separately.</p>}
  </section>;
}
