import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import MedicalRecordCategoryCard from "../../components/IT22350114_Compnents/MedicalRecordCategoryCard";
import { Colors } from "../../constants/Colors";
import { db } from "../../configs/firebaseConfig";
import { collection, getDocs } from "firebase/firestore"; // Import Firestore methods
import { useRouter } from "expo-router"; // Import useRouter from expo-router

export default function MedicalRecordsCategory() {
  const router = useRouter(); // Use the router
  const [categories, setCategories] = useState([]); // State for categories
  const [loading, setLoading] = useState(true); // State for loading indicator

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const recordsRef = collection(db, 'medicalRecords'); // Reference to the collection
        const querySnapshot = await getDocs(recordsRef);
        
        // Extract unique categories from the records
        const uniqueCategories = new Set();
        querySnapshot.forEach(doc => {
          const data = doc.data();
          if (data.reportType) {
            uniqueCategories.add(data.reportType); // Add each reportType to the set
          }
        });
        
        setCategories(Array.from(uniqueCategories)); // Convert set to array and update state
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false); // Stop loading indicator
      }
    };

    fetchCategories(); // Call the function to fetch categories
  }, []);

  const handleCategoryPress = (category) => {
    // Navigate to MedicalRecordsDetail and pass the selected category
    router.push(`/IT22350114/MedicalrecordsDetails/`+category);
    console.log("Selected Category:", category);
  };

  if (loading) {
    return <ActivityIndicator size="large" color={Colors.PRIMARY} />; // Loading indicator while fetching categories
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f5f5f5", padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Your Reports
      </Text>
      {categories.length > 0 ? (
        categories.map((category, index) => (
          <MedicalRecordCategoryCard
            key={index} // Use index as key for simplicity, but consider using a unique id if available
            title={category}
            imageSource={require("../../assets/images/uploadFilesImg.jpg")} // Placeholder for image
            onPress={() => handleCategoryPress(category)} // Pass category
          />
        ))
      ) : (
        <Text style={{ fontSize: 16, color: 'gray' }}>No categories found.</Text>
      )}
    </ScrollView>
  );
}
