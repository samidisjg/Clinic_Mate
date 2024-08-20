import { View, Text, StatusBar, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import ChatRoomHeader from "../components/IT22577160_Components/ChatRoomHeader";
import MessageList from "../components/IT22577160_Components/MessageList";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Feather } from "@expo/vector-icons";
import CustomKeyBoardView from "../components/CustomKeyBoardView";

export default function ChatRoom() {
  const item = useLocalSearchParams();
  const router = useRouter();
  const [messages, setMessages] = useState([]);

  return (
    <CustomKeyBoardView>
      <View
        style={{
          flex: 1,
          backgroundColor: "#f5f5f5",
        }}
      >
        <StatusBar style="dark" />
        <ChatRoomHeader user={item} router={router} />
        <View
          style={{
            height: 8,
            borderBottomWidth: 1,
            borderBottomColor: "#d4d4d4",
          }}
        />
        <View
          style={{
            flex: 1,
            justifyContent: "space-between",
            backgroundColor: "#f5f5f5",
            overflow: "visible",
          }}
        >
          <View style={{ flex: 1 }}>
            <MessageList messages={messages} />
          </View>
          <View
            style={{
              marginBottom: hp(1.7),
              paddingTop: hp(1.7),
            }}
          >
            <View
              style={{
                flexDirection: "row",
                marginHorizontal: 10,
                justifyContent: "space-between",
                backgroundColor: "#fff",
                padding: 5,
                borderWidth: 1,
                borderColor: "#d4d4d4",
                borderRadius: 50,
                paddingLeft: 10,
              }}
            >
              <TextInput
                placeholder="Type message..."
                style={{
                  flex: 1,
                  fontSize: hp(1.8),
                  fontFamily: "outfit-medium",
                  marginRight: 10,
                }}
              />
              <TouchableOpacity
                style={{
                  backgroundColor: "#e5e5e5",
                  padding: 8,
                  marginRight: 5,
                  borderRadius: 50,
                }}
              >
                <Feather name="send" size={hp(2.7)} color="#737373" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </CustomKeyBoardView>
  );
}
