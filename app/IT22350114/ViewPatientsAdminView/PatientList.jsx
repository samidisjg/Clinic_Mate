import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { Colors } from "../../../constants/Colors";
import { db } from '../../../configs/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import PatientCard from '../../../components/IT22350114_Compnents/PatientCard';
import MedicalRecordsAdminHeader from '../../../components/IT22350114_Compnents/MedicalRecordsAdminHeader';
import { useRouter } from 'expo-router'; 

export default function PatientList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); 

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const usersRef = collection(db, 'users'); 
        const querySnapshot = await getDocs(usersRef);
        const patientsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPatients(patientsData);
      } catch (error) {
        console.error('Error fetching patients:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f5f5f5', padding: 20 }}>
      <MedicalRecordsAdminHeader />

      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        Patients
      </Text>
      {loading ? (
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      ) : (
        patients.map(patient => (
          <PatientCard
            key={patient.id}
            name={patient.username} 
            onPress={() => {
              console.log(`Navigating to AdminRecordCategory for patient: ${patient.username}`);
              router.push('/IT22350114/ViewPatientsAdminView/AdminRecordCategory'); 
          }}          
          />
        ))
      )}
    </ScrollView>
  );
}
