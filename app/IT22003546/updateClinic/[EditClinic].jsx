import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../configs/firebaseConfig"; // Adjust according to your config
import { Colors } from "../../../constants/Colors";
import CustomKeyBoardView from "../../../components/CustomKeyBoardView";
import { Entypo } from "@expo/vector-icons";
import ClinicHeader from "../../../components/IT22003546_Components/ClinicHeader";
import RNPickerSelect from "react-native-picker-select";


const daysOfWeek = [
  { label: "Monday", value: "Monday" },
  { label: "Tuesday", value: "Tuesday" },
  { label: "Wednesday", value: "Wednesday" },
  { label: "Thursday", value: "Thursday" },
  { label: "Friday", value: "Friday" },
  { label: "Saturday", value: "Saturday" },
  { label: "Sunday", value: "Sunday" },
];

export default function EditClinic() {
  const router = useRouter();
  const { EditClinic } = useLocalSearchParams(); // Fetch the clinic ID from route params
  const [name, setName] = useState("");
  const [hospital, setHospital] = useState("");
  const [selectedDays, setSelectedDays] = useState(""); // Store selected days as a comma-separated string
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClinicDetails();
  }, []);

  // Fetch the clinic details by its ID
  const fetchClinicDetails = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, "clinics", EditClinic);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setName(data.name);
        setHospital(data.hospital);
        setSelectedDays(data.days.join(", ")); // Assuming days are stored as an array in Firestore
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching document: ", error);
    } finally {
      setLoading(false);
    }
  };

  // Update the clinic details
  const onUpdateClinic = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, "clinics", EditClinic);
      await updateDoc(docRef, {
        name,
        hospital,
        days: selectedDays.split(",").map(day => day.trim()), // Convert string back to array for Firestore
      });

      ToastAndroid.show("Clinic Updated Successfully", ToastAndroid.LONG);
      router.push("/IT22003546/Add_Clinic/MyClinics"); // Navigate back to the clinics list
    } catch (error) {
      console.error("Error updating document: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
      <CustomKeyBoardView>
          <ClinicHeader />
          <View style={{ marginTop: 20, paddingHorizontal: 20 }}>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 15 }}>
                  <TouchableOpacity 
                      onPress={() => router.push("/IT22003546/Add_Clinic/MyClinics")}
                      style={{ 
                          backgroundColor: "#f0f0f0", 
                          borderRadius: 10, 
                          padding: 5 
                      }}
                  >
                      <Entypo name="chevron-left" size={24} color="#737373" />
                  </TouchableOpacity>
                  <Text 
                      style={{ 
                          fontSize: 20, 
                          fontWeight: "bold", 
                          color: "#262626", 
                          marginLeft: 10 
                      }}
                  >
                      Edit Clinic Details
                  </Text>
              </View>
              <View style={{ 
                  height: 2, 
                  backgroundColor: Colors.PRIMARY, 
                  marginBottom: 10 
              }} />
          </View>

          <View style={{ 
              padding: 20, 
              backgroundColor: "#ffffff", 
              borderRadius: 20, 
              elevation: 3, 
              marginHorizontal: 20,
              marginBottom: 20 // Added marginBottom to ensure space below the tile
          }}>
              {loading ? (
                  <ActivityIndicator size="large" color={Colors.PRIMARY} style={{ marginTop: 20 }} />
              ) : (
                  <>
                      {/* Clinic Name Input */}
                      <Text style={{ marginBottom: 5, fontWeight: 'bold', color: Colors.PRIMARY }}>Clinic Name</Text>
                      <TextInput
                          placeholder="Enter Clinic Name"
                          value={name}
                          onChangeText={setName}
                          style={{
                              padding: 10,
                              borderWidth: 1,
                              borderRadius: 10,
                              fontSize: 17,
                              backgroundColor: "#f9f9f9",
                              marginBottom: 15,
                              borderColor: Colors.PRIMARY,
                          }}
                      />

                      {/* Hospital Input */}
                      <Text style={{ marginBottom: 5, fontWeight: 'bold', color: Colors.PRIMARY }}>Hospital</Text>
                      <TextInput
                          placeholder="Enter Hospital Name"
                          value={hospital}
                          onChangeText={setHospital}
                          style={{
                              padding: 10,
                              borderWidth: 1,
                              borderRadius: 10,
                              fontSize: 17,
                              backgroundColor: "#f9f9f9",
                              marginBottom: 15,
                              borderColor: Colors.PRIMARY,
                          }}
                      />

                      {/* Days Input */}
                      <Text style={{ marginBottom: 5, fontWeight: 'bold', color: Colors.PRIMARY }}>Days</Text>
                      <TextInput
                          placeholder="e.g. Monday, Tuesday"
                          value={selectedDays}
                          onChangeText={setSelectedDays}
                          style={{
                              padding: 10,
                              borderWidth: 1,
                              borderRadius: 10,
                              fontSize: 17,
                              backgroundColor: "#f9f9f9",
                              marginBottom: 15,
                              borderColor: Colors.PRIMARY,
                          }}
                      />

                      <TouchableOpacity
                          style={{
                              backgroundColor: Colors.PRIMARY,
                              padding: 15,
                              borderRadius: 10,
                              alignItems: 'center',
                          }}
                          onPress={onUpdateClinic}
                          disabled={loading}
                      >
                          <Text style={{ textAlign: "center", color: "#fff", fontSize: 16 }}>
                              {loading ? "Updating..." : "Update Clinic"}
                          </Text>
                      </TouchableOpacity>
                  </>
              )}
          </View>
      </CustomKeyBoardView>
  );


}
