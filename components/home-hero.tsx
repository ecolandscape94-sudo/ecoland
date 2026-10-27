'use client';

import Link from 'next/link';
import { getImageProps } from 'next/image';
import { useEffect, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Leaf, Pause, Play } from 'lucide-react';

const slides = [
  { src: '/hero3.webp', mobileSrc: '/1x.webp', label: 'Your garden. Expertly cared for.', theme: 'featured', alt: 'A gardener carefully measuring a curved planting border beside a green lawn overlooking Kigali' },
  { src: '/hero2.webp', mobileSrc: '/2x.webp', label: 'Beautiful from every angle.', theme: 'dark', alt: 'A contemporary home framed by a landscaped garden overlooking Kigali' },
  { src: '/hero.webp', mobileSrc: '/3x.webp', label: 'Room to reconnect.', theme: 'dark', alt: 'A landscaped garden beside a home overlooking the Kigali hills' }
];
const slideDuration = 6500;

function HeroPhoto({ src, mobileSrc, alt, first }: { src: string; mobileSrc: string; alt: string; first: boolean }) {
  const common = { alt, fill: true, sizes: '100vw', quality: 75, loading: 'eager' as const, fetchPriority: first ? 'high' as const : 'auto' as const };
  const { props: desktop } = getImageProps({ ...common, src });
  const { props: { srcSet: mobileSrcSet } } = getImageProps({ ...common, src: mobileSrc });

  return <div className="photo luxe-hero-photo"><picture><source media="(max-width: 700px)" srcSet={mobileSrcSet} sizes="100vw"/><img {...desktop}/></picture></div>;
}

export function HomeHero() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [pageHidden, setPageHidden] = useState(false);
  const playing = !paused && !reducedMotion && !pageHidden;

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => setReducedMotion(preference.matches);
    const updateVisibility = () => setPageHidden(document.hidden);
    updateMotion();
    updateVisibility();
    preference.addEventListener('change', updateMotion);
    document.addEventListener('visibilitychange', updateVisibility);
    return () => {
      preference.removeEventListener('change', updateMotion);
      document.removeEventListener('visibilitychange', updateVisibility);
    };
  }, []);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => setActive(index => (index + 1) % slides.length), slideDuration);
    return () => window.clearTimeout(timer);
  }, [active, playing]);

  function selectSlide(index: number) {
    setActive((index + slides.length) % slides.length);
    setPaused(true);
  }

  return <section
    className={`luxe-hero${slides[active].theme === 'featured' ? ' luxe-hero--featured' : ''}`}
    aria-labelledby="welcome-heading"
    aria-roledescription="carousel"
    onFocusCapture={event => {
      if (!(event.target as HTMLElement).closest('[data-rotation-control]')) setPaused(true);
    }}
  >
    <div className="luxe-hero-slides" aria-live={playing ? 'off' : 'polite'}>
      {slides.map((slide, index) => <div
        key={slide.src}
        className={`luxe-hero-slide${active === index ? ' is-active' : ''}`}
        role="group"
        aria-roledescription="slide"
        aria-label={`${index + 1} of ${slides.length}: ${slide.label}`}
        aria-hidden={active !== index}
      >
        <HeroPhoto src={slide.src} mobileSrc={slide.mobileSrc} alt={slide.alt} first={index === 0}/>
      </div>)}
    </div>
    <div className="luxe-hero-shade"/>
    <div className="luxe-hero-content">
      <p className="luxe-welcome"><span/>Rooted in Rwanda. Made for your outdoors.</p>
      <h1 id="welcome-heading"><span className="luxe-hero-brand"><Leaf size={17} strokeWidth={1.5} aria-hidden="true"/>ECO</span><span className="luxe-hero-title">Landscaping</span><br/><em><span className="luxe-hero-amp">&</span> Gardening<span className="luxe-hero-dot">.</span></em></h1>
      <p className="luxe-hero-description">From the first planting to the finishing touches,<br/>we bring your outdoor space to life.</p>
      <div className="luxe-hero-actions">
        <Link href="/services" className="luxe-button luxe-hero-cta">Our services <span><ArrowUpRight size={20}/></span></Link>
        <Link href="/contact" className="luxe-button luxe-hero-cta luxe-hero-contact">Contact us <span><ArrowUpRight size={20}/></span></Link>
      </div>
    </div>
    <div className="luxe-hero-bottom">
      <a href="#our-roots"><ArrowDown size={16}/>A little more about us</a>
      <div className="luxe-slideshow-controls" role="group" aria-label="Slideshow controls">
        <div className="luxe-slide-caption"><span>{slides[active].label}</span><div className="luxe-slide-progress" aria-label={`Slide ${active + 1} of ${slides.length}`}>
          {slides.map((slide, index) => <button key={slide.src} type="button" className={active === index ? 'is-active' : ''} onClick={() => selectSlide(index)} aria-label={`Show slide ${index + 1}: ${slide.label}`} aria-current={active === index ? 'true' : undefined}><span/></button>)}
        </div></div>
        <button type="button" className="luxe-slide-control luxe-slide-pause" data-rotation-control aria-label={paused || reducedMotion ? 'Play slideshow' : 'Pause slideshow'} onClick={() => { setPaused(playing); setReducedMotion(false); }}>{playing ? <Pause size={14}/> : <Play size={14}/>}</button>
        <button type="button" className="luxe-slide-control" aria-label="Previous slide" onClick={() => selectSlide(active - 1)}><ArrowLeft size={18}/></button>
        <span className="luxe-slide-count" aria-hidden="true">{String(active + 1).padStart(2, '0')}<i/>{String(slides.length).padStart(2, '0')}</span>
        <button type="button" className="luxe-slide-control" aria-label="Next slide" onClick={() => selectSlide(active + 1)}><ArrowRight size={18}/></button>
      </div>
    </div>
  </section>;
}
