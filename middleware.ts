import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Хориглох route-ууд
  const blockedRoutes = ['/admin', '/verify', '/location']
  
  // Хэрэв хориглогдсон route бол home page руу redirect
  if (blockedRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/', request.url))
  }
  
  return NextResponse.next()
}

// Middleware ажиллах route-ууд
export const config = {
  matcher: [
    /*
     * Дараах route-уудаас бусад бүх route-д ажиллана:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
