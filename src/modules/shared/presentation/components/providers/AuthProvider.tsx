/**
 * Session Provider - Proveedor de contexto de sesiÃ³n
 * El Buen Sazón Web Frontend - Next.js TypeScript
 */

'use client';
import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  return <SessionProvider>{children}</SessionProvider>;
}
