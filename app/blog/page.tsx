import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, Leaf } from 'lucide-react';
import { Breadcrumb, Photo } from '@/components/ui';
import { getBlogPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Journal',
  description: 'Stories, advice and updates from Eco Landscapes & Gardening Ltd in Rwanda.',
  alternates: { canonical: '/blog' },
};

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : new Intl.DateTimeFormat('en-RW', { dateStyle: 'long', timeZone: 'UTC' }).format(date);
}

export default async function BlogPage() {
  const posts = await getBlogPosts();
  return <>
    <Breadcrumb items={[{ label: 'Journal' }]} />
    <header className="journal-opening container"><div className="journal-opening-top"><span>Eco Landscapes & Gardening</span><span>Notes from Rwanda</span></div><div className="journal-opening-main"><div><p className="opening-kicker">Ideas for greener living</p><h1>The<br/><em>journal.</em></h1><p className="journal-opening-description">A little inspiration, practical advice and stories from the spaces we grow.</p><a href="#journal-stories" className="opening-link">Explore the stories <ArrowUpRight size={19}/></a></div><div className="journal-opening-art"><Photo src="/9.webp" alt="Lush tropical foliage and flowers in an Eco Landscapes garden" sizes="(max-width: 480px) 70vw, (max-width: 700px) 290px, 380px"/><span><Leaf size={17}/> Notes from the garden</span></div></div></header>
    <section id="journal-stories" className="blog-collection container" aria-label="Published articles">
      {posts.length ? <div className="blog-grid">{posts.map((post) => <article className="blog-card" key={post.id}>
        <Link className="blog-card-image" href={`/blog/${post.slug}`} aria-label={`Read ${post.title}`}>
          {post.hasImage ? <Photo src={`/api/blog/image/${post.id}`} alt={post.title} sizes="(max-width: 700px) 100vw, (max-width: 1000px) 50vw, 33vw" /> : <span className="blog-image-placeholder"><Leaf size={38} strokeWidth={1} /></span>}
          <span className="blog-image-arrow"><ArrowUpRight size={21} /></span>
        </Link>
        <div className="blog-card-copy">
          {formatDate(post.date) && <time dateTime={post.date}>{formatDate(post.date)}</time>}
          <h2><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2>
          <p>{post.content.replace(/\s+/g, ' ').slice(0, 190)}{post.content.length > 190 ? '…' : ''}</p>
          <Link className="blog-read-link" href={`/blog/${post.slug}`}>Read story <ArrowUpRight size={16} /></Link>
        </div>
      </article>)}</div> : <div className="blog-empty"><span className="blog-empty-mark"><Leaf size={23} strokeWidth={1.2} /></span><p>Fresh notes are taking root.</p><span>Our first story will be here soon.</span></div>}
    </section>
  </>;
}
