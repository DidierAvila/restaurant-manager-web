/**
 * Conditional Layout - Decide quÃ© layout usar segÃºn la ruta
 * El Buen Sazón Web Frontend - Next.js TypeScript
 */
'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import UserConfigLoader from '../auth/UserConfigLoader';
import MainLayout from './MainLayout';

interface ConditionalLayoutProps {
  children: ReactNode;
}

// Rutas que no deben tener el layout principal (menÃº, sidebar, etc.)
const AUTH_ROUTES = [
  '/auth/signin',
  '/auth/signup',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/verify-email',
  '/auth/error',
  '/auth/register-consultant',
  '/auth/register-client',
];

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();

  // Si la ruta actual es de autenticaciÃ³n, renderizar sin layout
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname?.startsWith(route));

  if (isAuthRoute) {
    return <>{children}</>;
  }

  // Para todas las demÃ¡s rutas, usar el MainLayout con carga de configuraciÃ³n
  return (
    <UserConfigLoader>
      <MainLayout>{children}</MainLayout>
    </UserConfigLoader>
  );
}
