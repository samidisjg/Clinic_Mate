import {
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import React from "react";

const android = Platform.OS === "android";

export default function CustomKeyBoardView({ children }) {
  return (
    <KeyboardAvoidingView
      behavior={android ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "#f5f5f5" }}
    >
      <ScrollView
        style={{ flex: 1 }}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
