import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
  Image,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { db } from "../../../configs/firebaseConfig"; // Update path as needed
import { setDoc, doc } from "firebase/firestore"; // Firestore methods
import { Colors } from "../../../constants/Colors"; // Update the path as needed
import MedicalRecordsAdminHeader from "../../../components/IT22350114_Compnents/MedicalRecordsAdminHeader";
import * as DocumentPicker from "expo-document-picker"; // Import Document Picker for file uploads
import DateTimePicker from "@react-native-community/datetimepicker"; // Import Date Picker
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Import Firebase Storage

export default function AddMedicalRecords() {
  const router = useRouter();
  const [patientEmail, setPatientEmail] = useState("");
  const [reportType, setReportType] = useState("Scan Report");
  const [testName, setTestName] = useState("MRI Scan");
  const [otherTestName, setOtherTestName] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [reportDate, setReportDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Function to handle file picking
  const pickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "*/*",
      copyToCacheDirectory: true,
    });

    if (result.type === "success") {
      setFile(result);
      ToastAndroid.show("File Selected Successfully", ToastAndroid.LONG);
    }
  };

  // Function to handle file upload to Firebase Storage
  const uploadFile = async () => {
    if (file) {
      try {
        const storage = getStorage();
        const fileName = file.name;
        const storageRef = ref(storage, `medicalRecords/${fileName}`);
  
        const response = await fetch(file.uri);
        const bytes = await response.blob();
  
        // Log file upload process
        console.log("Uploading file:", file.uri);
  
        await uploadBytes(storageRef, bytes);
        const downloadUrl = await getDownloadURL(storageRef);
  
        // Log download URL after upload
        console.log("File uploaded successfully, URL:", downloadUrl);
  
        setFileUrl(downloadUrl); // Set the file URL state
        ToastAndroid.show("File Uploaded Successfully", ToastAndroid.LONG);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };
  

  const onAddNewRecord = async () => {
    setLoading(true); // Show loading indicator
    try {
      // Validate inputs
      if (!patientEmail || !reportType || !testName || !doctorName || !reportDate) {
        throw new Error("Please fill all the fields.");
      }

      // Upload file and get URL if a file was selected
      if (file) await uploadFile();

      await setDoc(doc(db, "medicalRecords", Date.now().toString()), {
        patientEmail,
        reportType,
        testName: testName === "Other" ? otherTestName : testName,
        doctorName,
        reportDate: reportDate.toISOString().split("T")[0], // Format the date as YYYY-MM-DD
        fileUrl, // File URL field if the file is uploaded
      });

      ToastAndroid.show("Medical Record Added Successfully", ToastAndroid.LONG);
      router.push("/IT22350114/AddMedicalRecords/MedicalRecords"); // Navigate to the medical records page
    } catch (error) {
      console.error("Error adding document: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      {/* Custom header for the page */}
      <MedicalRecordsAdminHeader />

      <View style={{ padding: 20 }}>
        <Text
          style={{
            fontSize: 22,
            fontWeight: "medium",
            color: Colors.PRIMARY,
            fontFamily: "outfit-medium",
            textAlign: "center",
          }}
        >
          Report Upload
        </Text>

        {/* Container for Form Inputs */}
        <View style={{ marginTop: 20, backgroundColor: "#e0e7ff", borderRadius: 20, padding: 20 }}>
          {/* Patient Email */}
          <Text style={{ fontSize: 16, color: Colors.PRIMARY }}>Patient Email:</Text>
          <TextInput
            value={patientEmail}
            onChangeText={setPatientEmail}
            style={{ padding: 10, borderWidth: 1, borderRadius: 10, fontSize: 17, backgroundColor: "#fff", borderColor: Colors.PRIMARY }}
          />

          {/* Report Type */}
          <Text style={{ fontSize: 16, color: Colors.PRIMARY, marginTop: 15 }}>Report Type:</Text>
          <View style={{ flexDirection: "row", marginVertical: 10 }}>
            {["Lab Report", "Scan Report", "Prescription"].map((type) => (
              <TouchableOpacity
                key={type}
                style={{ flexDirection: "row", alignItems: "center", marginRight: 20 }}
                onPress={() => setReportType(type)}
              >
                <View
                  style={{
                    height: 20,
                    width: 20,
                    borderRadius: 99,
                    borderWidth: 2,
                    borderColor: Colors.PRIMARY,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 8,
                  }}
                >
                  {reportType === type && (
                    <View style={{ height: 10, width: 10, backgroundColor: Colors.PRIMARY, borderRadius: 99 }} />
                  )}
                </View>
                <Text>{type}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Test Name */}
          <Text style={{ fontSize: 16, color: Colors.PRIMARY, marginTop: 15 }}>Test Name:</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", marginVertical: 10 }}>
            {["CT Scan", "MRI Scan", "Ultrasound", "X-ray", "Other"].map((test) => (
              <TouchableOpacity
                key={test}
                style={{ flexDirection: "row", alignItems: "center", marginRight: 20, marginBottom: 10 }}
                onPress={() => setTestName(test)}
              >
                <View
                  style={{
                    height: 20,
                    width: 20,
                    borderRadius: 99,
                    borderWidth: 2,
                    borderColor: Colors.PRIMARY,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 8,
                  }}
                >
                  {testName === test && (
                    <View style={{ height: 10, width: 10, backgroundColor: Colors.PRIMARY, borderRadius: 99 }} />
                  )}
                </View>
                <Text>{test}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Show Other Input if "Other" is Selected */}
          {testName === "Other" && (
            <TextInput
              placeholder="Enter Test Name"
              value={otherTestName}
              onChangeText={setOtherTestName}
              style={{ padding: 10, borderWidth: 1, borderRadius: 10, fontSize: 17, backgroundColor: "#fff", borderColor: Colors.PRIMARY }}
            />
          )}

          {/* Doctor Name */}
          <Text style={{ fontSize: 16, color: Colors.PRIMARY, marginTop: 15 }}>Doctor's Name:</Text>
          <TextInput
            value={doctorName}
            onChangeText={setDoctorName}
            style={{ padding: 10, borderWidth: 1, borderRadius: 10, fontSize: 17, backgroundColor: "#fff", borderColor: Colors.PRIMARY }}
          />

          {/* Report Date */}
          <Text style={{ fontSize: 16, color: Colors.PRIMARY, marginTop: 15 }}>Report Date:</Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={{ padding: 10, borderWidth: 1, borderRadius: 10, backgroundColor: "#fff", borderColor: Colors.PRIMARY }}
          >
            <Text>{reportDate.toDateString()}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={reportDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setReportDate(selectedDate);
              }}
            />
          )}

          {/* File Picker */}
          <Text style={{ fontSize: 16, color: Colors.PRIMARY, marginTop: 15 }}>Upload Medical Record:</Text>
          <TouchableOpacity
            style={{ padding: 15, backgroundColor: Colors.PRIMARY, borderRadius: 10, marginTop: 10 }}
            onPress={pickFile}
          >
            <Text style={{ color: "#fff", textAlign: "center" }}>Upload File</Text>
          </TouchableOpacity>

          {/* Display Selected File */}
          {file && (
            <Text style={{ fontSize: 14, color: Colors.GRAY, marginTop: 10 }}>
              Selected File: {file.name}
            </Text>
          )}

          {/* Submit Button */}
          <TouchableOpacity
            disabled={loading}
            style={{ backgroundColor: Colors.PRIMARY, padding: 15, borderRadius: 10, marginTop: 20 }}
            onPress={onAddNewRecord}
          >
            {loading ? (
              <ActivityIndicator size={"large"} color={"#fff"} />
            ) : (
              <Text style={{ textAlign: "center", color: "#fff", fontFamily: "outfit-medium" }}>Submit</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
