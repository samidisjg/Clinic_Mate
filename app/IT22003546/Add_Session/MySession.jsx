import { View, Text, TouchableOpacity, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { router } from "expo-router";
import { Entypo } from "@expo/vector-icons";
import { useAuth } from "../../../context/AuthContextProvider";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../configs/firebaseConfig";
import { Colors } from "../../../constants/Colors";
import SessionCard from "../../../components/IT22003546_Components/SessionCard"; // Update to use SessionCard

export default function My_Sessions() {
  const { user } = useAuth();
  const [sessionList, setSessionList] = useState([]); // Update state for sessions
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      GetSessions(); // Fetch sessions instead of clinics
    }
  }, [user]);

  /**
   * Fetch sessions added by the user using their email
   */
  const GetSessions = async () => {
    setLoading(true);
    setSessionList([]); // Clear the previous session list
    const q = query(collection(db, "sessions")); // Query sessions collection
    const snapshot = await getDocs(q);
    snapshot.forEach((doc) => {
      setSessionList((prev) => [
        ...prev,
        { id: doc.id, ...doc.data() },
      ]);
    });
    setLoading(false);
  };

  return (
    <>
      <View
        style={{
          marginTop: hp(4),
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: wp(5),
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
          }}
        >
          <TouchableOpacity onPress={() => router.push("Profile")}>
            <Entypo name="chevron-left" size={hp(4)} color="#737373" />
          </TouchableOpacity>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
            }}
          >
            <Text
              style={{
                fontSize: hp(2),
                fontWeight: "medium",
                color: "#262626",
                fontFamily: "outfit-medium",
              }}
            >
              My Sessions
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          height: 8,
          borderBottomWidth: 1,
          borderBottomColor: "#d4d4d4",
        }}
      />
      <Text
        style={{
          fontSize: hp(2.5),
          fontWeight: "medium",
          color: Colors.PRIMARY,
          fontFamily: "outfit-medium",
          textAlign: "center",
          marginVertical: 10,
        }}
      >
        Your Added Sessions
      </Text>
      <FlatList
        data={sessionList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <SessionCard item={item} />} // Use the SessionCard component
        contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 20 }}
        onRefresh={GetSessions}
        refreshing={loading}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", color: Colors.GRAY }}>
            No sessions available.
          </Text>
        }
      />
    </>
  );
}
