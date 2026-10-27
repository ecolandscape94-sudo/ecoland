import type { Metadata } from 'next';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { Consent } from '@/components/consent';
import { getContent, siteUrl } from '@/lib/content';
import { company } from '@/lib/company';
import './globals.css';
import './premium.css';
import './garden-theme.css';
import './home.css';
import './page-openings.css';
import './blog.css';
export async function generateMetadata(): Promise<Metadata> { const { settings } = await getContent(); return { metadataBase: new URL(siteUrl()), title: { default: 'Eco Landscapes & Gardening Ltd | Landscaping in Rwanda', template: '%s | Eco Landscapes' }, description: settings.seoDescription, icons: { icon: [{ url: '/favicon.ico', sizes: 'any' }, { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' }, { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' }], apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }] }, manifest: '/site.webmanifest', openGraph: { type: 'website', locale: 'en_RW', siteName: 'Eco Landscapes & Gardening Ltd', images: [{ url: '/opengraph-image', width: 1200, height: 630 }] }, twitter: { card: 'summary_large_image' }, verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }; }
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { settings } = await getContent();
  const structured = { '@context': 'https://schema.org', '@type': 'LocalBusiness', name: company.name, url: siteUrl(), foundingDate: company.foundingDate, slogan: company.tagline, areaServed: { '@type': 'Country', name: 'Rwanda' }, ...(settings.email && { email: settings.email }), ...(settings.phone && { telephone: settings.phone }), ...(settings.address && { address: { '@type': 'PostalAddress', streetAddress: settings.address, addressCountry: 'RW' } }) };
  return <html lang="en" data-scroll-behavior="smooth"><body><a className="skip-link" href="#main">Skip to content</a><Navigation phone={settings.phone} address={settings.address}/><main id="main">{children}</main><Footer settings={settings}/><Consent/><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structured).replace(/</g, '\\u003c') }}/></body></html>;
}
