import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Linking, Alert } from 'react-native';
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

  const handleRecordPress = (fileUrl) => {
    console.log("File URL: ", fileUrl);
    if (fileUrl && fileUrl.startsWith('http')) { // Check if the URL starts with 'http'
      Linking.openURL(fileUrl)
        .catch(err => {
          console.error("Error opening file:", err);
          Alert.alert("Error", "Could not open file. Please try again.");
        });
    } else {
      console.log("No valid file URL available");
      Alert.alert("Error", "No valid file URL available for this record.");
    }
  };
  
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
            onPress={() => handleRecordPress(record.fileUrl || record.imageUrl)} // Open file URL
          />
        ))
      )}
    </ScrollView>
  );
}
