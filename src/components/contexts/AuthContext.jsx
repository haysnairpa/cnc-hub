import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '@/config/firebase';
import { useAuthState, useSignOut } from 'react-firebase-hooks/auth';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, loading, error] = useAuthState(auth);
  const [signOut] = useSignOut(auth);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const getUserData = async () => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      } else {
        setUserData(null);
      }
    };

    getUserData();
  }, [user]);

  const value = {
    user,
    userData,
    loading,
    error,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);