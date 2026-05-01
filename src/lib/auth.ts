/**
 * NextAuth.js Configuration - Configuración de autenticación tradicional
 * El Buen Sazón Web Frontend - Next.js TypeScript
 */

import { authService } from '@/modules/shared/application/services/api';
import { NextAuthOptions } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';

// Tipos personalizados para NextAuth
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: 'admin' | 'supervisor' | 'employee' | 'advisor';
      status: 'active' | 'inactive' | 'suspended';
      department: string;
      position: string;
      avatar: string;
    };
    accessToken?: string;
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'supervisor' | 'employee' | 'advisor';
    status: 'active' | 'inactive' | 'suspended';
    department: string;
    position: string;
    avatar: string;
    accessToken?: string;
  }
}

// Extendemos el tipo JWT para incluir informaciÃ³n del usuario
declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
    status: string;
    userId: string;
    userName: string;
    userEmail: string;
    userTypeId: string;
    userTypeName: string;
    permission: string[];
    avatar: string;
    accessToken?: string;
    idToken?: string;
    provider?: string;
  }
}

/**
 * FunciÃ³n para manejar usuarios de Google - crear o actualizar informaciÃ³n
 */

async function authenticateUser(email: string, password: string) {
  try {
    // AutenticaciÃ³n con el backend usando authService
    const loginResponse = await authService.login({ email, password });

    if (loginResponse.success && loginResponse.data !== undefined) {
      // Decodificar la informaciÃ³n del token
      const userData: JWT | null = await validateUserFromToken(loginResponse.data);
      if (!userData) {
        throw new Error('Invalid token');
      }

      // Verificar si tenemos un objeto jwt en la respuesta
      if (userData) {
        return {
          id: userData.userId,
          email: userData.userEmail,
          name: userData.userName,
          role: userData.userTypeName,
          status: 'active' as const,
          department: 'Sin asignar',
          position: 'Usuario',
          avatar:
            userData.avatar ||
            `https://api.dicebear.com/7.x/initials/svg?seed=${userData.userName}`,
          accessToken: loginResponse.data, // Token real del backend
        };
      }
      throw new Error('Error de autenticaciÃ³n. Verifique sus credenciales.');
    }
  } catch (error) {
    throw new Error('Error de autenticaciÃ³n. Verifique sus credenciales.');
  }

  return null;
}

/**
 * FunciÃ³n para validar usuario desde token JWT usando el servicio de usuarios
 */
async function validateUserFromToken(token: string): Promise<JWT | null> {
  try {
    if (!token || typeof token !== 'string') {
      return null;
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      // corrige la condiciÃ³n invertida
      return null;
    }

    const payloadB64 = parts[1];

    const payloadJson = Buffer.from(
      payloadB64.replace(/-/g, '+').replace(/_/g, '/'),
      'base64'
    ).toString('utf-8');
    const payload = JSON.parse(payloadJson);

    const jwtData: JWT = {
      id: payload.userId || payload.sub || '',
      role: payload.userTypeName || payload.role || 'employee',
      status: payload.status || 'active',
      userId: payload.userId || payload.sub || '',
      userName: payload.userName || payload.name || '',
      userEmail: payload.userEmail || payload.email || '',
      userTypeId: payload.userTypeId || payload.role_id || '',
      userTypeName: payload.userTypeName || payload.role || 'employee',
      permission: payload.permission || payload.permissions || [],
      avatar: payload.avatar || payload.image || '',
    };

    return jwtData;
  } catch (error) {
    return null;
  }
}

/**
 * ConfiguraciÃ³n de NextAuth.js
 */
export const authOptions: NextAuthOptions = {
  providers: [
    // Credentials Provider para login con backend
    CredentialsProvider({
      id: 'credentials',
      name: 'Credenciales',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'usuario@empresa.com',
        },
        password: {
          label: 'ContraseÃ±a',
          type: 'password',
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email y contraseÃ±a son requeridos');
        }

        try {
          // Usar la funciÃ³n authenticateUser local que incluye usuarios mock
          const user = await authenticateUser(credentials.email, credentials.password);

          if (user) {
            // Aseguramos que el rol sea uno de los tipos permitidos
            const validRole =
              user.role === 'admin' ||
              user.role === 'supervisor' ||
              user.role === 'employee' ||
              user.role === 'advisor'
                ? user.role
                : 'employee';

            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: validRole,
              status: user.status,
              department: user.department,
              position: user.position,
              avatar: user.avatar,
              accessToken: user.accessToken,
            };
          }

          return null;
        } catch (error: unknown) {
          throw new Error(error instanceof Error ? error.message : 'Error de autenticación');
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60, // 1 hora
  },

  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email ?? '';
        token.name = user.name ?? '';
        token.role = user.role;
        token.status = user.status;

        if (account?.provider === 'google') {
          token.idToken = account.id_token ?? undefined;
          token.provider = account.provider;
        }

        if (user.accessToken) {
          token.accessToken = user.accessToken;
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Enviar propiedades al cliente desde el token JWT
      if (token) {
        session.user = {
          id: token.id as string,
          email: token.email as string,
          name: token.name as string,
          role: token.role as 'admin' | 'supervisor' | 'employee' | 'advisor',
          status: token.status as 'active' | 'inactive' | 'suspended',
          // Campos opcionales removidos para reducir tamaÃ±o de cookie
          department: '',
          position: '',
          avatar: '',
        };
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Permite redirecciones relativas o al mismo origen
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Permite redirecciones al mismo origen
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },

    async signIn() {
      return true;
    },
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/unauthorized',
  },
  events: {
    async signIn({ user, account, isNewUser }) {
      // Limpiar cookies problemáticas al iniciar sesión
      // Las cookies se limpiarán automáticamente por NextAuth al crear nuevas
    },
    async signOut({ token, session }) {
      // Limpiar todas las cookies relacionadas con autenticación al cerrar sesión
      // NextAuth limpiará automáticaamente las cookies de sesión
    },
  },
  debug: process.env.NODE_ENV === 'development',

  // Configuración de cookies optimizada
  cookies: {
    sessionToken: {
      name: `auth.s`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60, // 1 hora
      },
    },
  },
};

export default authOptions;
