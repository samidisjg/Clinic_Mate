import { View, Text, FlatList, TouchableOpacity, Image, Share } from "react-native";
import React from "react";
import { useAuth } from "../../context/AuthContextProvider";
import { useRouter } from "expo-router";
import { Colors } from "../../constants/Colors";

export default function MenuList() {
  const { logout, user } = useAuth();
  const router = useRouter();

  const menuList = [
    {
      id: 1,
      name: "Add Mental Health Tips & Guides",
      icon: require("./../../assets/images/add.png"),
      path: "/mentalHealth/Add_MentalHealth",
    },
    {
      id: 2,
      name: "View Mental Health Tips & Guides",
      icon: require("./../../assets/images/add.png"),
      path: "",
    },
    {
      id: 3,
      name: "Share App",
      icon: require("./../../assets/images/share_1.png"),
      path: "share",
    },
    {
      id: 4,
      name: "Logout",
      icon: require("./../../assets/images/logout.png"),
      path: "logout",
    },
  ];

  const onMenuClick = async (item) => {
    if (item.path == "logout") {
      await logout();
      return;
    }

    if (item.path == "share") {
      Share.share({
        message: "Download the Medicare App by Medicare_Team, Download URL:",
      });
      return;
    }
    router.push(item.path);
  };

  return (
    <View>
      <FlatList
        data={menuList}
        numColumns={2}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => onMenuClick(item)}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              flex: 1,
              padding: 10,
              borderRadius: 10,
              borderWidth: 1.5,
              margin: 10,
              backgroundColor: "#fff",
              borderColor: Colors.PRIMARY,
            }}
          >
            <Image
              source={item.icon}
              style={{
                width: 50,
                height: 50,
              }}
            />
            <Text
              style={{
                fontFamily: "outfit-medium",
                fontSize: 16,
                flex: 1,
              }}
            >
              {item?.name}
            </Text>
          </TouchableOpacity>
        )}
      />
      <Text
        style={{
          fontFamily: "outfit",
          fontSize: 16,
          textAlign: "center",
          marginTop: 50,
          color: Colors.GRAY,
        }}
      >
        Developed by clinic_mate @ 2024
      </Text>
    </View>
  );
}
