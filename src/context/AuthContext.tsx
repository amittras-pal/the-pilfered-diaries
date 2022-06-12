import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, fireStore } from "../config/firebase.config";
import { AuthContextProps, AuthContextProviderProps } from "../types/app.types";

const AuthContext = createContext<AuthContextProps>({
  currentUser: null,
  isAdmin: false,
});

const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}) => {
  const [appAuth, setAppAuth] = useState<AuthContextProps>({
    currentUser: null,
    isAdmin: false,
  });

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAppAuth((prev) => ({ ...prev, currentUser: user }));
        const usersCollection = collection(fireStore, "users");
        const userQuery = query(
          usersCollection,
          where("userId", "==", user.uid)
        );
        getDocs(userQuery).then((snapshot) => {
          const isAdmin = snapshot.docs[0].data().admin;
          if (isAdmin) setAppAuth((prev) => ({ ...prev, isAdmin }));
        });
      } else {
        setAppAuth({ currentUser: null, isAdmin: false });
      }
    });
    return () => {
      unSubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={appAuth}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContextProvider;
