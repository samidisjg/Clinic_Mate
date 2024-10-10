import React from "react";
import { View, Text, ScrollView } from "react-native";
import MedicalRecordCategoryCard from "../../components/IT22350114_Compnents/MedicalRecordCategoryCard";
import { Colors } from "../../constants/Colors";
import prescriptionsImage from "../../assets/images/prescriptionsImage.png";
import labReportsImage from "../../assets/images/labReportsImage.png";
import scansImage from "../../assets/images/scansImage.png";
import { useRouter } from "expo-router"; // Import useRouter from expo-router

export default function AdminRecordCategory() {
  const router = useRouter(); // Use the router

  const handleCategoryPress = () => {
    // Navigate to MedicalRecordsDetail directly without passing params
    router.push("/IT22350114/AddMedicalRecords/MedicalRecordsDetail"); // Adjust the path according to your project structure
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f5f5f5", padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Your Reports
      </Text>
      <MedicalRecordCategoryCard
        title="Prescriptions"
        imageSource={prescriptionsImage}
        onPress={handleCategoryPress} // Call handleCategoryPress on press
      />
      <MedicalRecordCategoryCard
        title="Lab Reports"
        imageSource={labReportsImage}
        onPress={handleCategoryPress} // Call handleCategoryPress on press
      />
      <MedicalRecordCategoryCard
        title="Scans"
        imageSource={scansImage}
        onPress={handleCategoryPress} // Call handleCategoryPress on press
      />
    </ScrollView>
  );
}
