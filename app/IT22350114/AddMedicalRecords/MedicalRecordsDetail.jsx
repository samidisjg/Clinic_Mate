import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { Colors } from "../../../constants/Colors"; 
import MedicalRecordsDetialsCard from '../../../components/IT22350114_Compnents/MedicalRecordsDetialsCard';
import { db } from '../../../configs/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

export default function MedicalRecordsDetail() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const recordsRef = collection(db, 'medicalRecords');
        const querySnapshot = await getDocs(recordsRef);
        const recordsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log(recordsData); // Log the fetched records
        setRecords(recordsData);
      } catch (error) {
        console.error('Error fetching records:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f5f5f5', padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        All Medical Records
      </Text>
      {loading ? (
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      ) : (
        records.map(record => (
          <MedicalRecordsDetialsCard
            key={record.id}
            title={record.testName || 'Untitled Record'} // Use testName or fallback to 'Untitled Record'
            date={record.reportDate || 'Unknown Date'} // Use reportDate or fallback to 'Unknown Date'
            onPress={() => console.log(`Selected record: ${record.title}`)} // This could be updated to navigate to a detailed view if needed
          />
        ))
      )}
    </ScrollView>
  );
}
