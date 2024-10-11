import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Colors } from "../../../constants/Colors"; 
import MedicalRecordsDetialsCard from '../../../components/IT22350114_Compnents/MedicalRecordsDetialsCard';
import { db } from '../../../configs/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { useRouter } from 'expo-router'; 
import { useLocalSearchParams } from 'expo-router'

export default function MedicalRecordsDetail() {
  const { MedicalRecordsDetail } = useLocalSearchParams()
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  console.log(MedicalRecordsDetail);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const recordsRef = collection(db, 'medicalRecords');
        const querySnapshot = await getDocs(recordsRef);
        const recordsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log(recordsData); // Log the fetched records
        // Filter records based on the selected category
        const filteredRecords = recordsData.filter(record => record.patientUsername === MedicalRecordsDetail); // Adjust based on your data structure
        //console.log(filteredRecords); // Log the fetched records
        setRecords(filteredRecords);
      } catch (error) {
        console.error('Error fetching records:', error);
        Alert.alert("Error", "Failed to fetch records");
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [MedicalRecordsDetail]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f5f5f5', padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        {MedicalRecordsDetail} Records
      </Text>
      {loading ? (
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      ) : (
        records.length > 0 ? (
          records.map(record => (
            <MedicalRecordsDetialsCard
              key={record.id}
              title={record.testName || 'Untitled Record'} // Use testName or fallback to 'Untitled Record'
              date={record.reportDate || 'Unknown Date'} // Use reportDate or fallback to 'Unknown Date'
              onPress={() => console.log(`Selected record: ${record.title}`)} // Handle record press
            />
          ))
        ) : (
          <Text style={{ fontSize: 16, color: 'gray' }}>No records found for this category.</Text>
        )
      )}
    </ScrollView>
  );
}
