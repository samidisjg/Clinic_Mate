import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, Alert, Modal, Image, TouchableOpacity } from "react-native";
import { Colors } from "../../../constants/Colors";
import MedicalRecordsDetialsCard from "../../../components/IT22350114_Compnents/MedicalRecordsDetialsCard";
import { db } from "../../../configs/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import MedicalRecordsAdminHeader from "../../../components/IT22350114_Compnents/MedicalRecordsAdminHeader";
import { Entypo } from '@expo/vector-icons'; 

export default function MedicalRecordsDetail() {
  const { MedicalRecordsDetail } = useLocalSearchParams();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const router = useRouter();

  console.log(MedicalRecordsDetail);
  console.log(router.query);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const recordsRef = collection(db, "medicalRecords");
        const querySnapshot = await getDocs(recordsRef);
        const recordsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log(recordsData); // Log the fetched records
        // Filter records based on the selected category
        const filteredRecords = recordsData.filter(
          (record) => record.reportType === MedicalRecordsDetail
        ); // Adjust based on your data structure
        console.log(filteredRecords); // Log the fetched records
        setRecords(filteredRecords);
      } catch (error) {
        console.error("Error fetching records:", error);
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

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <MedicalRecordsAdminHeader />
      {/* Back Button and Title */}
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 10 }}>
          <Entypo name="chevron-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
          {MedicalRecordsDetail.replace(/_/g, ' ')} Records
        </Text>
      </View>


      <ScrollView style={{ flex: 1, backgroundColor: "#f5f5f5", padding: 20 }}>
        {/* <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
          {MedicalRecordsDetail.replace(/_/g, ' ')} Records
        </Text> */}
        {loading ? (
          <ActivityIndicator size="large" color={Colors.PRIMARY} />
        ) : records.length > 0 ? (
          records.map((record) => (
            <MedicalRecordsDetialsCard
              key={record.id}
              title={record.testName || "Untitled Record"} // Use testName or fallback to 'Untitled Record'
              date={record.reportDate || "Unknown Date"} // Use reportDate or fallback to 'Unknown Date'
              onPress={() => handleImagePress(record.imageUrl)} // Pass image URL to handleImagePress
            />
          ))
        ) : (
          <Text style={{ fontSize: 16, color: "gray" }}>
            No records found for this category.
          </Text>
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
    </View>
  );
}
