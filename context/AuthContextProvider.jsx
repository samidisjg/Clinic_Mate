import { View, Text } from "react-native";
import React, { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export default function AuthContextProvider() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(undefined);

  useEffect(() => {
    // onAuthStateChanged
  })
  return (
    <View>
      <Text>AuthContextProvider</Text>
    </View>
  );
}
