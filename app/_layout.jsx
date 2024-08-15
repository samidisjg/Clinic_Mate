import { View, Text } from 'react-native'
import React from 'react'
import { useFonts } from 'expo-font'
import { Slot } from 'expo-router'

export default function RootLayout() {
  useFonts({
    "outfit": require("./../assets/fonts/Outfit-Regular.ttf"),
    "outfit-medium": require("./../assets/fonts/Outfit-Medium.ttf"),
    "outfit-bold": require("./../assets/fonts/Outfit-Bold.ttf"),
  })
  return (
    <View style={{
      flex: 1
    }}>
      <Slot />
    </View>
  )
}