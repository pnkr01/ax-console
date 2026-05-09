import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server'; 

// Added /onboarding to protected routes implicitly by not making it public
const publicRoutes = ['/login', '/register', '/onboarding/splash'];

export function middleware(req: NextRequest) {
  const session = req.cookies.get('AX_SESSION');
  const isPublicRoute = publicRoutes.some(path => req.nextUrl.pathname.startsWith(path));
  

  // 3. Logic: Redirect to register if unauthenticated on protected route
  if (!session && !isPublicRoute) {
    const loginUrl = new URL('/register', req.url);
    return NextResponse.redirect(loginUrl);
  }

  // 4. Logic: Redirect to workspace setup if already logged in but hitting auth pages
  if (session && isPublicRoute) {
    const setupUrl = new URL('/onboarding/setup', req.url);
    return NextResponse.redirect(setupUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};