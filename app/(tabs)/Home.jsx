import { View, Text, Button, Image } from 'react-native'
import React from 'react'
import { useAuth } from '../../context/AuthContextProvider'
import Header from '../../components/Home/Header';
import Slider from '../../components/Home/Slider';

export default function Home() {
  const { logout, user } = useAuth();
  return (
    <View>
      {/* Header */}
      <Header />
      {/* Slider */}
      <Slider />
    </View>
  )
}