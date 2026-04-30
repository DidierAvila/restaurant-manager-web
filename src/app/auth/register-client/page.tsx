/**
 * Sign In Page - PÃ¡gina de inicio de sesiÃ³n OAuth Multi-Provider
 * El Buen SazÃ³n Web Frontend - Next.js TypeScript
 */

'use client';
import { useCookieManager } from '@/components/shared/CookieManager';
import {
  Email,
  Language,
  Lock,
  Login,
  Phone,
  Security,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { getSession, signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

// Componente de icono personalizado El Buen SazÃ³n (escudo con 4 cuadrantes alternados)
const ElBuenSazonIcon = ({ size = 28 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Definir la forma del escudo como clip */}
    <defs>
      <clipPath id="shield">
        <path d="M50 5L15 18V40C15 60 25 75 50 85C75 75 85 60 85 40V18L50 5Z" />
      </clipPath>
    </defs>

    {/* Fondo base azul del escudo */}
    <path d="M50 5L15 18V40C15 60 25 75 50 85C75 75 85 60 85 40V18L50 5Z" fill="#2196F3" />

    {/* Cuadrante superior derecho - blanco */}
    <rect x="50" y="5" width="35" height="40" fill="#ffffff" clipPath="url(#shield)" />

    {/* Cuadrante inferior izquierdo - blanco */}
    <rect x="15" y="45" width="35" height="40" fill="#ffffff" clipPath="url(#shield)" />

    {/* LÃ­neas divisorias */}
    <line
      x1="50"
      y1="5"
      x2="50"
      y2="85"
      stroke="rgba(0,0,0,0.15)"
      strokeWidth="1.2"
      clipPath="url(#shield)"
    />
    <line
      x1="15"
      y1="45"
      x2="85"
      y2="45"
      stroke="rgba(0,0,0,0.15)"
      strokeWidth="1.2"
      clipPath="url(#shield)"
    />

    {/* Contorno del escudo */}
    <path
      d="M50 5L15 18V40C15 60 25 75 50 85C75 75 85 60 85 40V18L50 5Z"
      fill="none"
      stroke="rgba(0,0,0,0.3)"
      strokeWidth="10"
    />
  </svg>
);

// Componente de loading para Suspense
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

// Componente principal de Sign In OAuth Multi-Provider
function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState('');
  const [error, setError] = useState('');

  // Hook para gestión de cookies
  useCookieManager({
    cleanOnMount: false,
    cleanOnLogin: true,
    cleanOnLogout: true,
  });

  // const [userType, setUserType] = useState(''); // Eliminado: selector de rol
  const [name, setName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [image, setImage] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [phoneError, setPhoneError] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [credentialsLoading, setCredentialsLoading] = useState<boolean>(false);

  // Nuevos campos para el formulario de registro de cliente
  const [companyName, setCompanyName] = useState<string>('');
  const [nit, setNit] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [department, setDepartment] = useState<string>('');
  const [industry, setIndustry] = useState<string>('');
  const [companySize, setCompanySize] = useState<string>('');
  const [employeeCount, setEmployeeCount] = useState<string>('');
  const [numberEmployes, setNumberEmployes] = useState<string>('');
  const [legalRepresentative, setLegalRepresentative] = useState<string>('');
  const [legalRepresentativeId, setLegalRepresentativeId] = useState<string>('');
  const [contactPerson, setContactPerson] = useState<string>('');
  const [contactEmail, setContactEmail] = useState<string>('');
  const [website, setWebsite] = useState<string>('');

  // Verificar si ya hay una sesiÃ³n activa
  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        router.replace('/dashboard');
      }
    });
  }, [router]);

  // Obtener error de la URL si existe
  useEffect(() => {
    const errorParam = searchParams?.get('error');
    if (errorParam) {
      setError(getErrorMessage(errorParam));
    }
  }, [searchParams]);

  /**
   * Convierte cÃ³digos de error en mensajes legibles
   */
  const getErrorMessage = (error: string): string => {
    switch (error) {
      case 'OAuthSignin':
        return 'Error al iniciar sesiÃ³n. IntÃ©ntelo nuevamente.';
      case 'OAuthCallback':
        return 'Error en la respuesta del proveedor. Verifique su conexión.';
      case 'OAuthCreateAccount':
        return 'Error al crear cuenta. Contacte al administrador.';
      case 'EmailCreateAccount':
        return 'Error con el email. Use otro email corporativo.';
      case 'Callback':
        return 'Error en el proceso de autenticaciÃ³n. IntÃ©ntelo nuevamente.';
      case 'OAuthAccountNotLinked':
        return 'Esta cuenta no estÃ¡ vinculada. Contacte al administrador.';
      case 'Configuration':
        return 'Error de configuraciÃ³n del servidor.';
      case 'AccessDenied':
        return 'Acceso denegado. No tiene permisos para acceder al sistema.';
      default:
        return 'Error de autenticaciÃ³n. IntÃ©ntelo nuevamente.';
    }
  };

  /**
   * Maneja el login con credenciales
   */
  const handleCredentialsSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (!name || !address || !email || !password || !confirmPassword || !image || !phone) {
      setError('Por favor complete todos los campos.');
      return;
    }

    // Validación de nombre: no debe contener caracteres especiales ni números
    const nameRegex = /^[a-zA-Z\s]*$/;
    if (!nameRegex.test(name)) {
      setError('El nombre no debe contener caracteres especiales ni números.');
      return;
    }

    // Validación de email
    const emailRegex = /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      setError('Por favor ingrese un email válido.');
      return;
    }

    // Validación de contraseñas: al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]).{8,}$/;
    if (!passwordRegex.test(password)) {
      setError(
        'La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula, un número y un carácter especial.'
      );
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    // Validación de URL de imagen
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    if (image && !urlRegex.test(image)) {
      setError('Por favor ingrese una URL de imagen válida.');
      return;
    }

    // Validación de número de teléfono: formato básico de 7 a 15 dígitos
    const phoneRegex = /^\+?[0-9]{7,15}$/;
    if (!phoneRegex.test(phone)) {
      setError(
        'Por favor ingrese un número de teléfono válido (7 a 15 dígitos, opcionalmente con +).'
      );
      return;
    }

    setCredentialsLoading(true);
    setError('');

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      router.push('/auth/signin?message=Registro exitoso. Por favor, inicie sesiÃ³n.');
    } catch (err) {
      setError('Error inesperado al registrar. IntÃ©ntelo nuevamente.');
    } finally {
      setCredentialsLoading(false);
    }
  };

  /**
   * Maneja el login con el proveedor especificado
   */
  const handleProviderSignIn = async (providerId: string) => {
    // Solo permitir Google por ahora
    if (providerId !== 'google') {
      return;
    }

    // Validación de userType eliminada

    setLoading(providerId);
    setError('');

    try {
      // Guardar el tipo de usuario en localStorage antes de iniciar el flujo de autenticación
      localStorage.setItem('elbuensazon_registration_type', 'client');
      // Guardar también en cookie para que el servidor pueda leerlo durante el callback
      // Cookie de corta duración (10 minutos), accesible en todo el sitio
      document.cookie = 'elbuensazon_registration_type=client; path=/; max-age=600; SameSite=Lax';

      const result = await signIn(providerId, {
        callbackUrl: '/dashboard',
        redirect: false,
        userType: 'client', // Añadimos este parámetro para identificar el tipo de usuario
      });

      if (result?.error) {
        setError(getErrorMessage(result.error));
      } else if (result?.url) {
        router.push(result.url);
      }
    } catch (err) {
      setError(`Error inesperado con ${providerId}. Inténtelo nuevamente.`);
    } finally {
      setLoading('');
    }
  };

  /**
   * Obtiene el icono para cada proveedor
   */
  const getProviderIcon = (providerId: string) => {
    switch (providerId) {
      case 'google':
        return (
          <Box
            component="img"
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google"
            sx={{ width: 20, height: 20 }}
          />
        );
      case 'facebook':
        return (
          <Box
            component="img"
            src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
            alt="Facebook"
            sx={{ width: 20, height: 20 }}
          />
        );
      case 'microsoft':
        return (
          <Box
            component="img"
            src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
            alt="Microsoft"
            sx={{ width: 20, height: 20 }}
          />
        );
      case 'linkedin':
        return (
          <Box
            component="img"
            src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png"
            alt="LinkedIn"
            sx={{ width: 20, height: 20 }}
          />
        );
      default:
        return <Security />;
    }
  };

  /**
   * Obtiene el estilo del botÃ³n para cada proveedor
   */
  const getProviderButtonStyle = (providerId: string, isActive: boolean) => {
    const baseStyle = {
      py: 1.5,
      px: 3,
      fontSize: '0.95rem',
      fontWeight: '500',
      borderRadius: 2,
      textTransform: 'none' as const,
      border: '1px solid #e0e0e0',
      minHeight: '48px',
      justifyContent: 'flex-start',
      transition: 'all 0.3s ease',
      '&:hover': {
        boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
      },
    };

    if (!isActive) {
      return {
        ...baseStyle,
        backgroundColor: '#f5f5f5',
        color: '#9e9e9e',
        cursor: 'default',
        '&:hover': {
          backgroundColor: '#f5f5f5',
          boxShadow: 'none',
        },
      };
    }

    switch (providerId) {
      case 'google':
        return {
          ...baseStyle,
          backgroundColor: '#fff',
          color: '#3c4043',
          '&:hover': {
            backgroundColor: '#f8f9fa',
            ...baseStyle['&:hover'],
          },
        };
      default:
        return {
          ...baseStyle,
          backgroundColor: '#fff',
          color: '#333',
        };
    }
  };

  // Lista de proveedores a mostrar
  const providersToShow = [
    { id: 'google', name: 'Google', active: true },
    { id: 'facebook', name: 'Facebook', active: false },
    { id: 'microsoft', name: 'Microsoft', active: false },
    { id: 'linkedin', name: 'LinkedIn', active: false },
  ];

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
            maxWidth: 800,
            margin: '0 auto',
            borderRadius: 3,
            backgroundColor: '#fff',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '1px solid rgba(0,0,0,0.05)',
          }}
        >
          {/* Header con Logo estilo simple */}
          <Box
            sx={{
              textAlign: 'center',
              pt: 6,
              pb: 4,
              px: 4,
              backgroundColor: '#fff',
            }}
          >
            {/* Logo El Buen SazÃ³n estilo oficial */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'center',
                mb: 4,
                gap: 2,
              }}
            >
              {/* Icono del escudo */}
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

              {/* Texto El Buen SazÃ³n */}
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
                El Buen SazÃ³n
              </Typography>
            </Box>

            <Typography
              variant="h5"
              component="h2"
              fontWeight="600"
              sx={{
                mb: 2,
                color: '#333',
                fontSize: '1.5rem',
              }}
            >
              Registrar Cliente
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
              Crea una cuenta de cliente para acceder a la plataforma.
            </Typography>
          </Box>

          {/* Contenido Principal */}
          <CardContent sx={{ px: 4, py: 0, pb: 4 }}>
            {/* Mostrar error si existe */}
            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  borderRadius: 2,
                }}
              >
                {error}
              </Alert>
            )}

            {/* Selector de Tu Rol eliminado */}

            {/* Formulario de Credenciales */}
            <Grid container justifyContent="center" spacing={2}>
              <Box component="form" onSubmit={handleCredentialsSignUp} sx={{ mb: 4 }}>
                <Grid sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  {/* Primera fila: Nombre y Email */}
                  <Grid size={12}>
                    <Typography variant="h6">Datos de la Empresa</Typography>
                  </Grid>

                  <Grid size={6}>
                    <TextField
                      fullWidth
                      label="Nombre de la Empresa"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          backgroundColor: '#f8f9fa',
                        },
                      }}
                    />
                  </Grid>

                  <Grid size={6}>
                    <TextField
                      fullWidth
                      label="RUT/NIT"
                      required
                      value={nit}
                      onChange={(e) => setNit(e.target.value)}
                    />
                  </Grid>

                  <Grid size={6}>
                    <TextField
                      fullWidth
                      label="Dirección"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </Grid>

                  <Grid size={6}>
                    <TextField
                      fullWidth
                      label="Teléfono"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Phone color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid size={4}>
                    <TextField
                      fullWidth
                      label="Ciudad"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </Grid>

                  <Grid size={4}>
                    <TextField
                      fullWidth
                      label="Departamento"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                    />
                  </Grid>

                  <Grid size={4}>
                    <TextField
                      fullWidth
                      label="Industria"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                    />
                  </Grid>

                  <Grid size={6}>
                    <TextField
                      fullWidth
                      label="TamaÃ±o de Empresa"
                      value={companySize}
                      onChange={(e) => setCompanySize(e.target.value)}
                    />
                  </Grid>

                  <Grid size={6}>
                    <TextField
                      fullWidth
                      label="NÃºmero de Empleados"
                      type="number"
                      value={numberEmployes || employeeCount}
                      onChange={(e) => {
                        setNumberEmployes(e.target.value);
                        setEmployeeCount(e.target.value);
                      }}
                    />
                  </Grid>

                  <Grid size={6}>
                    <TextField
                      fullWidth
                      label="Representante Legal"
                      value={legalRepresentative}
                      onChange={(e) => setLegalRepresentative(e.target.value)}
                    />
                  </Grid>

                  <Grid size={6}>
                    <TextField
                      fullWidth
                      label="IdentificaciÃ³n del Representante"
                      value={legalRepresentativeId}
                      onChange={(e) => setLegalRepresentativeId(e.target.value)}
                    />
                  </Grid>

                  <Grid size={12}>
                    <TextField
                      fullWidth
                      label="Sitio Web"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Language color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  {/* Datos de contacto */}
                  <Grid size={12}>
                    <Typography variant="h6">Datos de Contacto</Typography>
                  </Grid>

                  <Grid size={6}>
                    <TextField
                      fullWidth
                      label="Persona de Contacto"
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                    />
                  </Grid>

                  <Grid size={6}>
                    <TextField
                      fullWidth
                      label="Email de Contacto"
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  {/* Datos de acceso */}
                  <Grid size={12}>
                    <Typography variant="h6">Datos de Acceso</Typography>
                  </Grid>

                  <Grid size={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid size={6}>
                    <TextField
                      fullWidth
                      label="ContraseÃ±a"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid size={6}>
                    <TextField
                      fullWidth
                      label="Confirmar ContraseÃ±a"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              edge="end"
                            >
                              {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
                <Box sx={{ mt: 4 }}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={
                      credentialsLoading || !name || !email || !password || !confirmPassword
                    }
                    startIcon={
                      credentialsLoading ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <Login />
                      )
                    }
                    sx={{
                      py: 1.5,
                      borderRadius: 3,
                      fontSize: '1rem',
                      fontWeight: '600',
                      textTransform: 'none',
                      backgroundColor: '#2196F3',
                      '&:hover': {
                        backgroundColor: '#1976D2',
                      },
                      '&:disabled': {
                        backgroundColor: '#e0e0e0',
                        color: '#9e9e9e',
                      },
                    }}
                  >
                    {credentialsLoading ? 'Registrando...' : 'Registrar Cliente'}
                  </Button>
                </Box>
              </Box>
            </Grid>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                O regÃ­strate con
              </Typography>
            </Divider>

            {/* Botones de Proveedores OAuth */}
            <Grid container spacing={2}>
              {providersToShow.map((provider) => (
                <Grid size={6} key={provider.id}>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    disabled={loading === provider.id || !provider.active}
                    onClick={() => handleProviderSignIn(provider.id)}
                    startIcon={
                      loading === provider.id ? (
                        <CircularProgress size={20} />
                      ) : (
                        getProviderIcon(provider.id)
                      )
                    }
                    sx={getProviderButtonStyle(provider.id, provider.active)}
                  >
                    <Box sx={{ flex: 1, textAlign: 'left', ml: 1 }}>
                      {loading === provider.id ? 'Registrando...' : `${provider.name}`}
                      {!provider.active && (
                        <Typography
                          variant="caption"
                          sx={{
                            display: 'block',
                            color: '#9e9e9e',
                            fontSize: '0.7rem',
                            fontStyle: 'italic',
                          }}
                        >
                          PrÃ³ximamente
                        </Typography>
                      )}
                    </Box>
                  </Button>
                </Grid>
              ))}
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* InformaciÃ³n adicional */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                ðŸ”’ Registro seguro con OAuth 2.0
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Â¿Ya tienes cuenta? <a href="/auth/signin">Inicia sesiÃ³n aquÃ­</a>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

// Componente principal exportado con Suspense
export default function RegisterConsultantPage() {
  return (
    <Suspense fallback={<SignInLoading />}>
      <SignInContent />
    </Suspense>
  );
}
