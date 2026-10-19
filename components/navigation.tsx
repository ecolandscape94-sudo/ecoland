'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowUpRight, Menu, X, Phone, MapPin } from 'lucide-react';
import { Brand } from './brand';
const links = [
  { href: '/', label: 'Home' }, { href: '/about', label: 'Our story' },
  { href: '/services', label: 'Services' }, { href: '/projects', label: 'Our work' },
  { href: '/nursery', label: 'The nursery' }, { href: '/blog', label: 'Journal' }
];
export function Navigation({ phone, address }: { phone: string; address: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);
  return <header className={`site-header${pathname === '/' ? ' home-header' : ''}`}>
    <div className="contact-ribbon"><div className="container">
      <span>Service with diligence <span aria-hidden="true">·</span> Established 2021</span>
      <div><Link href="/contact"><MapPin size={12}/>{address.includes('Kagugu') ? 'Kagugu, Kigali' : 'Visit & contact us'}</Link>{phone && <a href={`tel:${phone}`}><Phone size={12}/>{phone === '+250788755016' ? '+250 788 755 016' : phone}</a>}</div>
    </div></div>
    <div className="header-inner container">
      <Brand/>
      <nav aria-label="Main navigation" className="desktop-nav">
        {links.map(link => <Link key={link.href} href={link.href} aria-current={(link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)) ? 'page' : undefined}>{link.label}</Link>)}
      </nav>
      <Link href="/contact?service=Site%20visit" className="header-cta">Plan your landscape <ArrowUpRight size={17}/></Link>
      <button className="menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? 'Close menu' : 'Open menu'}>{open ? <X/> : <Menu/>}</button>
    </div>
    {open && <nav id="mobile-nav" aria-label="Mobile navigation" className="mobile-nav">
      {links.map(link => <Link key={link.href} href={link.href} aria-current={pathname === link.href ? 'page' : undefined}>{link.label}</Link>)}
      <Link href="/contact">Contact us <ArrowUpRight size={18}/></Link>
    </nav>}
  </header>;
}
