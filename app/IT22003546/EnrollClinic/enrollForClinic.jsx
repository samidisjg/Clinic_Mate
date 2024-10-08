import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "../../../constants/Colors";
import RNPickerSelect from "react-native-picker-select";
import { db } from "../../../configs/firebaseConfig"; // Adjust according to your config
import { collection, getDocs } from "firebase/firestore";
import ClinicHeader from "../../../components/IT22003546_Components/ClinicHeader";

export default function EnrollForClinic() {
  const router = useRouter();
  const [hospital, setHospital] = useState("Any Hospital");
  const [clinicType, setClinicType] = useState("Any Clinic");
  const [loading, setLoading] = useState(false);
  const [clinics, setClinics] = useState([]);

  const hospitalOptions = [
    { label: "General Hospital - Colombo", value: "General Hospital - Colombo" },
    // Add more hospitals as needed
  ];

  const clinicTypeOptions = [
    { label: "Heart Clinic", value: "Heart Clinic" },
    { label: "General Clinic", value: "General Clinic" },
    { label: "Specialized Clinic", value: "Specialized Clinic" },
    // Add more clinic types as needed
  ];

  const searchClinics = async () => {
    setLoading(true);
    try {
      // Fetch clinics based on the selected hospital and clinic type
      const clinicsRef = collection(db, "clinics"); // Adjust to your collection name
      const clinicsSnapshot = await getDocs(clinicsRef);
      const filteredClinics = clinicsSnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter(
          (clinic) =>
            (hospital === "Any Hospital" || clinic.hospital === hospital) &&
            (clinicType === "Any Clinic" || clinic.name === clinicType)
        );
      setClinics(filteredClinics);
    } catch (error) {
      console.error("Error fetching clinics: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClinicPress = (clinicId) => {
    router.push(`/IT22003546/clinicDetails/` + clinicId);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <ClinicHeader />

      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", color: Colors.PRIMARY }}>
          Clinics
        </Text>
        <Text style={{ fontSize: 18, marginVertical: 10 }}>Enroll for Clinic</Text>

        <RNPickerSelect
          onValueChange={(value) => setHospital(value)}
          items={hospitalOptions}
          placeholder={{ label: "Any Hospital:", value: null }}
          style={{ inputIOS: { padding: 10, borderWidth: 1, borderRadius: 10, borderColor: Colors.PRIMARY } }}
        />
        <RNPickerSelect
          onValueChange={(value) => setClinicType(value)}
          items={clinicTypeOptions}
          placeholder={{ label: "Any Clinic:", value: null }}
          style={{ inputIOS: { padding: 10, borderWidth: 1, borderRadius: 10, borderColor: Colors.PRIMARY } }}
        />

        <TouchableOpacity
          style={{
            backgroundColor: Colors.PRIMARY,
            padding: 15,
            borderRadius: 10,
            marginTop: 20,
          }}
          onPress={searchClinics}
        >
          <Text style={{ textAlign: "center", color: "#fff", fontSize: 16 }}>Search</Text>
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator size="large" color={Colors.PRIMARY} />
        ) : (
          <FlatList
            data={clinics}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{ padding: 10, margin: 10, backgroundColor: "#f0f0f0", borderRadius: 10 }}
                onPress={() => handleClinicPress(item.id)} // Call the press handler
              >
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>{item.name}</Text>
                <Text style={{ fontSize: 14, color: Colors.GRAY }}>Type: {item.type}</Text>
                <Text style={{ fontSize: 14, color: Colors.GRAY }}>Hospital: {item.hospital}</Text>
                <Text style={{ fontSize: 14, color: Colors.GRAY }}>Days: {item.days}</Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={
              <Text style={{ textAlign: "center", color: Colors.GRAY }}>No clinics available.</Text>
            }
          />
        )}
      </View>
    </View>
  );
}
