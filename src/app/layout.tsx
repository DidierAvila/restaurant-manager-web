import { CookieManager } from '@/components/shared/CookieManager';
import ConditionalLayout from '@/modules/shared/presentation/components/layout/ConditionalLayout';
import { AuthProvider } from '@/modules/shared/presentation/components/providers/AuthProvider';
import { NotificationProvider } from '@/modules/shared/presentation/components/providers/NotificationProvider';
import NetworkStatus from '@/modules/shared/presentation/components/ui/NetworkStatus';
import PWAInstallPrompt from '@/modules/shared/presentation/components/ui/PWAInstallPrompt';
import { UserProvider } from '@/modules/shared/presentation/contexts/UserContext';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import type { Metadata } from 'next';
import theme from './theme';

export const metadata: Metadata = {
  title: {
    default: 'El Buen Sazón - Sistema de Gestión de Restaurante',
    template: '%s | El Buen Sazón',
  },
  description: 'Sistema integral de gestión para restaurante.',
  keywords: [
    'SST',
    'Seguridad',
    'Salud',
    'Trabajo',
    'Colombia',
    'Gestión',
    'Prevención',
    'Riesgos',
  ],
  authors: [{ name: 'El Buen Sazón Team' }],
  creator: 'El Buen Sazón',
  publisher: 'El Buen Sazón',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3001'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    url: '/',
    title: 'El Buen Sazón - Sistema de Gestión Restaurante',
    description: 'Sistema integral de gestión para restaurante.',
    siteName: 'El Buen Sazón',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'El Buen Sazón - Sistema de Gestión Restaurante',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'El Buen Sazón - Sistema de Gestión Restaurante',
    description: 'Sistema integral de gestión para restaurante.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: false, // No indexar durante desarrollo
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  verification: {
    google: 'google-site-verification-code', // Agregar cuando tengas el código
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <AppRouterCacheProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <NotificationProvider>
                <UserProvider>
                  <CookieManager cleanOnMount={false} cleanOnSessionChange={true} />
                  <ConditionalLayout>
                    {children}
                    <PWAInstallPrompt />
                    <NetworkStatus />
                  </ConditionalLayout>
                </UserProvider>
              </NotificationProvider>
            </ThemeProvider>
          </AppRouterCacheProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
