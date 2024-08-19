import { View, Text, Button } from 'react-native'
import React from 'react'
import { useAuth } from '../../context/AuthContextProvider'

export default function Home() {
  const { logout, user } = useAuth();
  const handleLogOut = async() => {
    await logout();
  }
  
  return (
    <View>
      <Text>Home</Text>
      <Text style={{
        fontSize: 20,
        fontWeight: 'bold'
      }}>{user?.username}</Text>
      <Text>{user?.email}</Text>
      <Button title='Sign Out' onPress={handleLogOut}/>
    </View>
  )
}