'use client';
import { useCookieManager } from '@/components/shared/CookieManager';
import { Email, Lock, Login, Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { getSession, signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

const ElBuenSazonIcon = ({ size = 28 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Plato */}
    <circle cx="50" cy="52" r="34" fill="#E3F2FD" stroke="#2196F3" strokeWidth="3.5" />
    <circle cx="50" cy="52" r="24" fill="#ffffff" stroke="#90CAF9" strokeWidth="2" />

    {/* Tenedor (izquierda) */}
    <line x1="28" y1="14" x2="28" y2="36" stroke="#2196F3" strokeWidth="3" strokeLinecap="round" />
    <line
      x1="24"
      y1="14"
      x2="24"
      y2="26"
      stroke="#2196F3"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <line
      x1="32"
      y1="14"
      x2="32"
      y2="26"
      stroke="#2196F3"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M24 26 Q28 30 32 26"
      stroke="#2196F3"
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
    />
    <line x1="28" y1="36" x2="28" y2="56" stroke="#2196F3" strokeWidth="3" strokeLinecap="round" />

    {/* Cuchillo (derecha) */}
    <path
      d="M72 14 C72 14 76 20 76 28 C76 33 73 36 72 37 L72 56"
      stroke="#2196F3"
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

function SignInLoading() {
  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
      <Paper elevation={8} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <CircularProgress />
          <Typography variant="body2" sx={{ mt: 2 }}>
            Cargando...
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useCookieManager({
    cleanOnMount: false,
    cleanOnLogin: true,
    cleanOnLogout: true,
  });

  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        router.replace('/dashboard');
      }
    });
  }, [router]);

  useEffect(() => {
    const errorParam = searchParams?.get('error');
    if (errorParam) {
      setError(getErrorMessage(errorParam));
    }
  }, [searchParams]);

  const getErrorMessage = (error: string): string => {
    switch (error) {
      case 'AccessDenied':
        return 'Acceso denegado. No tiene permisos para acceder al sistema.';
      case 'Configuration':
        return 'Error de configuración del servidor.';
      default:
        return 'Credenciales inválidas. Verifique su email y contraseña.';
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Por favor ingresa tu email y contraseña.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        callbackUrl: '/dashboard',
        redirect: false,
      });

      if (result?.error) {
        setError(getErrorMessage(result.error));
      } else if (result?.url) {
        router.push(result.url);
      }
    } catch (err) {
      setError('Error inesperado al iniciar sesión. Inténtelo nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Card
          elevation={6}
          sx={{
            width: '100%',
            maxWidth: 450,
            margin: '0 auto',
            borderRadius: 3,
            backgroundColor: '#fff',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '1px solid rgba(0,0,0,0.05)',
          }}
        >
          <Box
            sx={{
              textAlign: 'center',
              pt: 6,
              pb: 4,
              px: 4,
              backgroundColor: '#fff',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'center',
                mb: 4,
                gap: 2,
              }}
            >
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transform: 'translateY(8px)',
                }}
              >
                <ElBuenSazonIcon size={56} />
              </Box>

              <Typography
                variant="h2"
                component="h1"
                sx={{
                  color: '#2196F3',
                  fontSize: '3.2rem',
                  fontWeight: 700,
                  letterSpacing: '-0.01em',
                  fontFamily: '"Segoe UI", "Roboto", "Arial", sans-serif',
                  lineHeight: 1,
                  margin: 0,
                }}
              >
                El Buen Sazón
              </Typography>
            </Box>

            <Typography
              variant="h5"
              component="h2"
              fontWeight="600"
              sx={{ mb: 2, color: '#333', fontSize: '1.5rem' }}
            >
              Iniciar Sesión
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#666',
                fontSize: '1rem',
                maxWidth: '350px',
                mx: 'auto',
                lineHeight: 1.5,
                mb: 1,
              }}
            >
              Sistema de administración para restaurantes
            </Typography>
          </Box>

          <CardContent sx={{ px: 4, py: 0, pb: 4 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSignIn}>
              <TextField
                fullWidth
                type="email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    backgroundColor: '#f8f9fa',
                    '&:hover fieldset': { borderColor: '#2196F3' },
                    '&.Mui-focused fieldset': { borderColor: '#2196F3' },
                  },
                }}
              />

              <TextField
                fullWidth
                type={showPassword ? 'text' : 'password'}
                label="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        disabled={loading}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    backgroundColor: '#f8f9fa',
                    '&:hover fieldset': { borderColor: '#2196F3' },
                    '&.Mui-focused fieldset': { borderColor: '#2196F3' },
                  },
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading || !email || !password}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Login />}
                sx={{
                  py: 1.5,
                  borderRadius: 3,
                  fontSize: '1rem',
                  fontWeight: '600',
                  textTransform: 'none',
                  backgroundColor: '#2196F3',
                  '&:hover': { backgroundColor: '#1976D2' },
                  '&:disabled': { backgroundColor: '#e0e0e0', color: '#9e9e9e' },
                }}
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </Box>

            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="caption" color="text.secondary">
                ¿Problemas para acceder? Contacte al administrador
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<SignInLoading />}>
      <SignInContent />
    </Suspense>
  );
}
