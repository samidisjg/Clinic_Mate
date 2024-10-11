import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  ToastAndroid,
} from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "../../../constants/Colors";
import { Entypo } from "@expo/vector-icons";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../../../configs/firebaseConfig";
import { useAuth } from "../../../context/AuthContextProvider";
import CustomKeyBoardView from "../../../components/CustomKeyBoardView";
import ClinicHeader from "../../../components/IT22003546_Components/ClinicHeader";

export default function Add_Clinic() {
  const router = useRouter();
  const [clinicName, setClinicName] = useState("");
  const [hospitalName, setHospitalName] = useState(""); 
  const [clinicDays, setClinicDays] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    
  }, []);

  const onAddNewClinic = async () => {
    setLoading(true); 
    try {
      
      if (!clinicName || !hospitalName || !clinicDays) {
        throw new Error("Please fill all the fields.");
      }

      await setDoc(doc(db, "clinics", Date.now().toString()), {
        name: clinicName,
        hospital: hospitalName, 
        days: clinicDays.split(",").map(day => day.trim()), 
      });

      ToastAndroid.show("New Clinic Added Successfully", ToastAndroid.LONG);
      router.push("/IT22003546/Add_Clinic/MyClinics"); // Navigate to the clinics page
    } catch (error) {
      console.error("Error adding document: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
      <CustomKeyBoardView>
        <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
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
            <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
              <TouchableOpacity onPress={() => router.push("/IT22003546/Add_Clinic/MyClinics")}>
                <Entypo name="chevron-left" size={hp(4)} color="#737373" />
              </TouchableOpacity>
              <Text style={{ fontSize: hp(2), fontWeight: "600", color: "#262626", fontFamily: "outfit-medium" }}>
                Add Clinic
              </Text>
            </View>
          </View>

          <View style={{ height: 8, borderBottomWidth: 1, borderBottomColor: "#d4d4d4" }} />
          
          <View style={{ padding: 20 }}>
            <Text style={{ fontSize: hp(2.5), fontWeight: "600", color: Colors.PRIMARY, fontFamily: "outfit-medium", textAlign: "center", marginBottom: 20 }}>
              Add Your Clinic
            </Text>
            
            <View style={{ marginTop: 10, padding: 20, backgroundColor: "#ffffff", borderRadius: 20, elevation: 2 }}>
              <TextInput
                placeholder="Clinic Name"
                placeholderTextColor="#A9A9A9"
                value={clinicName}
                onChangeText={setClinicName}
                style={{ 
                  padding: 10, 
                  borderWidth: 1, 
                  borderRadius: 10, 
                  fontSize: 17, 
                  backgroundColor: "#fff", 
                  borderColor: Colors.PRIMARY,
                  marginBottom: 15,
                }}
              />
              <TextInput
                placeholder="Hospital Name"
                placeholderTextColor="#A9A9A9"
                value={hospitalName}
                onChangeText={setHospitalName}
                style={{ 
                  padding: 10, 
                  borderWidth: 1, 
                  borderRadius: 10, 
                  fontSize: 17, 
                  backgroundColor: "#fff", 
                  borderColor: Colors.PRIMARY,
                  marginBottom: 15,
                }}
              />
              <TextInput
                placeholder="Days (e.g. Monday, Tuesday)"
                placeholderTextColor="#A9A9A9"
                value={clinicDays}
                onChangeText={setClinicDays}
                style={{ 
                  padding: 10, 
                  borderWidth: 1, 
                  borderRadius: 10, 
                  fontSize: 17, 
                  backgroundColor: "#fff", 
                  borderColor: Colors.PRIMARY,
                  marginBottom: 15,
                }}
              />
            </View>

            <TouchableOpacity
              disabled={loading}
              style={{ 
                backgroundColor: Colors.PRIMARY, 
                padding: 15, 
                borderRadius: 10, 
                marginTop: 20,
                alignItems: 'center', // Center the text horizontally
              }}
              onPress={onAddNewClinic}
            >
              {loading ? (
                <ActivityIndicator size={"large"} color={"#fff"} />
              ) : (
                <Text style={{ textAlign: "center", color: "#fff", fontSize: 16, fontFamily: "outfit-medium" }}>
                  Add Clinic
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </CustomKeyBoardView>
    );

}
