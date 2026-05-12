import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Basic in-memory rate limiting for Edge Runtime
// Note: This is per Edge Isolate, but it effectively catches high-frequency bursts from the same source
const rateLimitMap = new Map();

export function middleware(request: NextRequest) {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : '127.0.0.1';
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const limit = 100; // max 100 requests per minute per IP

  const userData = rateLimitMap.get(ip) || { count: 0, start: now };

  if (now - userData.start > windowMs) {
    userData.count = 1;
    userData.start = now;
  } else {
    userData.count++;
  }

  rateLimitMap.set(ip, userData);

  if (userData.count > limit) {
    return new NextResponse('Too Many Requests', { 
      status: 429,
      headers: {
        'Retry-After': '60',
      }
    });
  }

  // Potential Bot Blocking
  const userAgent = request.headers.get('user-agent') || '';
  const botKeywords = ['python', 'curl', 'wget', 'postman', 'insomnia'];
  
  if (botKeywords.some(keyword => userAgent.toLowerCase().includes(keyword))) {
    // We don't block search engines (Googlebot) as they are allowed via robots.txt
    // but we can throttle aggressive scrapers
    if (userData.count > 20) {
        return new NextResponse('Bot Traffic Throttled', { status: 403 });
    }
  }

  return NextResponse.next();
}

// Only run middleware on API routes and specific pages if needed
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
