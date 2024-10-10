import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useNavigation } from "expo-router";
import { Colors } from "../../../constants/Colors";
import { Entypo, Ionicons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import * as ImagePicker from "expo-image-picker";
import RNPickerSelect from "react-native-picker-select";
import { collection, doc, getDocs, query, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../../../configs/firebaseConfig";
import { useAuth } from "../../../context/AuthContextProvider";
import CustomKeyBoardView from "../../../components/CustomKeyBoardView";

import DateTimePicker from "@react-native-community/datetimepicker"; // Import Date Picker


export default function AddMedicalRecords() {
  const navigation = useNavigation();
  const [image, setImage] = useState(null);

  const [patientEmail, setPatientEmail] = useState("");
  const [reportType, setReportType] = useState("");
  const [testName, setTestName] = useState("");
  const [otherTestName, setOtherTestName] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [reportDate, setReportDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Add Medical Records",
      headerShown: true,
      headerStyle: {
        backgroundColor: Colors.PRIMARY,
      },
    });
  }, []);

   // Define test names for each report type
   const testNamesOptions = {
    "Lab_Report": ["Blood Test", "Urine Test", "Liver Function Test"],
    "Scan_Report": ["CT Scan", "MRI Scan", "Ultrasound", "X-ray"],
    "Prescription": ["Medication A", "Medication B", "Medication C"],
  };

  // Update testName options based on selected reportType
  const getTestNamesForReportType = () => {
    return testNamesOptions[reportType] || [];
  };

  const onImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    setImage(result?.assets[0]?.uri);
    console.log(result);
  };

  const onAddNewRecords = async () => {
    try {
      const fileName = Date.now().toString() + ".jpg";
      const response = await fetch(image);
      const blob = await response.blob();
      const storageRef = ref(storage, "medicalRecords/" + fileName);
      await uploadBytes(storageRef, blob)
        .then((snapshot) => {
          console.log("File Uploaded...");
        })
        .then((resp) => {
          getDownloadURL(storageRef).then(async (downloadUrl) => {
            console.log(downloadUrl);
            saveMedicalRecords(downloadUrl);
          });
        });
      setLoading(false);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const saveMedicalRecords = async (imageUrl) => {
    try {
      setLoading(true);
      if (!image) {
        throw new Error("Please select an image.");
      }

      await setDoc(doc(db, "medicalRecords", Date.now().toString()), {
        patientEmail: patientEmail,
        reportType: reportType,
        testName: testName === "Other" ? otherTestName : testName,
        doctorName: doctorName,
        reportDate: reportDate.toISOString().split("T")[0], // Format the date as YYYY-MM-DD
        imageUrl: imageUrl,
        username: user?.username,
        userEmail: user?.email,
        userImage: user?.profileUrl,
      });
      setLoading(false);
      router.push("/IT22350114/AddMedicalRecords/MedicalRecordsDetail"); // Correct the navigation path
      ToastAndroid.show(
        "New Medical Record Added Successfully",
        ToastAndroid.LONG
      );
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <CustomKeyBoardView>
      <View
        style={{
          marginTop: hp(4),
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: wp(5),
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
          }}
        >
          <TouchableOpacity onPress={() => router.push("Profile")}>
            <Entypo name="chevron-left" size={hp(4)} color="#737373" />
          </TouchableOpacity>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
            }}
          >
            <Text
              style={{
                fontSize: hp(2),
                fontWeight: "medium",
                color: "#262626",
                fontFamily: "outfit-medium",
              }}
            >
              Add Medical Records
            </Text>
          </View>
        </View>
      </View>
      
      <View
        style={{
          height: 8,
          borderBottomWidth: 1,
          borderBottomColor: "#d4d4d4",
        }}
      />
      <View style={{ padding: 20 }}>
        <Text
          style={{
            fontSize: hp(2.5),
            fontWeight: "medium",
            color: Colors.PRIMARY,
            fontFamily: "outfit-medium",
            textAlign: "center",
          }}
        >
          Add Medical Records
        </Text>
        
        <View
          style={{
            marginTop: 30,
            gap: 10,
            padding: 20,
            backgroundColor: "#ccccff",
            borderRadius: 20,
          }}
        >
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
        </View>

        <TouchableOpacity style={{ marginTop: 20 }} onPress={onImagePick}>
          {!image ? (
            <Image
              source={require("./../../../assets/images/uploadFilesImg.jpg")}
              style={{
                width: 320,
                height: 130,
                borderWidth: 1,
                borderRadius: 15,
                borderColor: Colors.PRIMARY,
              }}
            />
          ) : (
            <Image
              source={{ uri: image }}
              style={{
                width: 220,
                height: 220,
                borderWidth: 1,
                borderRadius: 15,
                borderColor: Colors.PRIMARY
              }}
            />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          disabled={loading}
          style={{
            backgroundColor: Colors.PRIMARY,
            padding: 15,
            borderRadius: 10,
            marginTop: 20,
          }}
          onPress={onAddNewRecords}
        >
          {loading ? (
            <ActivityIndicator size={"large"} color={"#fff"} />
          ) : (
            <Text
              style={{
                textAlign: "center",
                color: "#fff",
                fontFamily: "outfit-medium",
              }}
            >
              Add New Medcial Record
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </CustomKeyBoardView>
  );
}
