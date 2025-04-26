import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';


interface AuthContextType {
    userToken: string | null;
    userEmail: string | null;
    connectionRequestId: string | null;
    setUserToken: (token: string | null) => void;
    setUserEmail: (email: string | null) => void;
    setConnectionRequestId: (connectionRequestId: string | null) => void;
    loading: boolean;
}
  
export const AuthContext = createContext<AuthContextType>({
    userToken: null,
    userEmail: null,
    connectionRequestId: null,
    setUserToken: () => {},
    setUserEmail: () => {},
    setConnectionRequestId:  () => {},
    loading: true,
  });

export const AuthProvider = ({ children }: any) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [connectionRequestId, setConnectionRequestId] = useState<string | null>(null);

  useEffect(() => {
    const loadToken = async () => {
      const token = await AsyncStorage.getItem('userToken');
      setUserToken(token);
      setLoading(false);
    };
    loadToken();
  }, []);

  return (
    <AuthContext.Provider value={{ userToken, userEmail, connectionRequestId, setUserToken,setUserEmail, setConnectionRequestId, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
