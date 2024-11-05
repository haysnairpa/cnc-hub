import { createContext, useContext } from 'react';
import { auth } from '@/lib/firebase';
import { 
  useAuthState,
  useSignInWithGoogle,
  useSignOut 
} from 'react-firebase-hooks/auth';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, loading, error] = useAuthState(auth);
  const [signInWithGoogle] = useSignInWithGoogle(auth);
  const [signOut] = useSignOut(auth);

  const value = {
    user,
    loading,
    error,
    signInWithGoogle,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);