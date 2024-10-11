import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { Colors } from "../../../constants/Colors";
import { db } from '../../../configs/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import PatientCard from '../../../components/IT22350114_Compnents/PatientCard';
import MedicalRecordsAdminHeader from '../../../components/IT22350114_Compnents/MedicalRecordsAdminHeader';
import { useRouter } from 'expo-router'; 
import SearchSortBar from '../../../components/IT22350114_Compnents/Styles/SearchSortBar';

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
    <ScrollView style={{ flex: 1, backgroundColor: '#f5f5f5', padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        Patients with Records
      </Text>

      {/* Search and Sort Bar Component */}
      <SearchSortBar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />

      {loading ? (
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      ) : (
        filteredPatients.length > 0 ? (
          filteredPatients.map(patient => (
            <PatientCard
              key={patient.id}
              name={patient.username} 
              onPress={() => {
                console.log(`Navigating to MedicalRecordsDetail for patient: ${patient.username}`);
                router.push(`/IT22350114/AdminRecordsView/${patient.username}`); 
              }}          
            />
          ))
        ) : (
          <Text style={{ fontSize: 16, color: 'gray' }}>No patients found.</Text>
        )
      )}
    </ScrollView>
    </View>
  );
}
