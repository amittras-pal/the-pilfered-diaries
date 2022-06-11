import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../config/firebase.config";
import { AuthContextProps, AuthContextProviderProps } from "../types/app.types";

const AuthContext = createContext<AuthContextProps>({ currentUser: null });

const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}) => {
  const [appAuth, setAppAuth] = useState<AuthContextProps>({
    currentUser: null,
  });

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (user) => {
      setAppAuth({ currentUser: user });
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
