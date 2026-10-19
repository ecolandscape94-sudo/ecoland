'use client';
export default function ErrorPage({reset}:{reset:()=>void}){return <div className="empty-state container" style={{marginBlock:80}}><h2>A brief pause.</h2><p>The page could not load. Please try again in a moment.</p><button className="button" onClick={reset}>Try again</button></div>;}
