import React, { useState, useEffect } from "react";
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
  const [hospitalOptions, setHospitalOptions] = useState([]);
  const [clinicTypeOptions, setClinicTypeOptions] = useState([]);

  // Fetch hospitals and clinic types from the database
  useEffect(() => {
    const fetchHospitalAndClinicTypes = async () => {
      try {
        const clinicsRef = collection(db, "clinics");
        const clinicsSnapshot = await getDocs(clinicsRef);
        const hospitalSet = new Set();
        const clinicTypeSet = new Set();

        clinicsSnapshot.docs.forEach((doc) => {
          const data = doc.data();
          if (data.hospital) hospitalSet.add(data.hospital);
          if (data.name) clinicTypeSet.add(data.name); // Assuming `type` is the clinic type field
        });

        setHospitalOptions(Array.from(hospitalSet).map(hospital => ({ label: hospital, value: hospital })));
        setClinicTypeOptions(Array.from(clinicTypeSet).map(name => ({ label: name, value: name })));
      } catch (error) {
        console.error("Error fetching hospitals and clinic types: ", error);
      }
    };

    fetchHospitalAndClinicTypes();
  }, []);

  const searchClinics = async () => {
    setLoading(true);
    try {
      const clinicsRef = collection(db, "clinics");
      const clinicsSnapshot = await getDocs(clinicsRef);
      const allClinics = clinicsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  
      // Determine filtering criteria
      const filteredClinics = allClinics.filter((clinic) => {
        // If both fields are set to default values, return all clinics
        if (hospital === "Any Hospital" && clinicType === "Any Clinic") {
          return true; // Show all clinics
        }
  
        // If hospital is selected, match by hospital
        const hospitalMatch = (hospital === "Any Hospital" || clinic.hospital === hospital);
        // If clinic type is selected, match by clinic type
        const clinicTypeMatch = (clinicType === "Any Clinic" || clinic.name === clinicType);
  
        return hospitalMatch && clinicTypeMatch; // Both criteria must be satisfied
      });
  
      setClinics(filteredClinics); // Update state with filtered clinics
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
          style={{
            inputIOS: {
              padding: 10,
              borderWidth: 1,
              borderRadius: 10,
              borderColor: Colors.PRIMARY,
              marginBottom: 20,
            }
          }}
        />
        <RNPickerSelect
          onValueChange={(value) => setClinicType(value)}
          items={clinicTypeOptions}
          placeholder={{ label: "Any Clinic:", value: null }}
          style={{
            inputIOS: {
              padding: 10,
              borderWidth: 1,
              borderRadius: 10,
              borderColor: Colors.PRIMARY,
            }
          }}
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
                style={{
                  padding: 15,
                  margin: 10,
                  backgroundColor: "#ffffff",
                  borderRadius: 15,
                  elevation: 3,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 5,
                }}
                onPress={() => handleClinicPress(item.id)} 
              >
                <Text style={{ fontSize: 20, fontWeight: "bold", color: Colors.PRIMARY }}>{item.name}</Text>
                <Text style={{ fontSize: 14, color: Colors.GRAY }}>Hospital: {item.hospital}</Text>
                <Text style={{ fontSize: 14, color: Colors.GRAY }}>Days: {item.days.join(', ')}</Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={
              <Text style={{ textAlign: "center", color: Colors.GRAY, marginTop: 30 }}>No clinics available.</Text>
            }
          />
        )}
      </View>
    </View>
  );
}
