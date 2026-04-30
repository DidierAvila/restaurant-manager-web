/**
 * NetworkStatus Component - Indicador de estado de red
 * El Buen Sazón Web Frontend - Next.js TypeScript
 */

'use client';
import { usePWA } from '@/modules/shared/presentation/hooks/usePWA';
import { WifiOff as OfflineIcon, Wifi as OnlineIcon } from '@mui/icons-material';
import { Alert, Box, Snackbar, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

export default function NetworkStatus() {
  const { isOnline } = usePWA();
  const [showOfflineNotification, setShowOfflineNotification] = useState(false);
  const [showOnlineNotification, setShowOnlineNotification] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setShowOfflineNotification(true);
      setShowOnlineNotification(false);
    } else {
      setShowOfflineNotification(false);
      // Solo mostrar notificaciÃ³n de "en lí­nea" si previamente estaba offline
      if (showOfflineNotification) {
        setShowOnlineNotification(true);
        // Auto-ocultar la notificaciÃ³n de "en lí­nea" despuÃ©s de 3 segundos
        setTimeout(() => {
          setShowOnlineNotification(false);
        }, 3000);
      }
    }
  }, [isOnline, showOfflineNotification]);

  return (
    <>
      {/* NotificaciÃ³n de offline (persistente) */}
      <Snackbar
        open={showOfflineNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ mt: 8 }}
      >
        <Alert
          severity="warning"
          sx={{
            width: '100%',
            '& .MuiAlert-message': {
              width: '100%',
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <OfflineIcon fontSize="small" />
            <Typography variant="body2">
              Sin conexión a internet. Algunas funciones pueden no estar disponibles.
            </Typography>
          </Box>
        </Alert>
      </Snackbar>

      {/* NotificaciÃ³n de online (temporal) */}
      <Snackbar
        open={showOnlineNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ mt: 8 }}
        autoHideDuration={3000}
        onClose={() => setShowOnlineNotification(false)}
      >
        <Alert
          severity="success"
          sx={{
            width: '100%',
            '& .MuiAlert-message': {
              width: '100%',
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <OnlineIcon fontSize="small" />
            <Typography variant="body2">
              Conexión restablecida. Todas las funciones están disponibles.
            </Typography>
          </Box>
        </Alert>
      </Snackbar>
    </>
  );
}
