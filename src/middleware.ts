/**
 * Middleware de AutenticaciÃ³n - El Buen SazÃ³n Web
 * Protege rutas y maneja redirecciones automÃ¡ticas
 */

import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Obtener token de NextAuth JWT
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    cookieName: 'auth.s',
  });

  // Rutas pÃºblicas que NO requieren autenticaciÃ³n
  const publicRoutes = [
    '/auth/signin',
    '/auth/signup',
    '/auth/error',
    '/auth/verify',
    '/auth/register-consultant',
    '/auth/register-client',
    '/unauthorized',
    '/test-session',
  ];

  // âœ… PERMITIR: Rutas pÃºblicas
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    // Si usuario autenticado trata de ir al login â†’ Dashboard
    if (token && pathname === '/auth/signin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // ðŸ  REDIRIGIR: Ruta raÃ­z
  if (pathname === '/') {
    const destination = token ? '/dashboard' : '/auth/signin';
    return NextResponse.redirect(new URL(destination, request.url));
  }

  // ðŸš« BLOQUEAR: Usuarios no autenticados
  if (!token) {
    const signInUrl = new URL('/auth/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Verificar que el token tenga datos mínimos válidos
  if (!token.id || !token.email) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  // Bloquear usuarios inactivos (token.status se persiste desde auth.ts)
  if (token.status && token.status !== 'active') {
    const signInUrl = new URL('/auth/signin', request.url);
    signInUrl.searchParams.set('error', 'AccessDenied');
    return NextResponse.redirect(signInUrl);
  }

  // ðŸ‘‘ CONTROL DE ROLES: Rutas administrativas
  const adminRoutes = ['/admin', '/settings'];
  const supervisorRoutes = ['/reports', '/analytics'];

  if (adminRoutes.some((route) => pathname.startsWith(route))) {
    if (!token.role || token.role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  if (supervisorRoutes.some((route) => pathname.startsWith(route))) {
    if (!token.role || !['admin', 'supervisor'].includes(token.role as string)) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  // âœ… PERMITIR: Usuario autenticado con permisos correctos
  return NextResponse.next();
}

// ConfiguraciÃ³n: Rutas que debe procesar el middleware
export const config = {
  matcher: [
    /*
     * Incluir todas las rutas EXCEPTO:
     * - _next/static (archivos estÃ¡ticos)
     * - _next/image (optimizaciÃ³n de imÃ¡genes)
     * - favicon.ico (Ã­cono del sitio)
     * - api/auth/* (rutas de autenticaciÃ³n de NextAuth)
     * - @vite/* (recursos de desarrollo de Vite)
     * - *.js, *.css, *.png, *.jpg, etc. (archivos estÃ¡ticos)
     */
    '/((?!_next/static|_next/image|favicon.ico|api/auth|@vite|.*\\.(?:js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$).*)',
  ],
};
