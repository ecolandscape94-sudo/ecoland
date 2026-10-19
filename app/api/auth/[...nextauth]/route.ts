import { handlers } from '@/auth';
import { rateLimit, rateKey } from '@/lib/security';
import type { NextRequest } from 'next/server';
async function limited(request:NextRequest,handler:typeof handlers.GET){try{if(!await rateLimit(rateKey(request,'authentication'),60,600))return Response.json({error:'Too many sign-in requests. Please wait.'},{status:429});return handler(request);}catch{return Response.json({error:'Sign-in is temporarily unavailable.'},{status:503});}}
export function GET(request:NextRequest){return limited(request,handlers.GET);}
export function POST(request:NextRequest){return limited(request,handlers.POST);}
