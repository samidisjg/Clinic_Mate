import { View, Text, Button, Image } from 'react-native'
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
      <Image source={{uri: user?.profileUrl}} style={{
        width: 100,
        height: 100,
        borderRadius: 50
      }}/>
      <Button title='Sign Out' onPress={handleLogOut}/>
    </View>
  )
}