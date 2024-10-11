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
import ClinicCard from "../../../components/IT22003546_Components/ClinicCard";
import ClinicHeader from "../../../components/IT22003546_Components/ClinicHeader";
export default function My_Clinics() {
  const { user } = useAuth();
  const [clinicList, setClinicList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      GetClinics();
    }
  }, [user]);

  /**
   * Fetch clinics added by the user using their email
   */
  const GetClinics = async () => {
    setLoading(true);
    setClinicList([]);
    const q = query(
      collection(db, "clinics"),
    );
    const snapshot = await getDocs(q);
    snapshot.forEach((doc) => {
      setClinicList((prev) => [
        ...prev,
        { id: doc.id, ...doc.data() },
      ]);
    });
    setLoading(false);
  };

  return (
    <>
      <ClinicHeader />
      
      <View
        style={{
          marginTop: hp(1),
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
            <View style={{ padding: 0, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text
              style={{
                fontSize: hp(2),
                fontWeight: "medium",
                color: "#262626",
                fontFamily: "outfit-medium",
              }}
            >
              My Clinics
            </Text>
            <TouchableOpacity onPress={() => router.push('/IT22003546/Add_Clinic/addClinic')}>
              <Text style={{ color: '#007BFF' , marginLeft: 170}}>Add Clinic</Text>
            </TouchableOpacity>
          </View>
            
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
        Your Added Clinics
      </Text>
      <FlatList
        data={clinicList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ClinicCard item={item} />} // Use the ClinicCard component
        contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 20 }}
        onRefresh={GetClinics}
        refreshing={loading}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", color: Colors.GRAY }}>
            No clinics available.
          </Text>
        }
      />
    </>
  );
}
