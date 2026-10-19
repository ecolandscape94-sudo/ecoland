import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { notFound } from 'next/navigation';
import { Breadcrumb, CTA } from '@/components/ui';
import { getBlogPost, getBlogPosts } from '@/lib/blog';
import { siteUrl } from '@/lib/content';

type BlogArticleProps = { params: Promise<{ slug: string }> };

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : new Intl.DateTimeFormat('en-RW', { dateStyle: 'long', timeZone: 'UTC' }).format(date);
}

export async function generateStaticParams() {
  return (await getBlogPosts()).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogArticleProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return { title: 'Story not found' };
  return {
    title: post.title,
    description: post.content.replace(/\s+/g, ' ').slice(0, 155),
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { type: 'article', title: post.title, description: post.content.replace(/\s+/g, ' ').slice(0, 200), publishedTime: post.date || undefined, images: post.hasImage ? [`/api/blog/image/${post.id}`] : undefined },
  };
}

export default async function BlogArticle({ params }: BlogArticleProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();
  const paragraphs = post.content.split(/\r?\n\s*\r?\n/).map((paragraph) => paragraph.trim()).filter(Boolean);
  const canonical = `${siteUrl()}/blog/${post.slug}`;
  const structured = { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: post.title, datePublished: post.date || undefined, mainEntityOfPage: canonical, author: { '@type': 'Organization', name: 'Eco Landscapes & Gardening Ltd' }, publisher: { '@type': 'Organization', name: 'Eco Landscapes & Gardening Ltd' }, ...(post.hasImage ? { image: `${siteUrl()}/api/blog/image/${post.id}` } : {}) };

  return <>
    <Breadcrumb items={[{ label: 'Journal', href: '/blog' }, { label: post.title }]} />
    <article className="blog-article container">
      <Link href="/blog" className="blog-back-link"><ArrowLeft size={16} /> All stories</Link>
      <header className="blog-article-header">
        <p className="blog-article-eyebrow">From the Eco Landscapes journal</p>
        <h1>{post.title}</h1>
        {formatDate(post.date) && <time dateTime={post.date}>{formatDate(post.date)}</time>}
      </header>
      {post.hasImage && <div className="blog-article-image"><Image src={`/api/blog/image/${post.id}`} alt={post.title} fill priority sizes="(max-width: 900px) 100vw, 1100px" /></div>}
      <div className="blog-article-content">{paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
      <footer className="blog-article-footer"><span>Growing with care, in Rwanda.</span><Link href="/contact">Talk with our team <ArrowUpRight size={16} /></Link></footer>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structured).replace(/</g, '\\u003c') }} />
    </article>
    <CTA />
  </>;
}
