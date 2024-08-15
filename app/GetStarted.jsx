import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { Colors } from "./../constants/Colors";
import { useRouter } from "expo-router";

export default function GetStarted() {
  const router = useRouter();
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
      }}
    >
      <Image
        source={require("./../assets/images/logo.png")}
        style={{
          width: 200,
          height: 200,
          alignSelf: "center",
        }}
      />
      <Image
        source={require("./../assets/images/getStarted.png")}
        style={{
          width: 400,
          height: 350,
          alignSelf: "center",
        }}
      />
      <View
        style={{
          backgroundColor: "#d0f4ce",
          padding: 20,
          borderTopLeftRadius: 50,
          borderTopRightRadius: 50,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          marginHorizontal: 7,
          marginTop: 10,
        }}
      >
        <Text
          style={{
            fontSize: 30,
            fontFamily: "outfit-bold",
            textAlign: "center",
          }}
        >
          Your Ultimate{" "}
          <Text
            style={{
              color: Colors.PRIMARY,
            }}
          >
            Community Healthcare
          </Text>{" "}
          App
        </Text>
        <Text
          style={{
            fontSize: 15,
            fontFamily: "outfit-medium",
            textAlign: "center",
            marginVertical: 15,
            color: Colors.GRAY,
          }}
        >
          Find your preferred healthcare providers near you and share your own
          health services with your community.
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: Colors.PRIMARY,
            padding: 16,
            borderRadius: 10,
            alignItems: "center",
            marginTop: 20,
            cursor: "pointer",
          }}
          onPress={() => router.push("SignIn")}
        >
          <Text
            style={{
              textAlign: "center",
              color: "#fff",
              fontFamily: "outfit",
            }}
          >
            Let's Get Started
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
