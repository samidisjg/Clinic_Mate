import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { useAuth } from "../../context/AuthContextProvider";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function ChatItem({ item, router, noBorder }) {
  const { user } = useAuth();

  const openChatRoom = () => {
    router.push({pathname: '/ChatRoom', params: item})
 }
  return (
    <TouchableOpacity
      onPress={openChatRoom}
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginHorizontal: wp(5),
        gap: 3,
        marginBottom: hp(2),
        paddingBottom: hp(1),
        ...(noBorder
          ? {}
          : { borderBottomWidth: 1, borderBottomColor: "#e5e5e5" }),
      }}
    >
      <Image
        source={{ uri: item?.profileUrl }}
        style={{
          height: hp(6),
          width: hp(6),
          borderRadius: 100,
        }}
      />
      {/* name and last message */}
      <View
        style={{
          flex: 1,
          gap: 5,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontSize: hp(1.8),
              fontWeight: "semibold",
              color: "#262626",
              fontFamily: "outfit-medium",
            }}
          >
            {item?.username}
          </Text>
          <Text
            style={{
              fontSize: hp(1.6),
              fontWeight: "medium",
              color: "#737373",
              fontFamily: "outfit",
            }}
          >
            Time
          </Text>
        </View>
        <Text
          style={{
            fontSize: hp(1.6),
            fontWeight: "medium",
            color: "#737373",
            fontFamily: "outfit",
          }}
        >
          last message
        </Text>
      </View>
    </TouchableOpacity>
  );
}
