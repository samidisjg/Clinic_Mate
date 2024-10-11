import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Alert, TouchableOpacity, Modal, Image } from 'react-native';
import { Colors } from "../../../constants/Colors"; 
import MedicalRecordsDetialsCard from '../../../components/IT22350114_Compnents/AdminMedicalRecordsDetialsCard';
import { db } from '../../../configs/firebaseConfig';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useRouter } from 'expo-router'; 
import { useLocalSearchParams } from 'expo-router';
import MedicalRecordsAdminHeader from '../../../components/IT22350114_Compnents/MedicalRecordsAdminHeader';
import { Entypo } from '@expo/vector-icons'; // Importing icon library
import Toast from 'react-native-toast-message'; // For toast messages

export default function MedicalRecordsDetail() {
  const { MedicalRecordsDetail } = useLocalSearchParams();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const recordsRef = collection(db, 'medicalRecords');
        const querySnapshot = await getDocs(recordsRef);
        const recordsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Filter records based on the selected category
        const filteredRecords = recordsData.filter(record => record.patientUsername === MedicalRecordsDetail);
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

  const handleImagePress = (imageUrl) => {
    setSelectedImage(imageUrl);
    setModalVisible(true);
  };

  const handleDeleteRecord = async (recordId) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this record?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "medicalRecords", recordId)); // Delete record from Firestore
              setRecords(records.filter(record => record.id !== recordId)); // Remove from state
              Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Record deleted successfully.',
              });
            } catch (error) {
              console.error("Error deleting record:", error);
              Alert.alert("Error", "Failed to delete record.");
            }
          }
        }
      ]
    );
  };

  return (
     <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <MedicalRecordsAdminHeader />
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
                title={record.testName || 'Untitled Record'} 
                date={record.reportDate || 'Unknown Date'} 
                onPress={() => handleImagePress(record.imageUrl)} 
                onDelete={() => handleDeleteRecord(record.id)} // Add delete handler
              />
            ))
          ) : (
            <Text style={{ fontSize: 16, color: 'gray' }}>No records found for this category.</Text>
          )
        )}
      </ScrollView>
      
      {/* Modal for displaying the image */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.7)" }}>
          <TouchableOpacity onPress={() => setModalVisible(false)} style={{ position: "absolute", top: 40, right: 20 }}>
            <Text style={{ color: "#fff", fontSize: 18 }}>Close</Text>
          </TouchableOpacity>
          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              style={{ width: "90%", height: "80%", resizeMode: "contain" }}
            />
          )}
        </View>
      </Modal>
      
      {/* Toast component for displaying messages */}
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </View>
  );
}
