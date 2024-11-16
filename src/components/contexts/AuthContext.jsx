import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "@/config/firebase";
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
	const [user, loadingFromAuth, error] = useAuthState(auth);
	const [signOut] = useSignOut(auth);
	const [isLoading, setIsLoading] = useState(false);
	const [userData, setUserData] = useState(null);

	const getUserData = async () => {
		setIsLoading(true);
		try {
			if (user) {
				const docRef = doc(db, "users", user.uid);
				const docSnap = await getDoc(docRef);
				if (docSnap.exists()) {
					setUserData(docSnap.data());
				}
			} else {
				setUserData(null);
			}
		} catch (error) {
			setUserData(null);
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		getUserData();
	}, [user]);

	const value = {
		user,
		userData,
		loadingFromAuth,
		error,
		isLoading,
		getUserData,
		signOut,
		setIsLoading,
	};

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
}

export const useAuth = () => useContext(AuthContext);
