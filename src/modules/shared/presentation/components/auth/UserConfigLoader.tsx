/**
 * Componente para cargar la configuraciÃ³n del usuario despuÃ©s del login
 * El Buen Sazón Web Frontend - Next.js TypeScript
 */

'use client';

import { Box, CircularProgress, Typography } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useUser } from '../../contexts/UserContext';

interface UserConfigLoaderProps {
  children: React.ReactNode;
}

/**
 * Componente que carga automÃ¡ticamente la configuraciÃ³n del usuario
 * despuÃ©s de que se autentica exitosamente
 */
export function UserConfigLoader({ children }: UserConfigLoaderProps) {
  const { status } = useSession();
  const { user, isLoading } = useUser();

  // La configuraciÃ³n del usuario se carga automÃ¡ticamente en el contexto
  // cuando el usuario se autentica

  // Mostrar loading mientras se carga la configuraciÃ³n del usuario
  if (status === 'authenticated' && !user && isLoading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        gap={2}
      >
        <CircularProgress size={40} />
        <Typography variant="body1" color="text.secondary">
          Cargando configuraciÃ³n del usuario...
        </Typography>
      </Box>
    );
  }

  // Renderizar children cuando la configuraciÃ³n estÃ© lista o no sea necesaria
  return <>{children}</>;
}

export default UserConfigLoader;
