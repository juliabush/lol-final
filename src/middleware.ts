import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

// Create the next-intl middleware
const intlMiddleware = createMiddleware(routing);

// Custom logging middleware
export default function middleware(request: NextRequest) {
  // Get client IP address
  const ip = request.ip || 
             request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             request.headers.get('cf-connecting-ip') || 
             'unknown';

  // Get request details
  const uri = request.nextUrl.pathname;
  const method = request.method;
  const userAgent = request.headers.get('user-agent') || 'unknown';
  const referer = request.headers.get('referer') || 'direct';
  const timestamp = new Date().toISOString();

  // Log the request
  console.log(JSON.stringify({
    timestamp,
    ip,
    method,
    uri,
    userAgent,
    referer,
    host: request.headers.get('host'),
    country: request.headers.get('cf-ipcountry') || 'unknown',
    region: request.headers.get('cf-region') || 'unknown'
  }));

  // Call the next-intl middleware
  return intlMiddleware(request);
}
 
export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  // - … sitemap.xml and robots.txt
  matcher: '/((?!api|trpc|_next|_vercel|sitemap|robots|.*\\..*).*)'
};