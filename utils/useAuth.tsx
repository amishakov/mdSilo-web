import type { ReactNode } from 'react';
import {
  useState,
  useEffect,
  useContext,
  createContext,
  useCallback,
} from 'react';
import type { User, GoTrueClient } from '@supabase/supabase-js';
import { useRouter } from 'next/router';
import apiClient from 'lib/apiClient';
import { useStore } from 'lib/store';

type AuthContextType = {
  isAuthed: boolean;
  user: User | null; // AuthUser
  signIn: (
    email: string,
    password: string
  ) => ReturnType<GoTrueClient['signIn']>;
  signUp: (
    email: string,
    password: string
  ) => ReturnType<GoTrueClient['signUp']>;
  signOut: () => ReturnType<GoTrueClient['signOut']>;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

// Provider hook that creates auth object and handles state
function useProvideAuth(): AuthContextType {
  const router = useRouter();
  const [isAuthed, setIsAuthed] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  
  const offlineMode = useStore((state) => state.offlineMode);

  // Initialize the user based on the stored session
  const initUser = useCallback(async () => {
    const session = apiClient.auth.session();
    if (session) {
      setUser(session.user);
    }
    setIsAuthed(true);
  }, []);

  useEffect(() => {
    if (offlineMode) {
      return;
    }
    initUser();
  }, [initUser, offlineMode]);

  const signIn = useCallback(
    (email: string, password: string) =>
      apiClient.auth.signIn({
        email,
        password,
      }),
    []
  );

  const signUp = useCallback(
    (email: string, password: string) =>
      apiClient.auth.signUp(
        {
          email,
          password,
        },
        { redirectTo: `${process.env.BASE_URL}/app` }
      ),
    []
  );

  const signOut = useCallback(() => apiClient.auth.signOut(), []);

  useEffect(() => {
    const { data: authListener } = apiClient.auth.onAuthStateChange(
      async (event, session) => {
        // Update user
        setUser(session?.user ?? null);
        setIsAuthed(true);

        // Redirect to /app if the user has signed in
        if (event === 'SIGNED_IN' && router.pathname === '/signin') {
          router.push('/app');
        } else if (event === 'SIGNED_OUT') {
          router.push('/signin');
        }
      }
    );
    return () => authListener?.unsubscribe();
  }, [router]);

  // Return the user object and auth methods
  return {
    isAuthed,
    user,
    signIn,
    signUp,
    signOut,
  };
}

// Provider component that wraps your app and makes auth object
// available to any child component that calls useAuth().
export function ProvideAuth({ children }: { children: ReactNode }) {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

// Hook for child components to get the auth object and re-render when it changes.
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a provider');
  }
  return context;
};
