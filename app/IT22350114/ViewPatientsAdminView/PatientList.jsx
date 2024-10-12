import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Colors } from "../../../constants/Colors"; 
import { db } from '../../../configs/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import PatientCard from '../../../components/IT22350114_Compnents/PatientCard';
import MedicalRecordsAdminHeader from '../../../components/IT22350114_Compnents/MedicalRecordsAdminHeader';
import { useRouter } from 'expo-router'; 
import { Entypo } from '@expo/vector-icons'; // Importing icon library

export default function PatientList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const router = useRouter(); 

  useEffect(() => {
    const fetchPatientsAndRecords = async () => {
      try {
        const usersRef = collection(db, 'users'); 
        const usersSnapshot = await getDocs(usersRef);
        const patientsData = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const recordsRef = collection(db, 'medicalRecords'); 
        const recordsSnapshot = await getDocs(recordsRef);
        const recordsData = recordsSnapshot.docs.map(doc => doc.data());

        const patientsWithRecords = patientsData.filter(patient => 
          recordsData.some(record => record.patientUsername === patient.username)
        );

        setPatients(patientsWithRecords);
      } catch (error) {
        console.error('Error fetching patients or records:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientsAndRecords();
  }, []);

  const filteredPatients = patients
    .filter(patient => 
      patient.username.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a.username.localeCompare(b.username);
      } else {
        return b.username.localeCompare(a.username);
      }
    });

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <MedicalRecordsAdminHeader />
      
      {/* Back Button */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 10, paddingTop: 10 }}>
        <TouchableOpacity onPress={() => router.push("Profile")}>
          <Entypo name="chevron-left" size={24} color={Colors.PRIMARY} />
        </TouchableOpacity>
        <Text style={{ marginLeft: 5, fontSize: 24, fontWeight: 'bold', color: Colors.PRIMARY }}>Patients with Records</Text>
      </View>

      {/* Search Input */}
      <TextInput
        placeholder="Search Patient Username"
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={{
          borderColor: Colors.PRIMARY,
          borderWidth: 1,
          borderRadius: 10,
          padding: 10,
          marginHorizontal: 20, // Add horizontal margin
          marginTop: 10,
        }}
      />

      {loading ? (
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      ) : (
        <FlatList
          data={filteredPatients}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PatientCard
              key={item.id}
              name={item.username} 
              onPress={() => {
                console.log(`Navigating to MedicalRecordsDetail for patient: ${item.username}`);
                router.push(`/IT22350114/AdminRecordsView/${item.username}`); 
              }}          
            />
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={<Text style={{ fontSize: 16, color: 'gray', textAlign: 'center' }}>No patients found.</Text>}
        />
      )}
    </View>
  );
}
