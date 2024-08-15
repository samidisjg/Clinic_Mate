import { View, Text } from "react-native";
import React, { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export default function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(undefined);

  useEffect(() => {
    // onAuthStateChanged
    setTimeout(() => {
      setIsAuthenticated(true);
    }, 3000);
  })

  const login = async (email, password) => {
    try {

    } catch(e) {

    }
  }

  const logout = async () => {
    try {

    } catch(e) {
      
    }
  }

  const register = async (email, password, username, profilePicture) => {
    try {

    } catch(e) {
      
    }
  }

  return (
    <AuthContext.Provider value={{user, isAuthenticated, login, register, logout}}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const value = useContext(AuthContext);
  if (!value) {
     throw new Error('useAuth must be used within a AuthContextProvider');
  } 
  return value;
}