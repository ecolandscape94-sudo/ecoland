'use client';
import { useRef, useState } from 'react';
import { X, ArrowLeft, ArrowRight } from 'lucide-react';
import { Photo } from './ui';
export function ProjectGallery({images}:{images:{url:string;caption:string}[]}){
 const [index,setIndex]=useState(0);const dialog=useRef<HTMLDialogElement>(null);
 if(!images.length)return null;
 function open(i:number){setIndex(i);dialog.current?.showModal();}
 function next(direction:number){setIndex(i=>(i+direction+images.length)%images.length);}
 return <><div className="gallery-grid">{images.map((image,i)=><button key={i} onClick={()=>open(i)} aria-label={`Open photograph ${i+1}: ${image.caption}`}><Photo src={image.url} alt={image.caption||`Project photograph ${i+1}`}/><span>{image.caption}</span></button>)}</div><dialog ref={dialog} className="lightbox" aria-label="Project image gallery" onKeyDown={e=>{if(e.key==='ArrowLeft'){e.preventDefault();next(-1);}if(e.key==='ArrowRight'){e.preventDefault();next(1);}}} onClick={e=>{if(e.target===dialog.current)dialog.current.close();}}><button className="lightbox-close" aria-label="Close gallery" onClick={()=>dialog.current?.close()}><X size={21}/></button><Photo src={images[index].url} alt={images[index].caption||`Project photograph ${index+1}`} sizes="95vw"/><div className="lightbox-controls"><button onClick={()=>next(-1)} aria-label="Previous photograph"><ArrowLeft/></button><p>{images[index].caption} <span>{index+1} / {images.length}</span></p><button onClick={()=>next(1)} aria-label="Next photograph"><ArrowRight/></button></div></dialog></>;
}
export function BeforeAfter({before,after}:{before:string;after:string}){const [amount,setAmount]=useState(50);return <div className="comparison"><Photo src={after} alt="Completed project after landscaping" sizes="100vw"/><div style={{position:'absolute',inset:0,clipPath:`inset(0 ${100-amount}% 0 0)`}}><Photo src={before} alt="The same project before landscaping" sizes="100vw"/></div><div className="comparison-line" style={{left:`${amount}%`}}/><span className="comparison-tag">Before</span><span className="comparison-tag right">After</span><label>Compare<input type="range" min={0} max={100} value={amount} onChange={e=>setAmount(Number(e.target.value))} aria-label="Before and after image comparison" aria-valuetext={`${amount}% before, ${100-amount}% after`}/></label></div>;}
