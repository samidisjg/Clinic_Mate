import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { db } from "../../../configs/firebaseConfig"; // Update path as needed
import { setDoc, doc } from "firebase/firestore"; // Firestore methods
import { Colors } from "../../../constants/Colors"; // Update the path as needed
import MedicalRecordsAdminHeader from "../../../components/IT22350114_Compnents/MedicalRecordsAdminHeader";
import DateTimePicker from "@react-native-community/datetimepicker"; // Import Date Picker

export default function AddMedicalRecords() {
  const router = useRouter();
  const [patientEmail, setPatientEmail] = useState("");
  const [reportType, setReportType] = useState("Scan Report");
  const [testName, setTestName] = useState("");
  const [otherTestName, setOtherTestName] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [reportDate, setReportDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Define test names for each report type
  const testNamesOptions = {
    "Lab Report": ["Blood Test", "Urine Test", "Liver Function Test"],
    "Scan Report": ["CT Scan", "MRI Scan", "Ultrasound", "X-ray"],
    "Prescription": ["Medication A", "Medication B", "Medication C"],
  };

  // Update testName options based on selected reportType
  const getTestNamesForReportType = () => {
    return testNamesOptions[reportType] || [];
  };

  const onAddNewRecord = async () => {
    try {
      setLoading(true); // Show loading indicator

      // Validate inputs
      if (!patientEmail || !reportType || !testName || !doctorName || !reportDate) {
        throw new Error("Please fill all the fields.");
      }

      // Add the document to Firestore
      await setDoc(doc(db, "medicalRecords", Date.now().toString()), {
        patientEmail,
        reportType,
        testName: testName === "Other" ? otherTestName : testName,
        doctorName,
        reportDate: reportDate.toISOString().split("T")[0], // Format the date as YYYY-MM-DD
      });

      ToastAndroid.show("Medical Record Added Successfully", ToastAndroid.LONG);
      router.push("/IT22350114/AddMedicalRecords/MedicalRecords"); // Correct the navigation path
    } catch (error) {
      console.error("Error adding document:", error);
      ToastAndroid.show("Error adding document: " + error.message, ToastAndroid.LONG);
    } finally {
      setLoading(false); // Stop loading indicator
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
            {Object.keys(testNamesOptions).map((type) => (
              <TouchableOpacity
                key={type}
                style={{ flexDirection: "row", alignItems: "center", marginRight: 20 }}
                onPress={() => {
                  setReportType(type);
                  setTestName(""); // Reset the test name when report type changes
                  setOtherTestName(""); // Clear the other test name input
                }}
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
            {getTestNamesForReportType().map((test) => (
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

            {/* Show Other Option */}
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center", marginRight: 20, marginBottom: 10 }}
              onPress={() => setTestName("Other")}
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
                {testName === "Other" && (
                  <View style={{ height: 10, width: 10, backgroundColor: Colors.PRIMARY, borderRadius: 99 }} />
                )}
              </View>
              <Text>Other</Text>
            </TouchableOpacity>
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
            placeholder="Doctor's Name"
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
