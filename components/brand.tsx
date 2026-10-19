import Image from 'next/image';
import Link from 'next/link';
export function Brand({ footer = false }: { footer?: boolean }) {
  return <Link href="/" className={`brand ${footer ? 'brand-footer' : ''}`} aria-label="Eco Landscapes & Gardening Ltd home">
    <span className="brand-emblem" aria-hidden="true"><Image src="/images/company-brand.jpg" alt="" width={1425} height={251} sizes="300px" loading="eager" /></span>
    <span className="brand-wordmark"><strong>Eco Landscapes</strong><small>& GARDENING LTD</small></span>
  </Link>;
}
