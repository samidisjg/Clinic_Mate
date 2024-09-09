import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Colors } from "../../../constants/Colors";

export default function Intro({ mentalHealthTips }) {
  const router = useRouter();
  return (
    <View>
      <View
        style={{
          position: "absolute",
          zIndex: 10,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          padding: 20,
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-circle" size={40} color={Colors.PRIMARY} />
        </TouchableOpacity>
        <Ionicons
          name="notifications-outline"
          size={38}
          color={Colors.PRIMARY}
        />
      </View>
      <Image
        source={{ uri: mentalHealthTips?.imageUrl }}
        style={{
          width: "100%",
          height: 340,
        }}
      />
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 20,
          marginTop: -20,
          backgroundColor: "#fff",
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
        }}
      >
        <Text
          style={{
            fontSize: 26,
            fontFamily: "outfit-medium",
            flex: 1,
            marginRight: 10,
            flexWrap: "wrap",
            color: Colors.PRIMARY,
          }}
        >
          {mentalHealthTips?.title}
        </Text>
        <Text
          style={{
            fontSize: 12,
            fontFamily: "outfit",
            flexShrink: 1,
            backgroundColor: Colors.GRAY,
            color: Colors.PRIMARY,
            fontWeight: "bold",
            padding: 10,
            borderRadius: 10,
            overflow: "hidden",
          }}
        >
          {mentalHealthTips?.category}
        </Text>
      </View>
    </View>
  );
}
