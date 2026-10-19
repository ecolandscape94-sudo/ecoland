'use client';
import { useEffect, useState } from 'react';
import Script from 'next/script';
import Link from 'next/link';
export function Consent() {
 const [consent, setConsent] = useState<string | null>('pending');
 useEffect(() => { setConsent(localStorage.getItem('eco-analytics')); }, []);
 const id = process.env.NEXT_PUBLIC_GA_ID;
 if (!id || !/^G-[A-Z0-9]+$/.test(id)) return null;
 return <>{!consent && <div className="cookie-banner" role="region" aria-label="Analytics choices"><p>Allow optional analytics to help us improve the website? <Link href="/privacy">Privacy details</Link></p><button onClick={() => { localStorage.setItem('eco-analytics', 'no'); setConsent('no'); }}>Decline</button><button className="button" onClick={() => { localStorage.setItem('eco-analytics', 'yes'); setConsent('yes'); }}>Allow analytics</button></div>}{consent === 'yes' && <><Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive"/><Script id="eco-ga" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${id}',{anonymize_ip:true});`}</Script></> }</>;
}
