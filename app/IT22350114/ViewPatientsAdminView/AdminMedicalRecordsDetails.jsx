import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { Colors } from "../../../constants/Colors"; // Update the path as needed
import AdminMedicalRecordsDetialsCard from '../../../components/IT22350114_Compnents/AdminMedicalRecordsDetialsCard'; // Make sure to import your card component
import { db } from '../../../configs/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

export default function AdminMedicalRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const recordsRef = collection(db, 'medicalRecords');
        const querySnapshot = await getDocs(recordsRef);
        const recordsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
          <AdminMedicalRecordsDetialsCard
            key={record.id}
            title={record.testName} // Adjust based on your data structure
            date={record.reportDate} // Adjust based on your data structure
            onEdit={() => console.log(`Edit record: ${record.id}`)} // Implement edit functionality
            onDelete={() => console.log(`Delete record: ${record.id}`)} // Implement delete functionality
          />
        ))
      )}
    </ScrollView>
  );
}
