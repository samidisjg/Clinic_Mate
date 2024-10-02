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
import PhysioExercisesCard from "../../../components/IT22607232_Components/PhysioExercisesCard";

export default function View_PhysioExercises() {
  const { user } = useAuth();
  const [ExerciseList, setExerciseList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    user && GetExerciseList();
  }, [user]);

  /**
   * Used get mental health tips by user email
   */
  const GetExerciseList = async () => {
    setLoading(true);
    setExerciseList([]);
    const q = query(
      collection(db, "physioExercises"),
      where("userEmail", "==", user?.email)
    );
    const snapshot = await getDocs(q);
    snapshot.forEach((doc) => {
        setExerciseList((prev) => [
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
              Physio Exercises
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
        practice Physio Exercises for Better Health
      </Text>
      <FlatList
        data={ExerciseList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PhysioExercisesCard item={item} />}
        contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 20 }}
        onRefresh={GetExerciseList}
        refreshing={loading}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", color: Colors.GRAY }}>
            No Physio Exercises Found
          </Text>
        }
      />
    </>
  );
}
