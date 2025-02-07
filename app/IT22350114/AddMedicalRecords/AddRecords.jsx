import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ToastAndroid,
  ActivityIndicator,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useNavigation } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import RNPickerSelect from "react-native-picker-select"; 
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../../../configs/firebaseConfig";
import { useAuth } from "../../../context/AuthContextProvider";
import CustomKeyBoardView from "../../../components/CustomKeyBoardView";
import DateTimePicker from "@react-native-community/datetimepicker"; 
import formStyles from "../../../components/IT22350114_Compnents/Styles/formStyles";
import { Entypo } from "@expo/vector-icons";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen"; 
import { Colors } from "../../../constants/Colors";
import MedicalRecordsAdminHeader from "../../../components/IT22350114_Compnents/MedicalRecordsAdminHeader";

export default function AddMedicalRecords() {
  const navigation = useNavigation();
  const [image, setImage] = useState(null);
  const [patientUsername, setPatientUsername] = useState("");
  const [usernames, setUsernames] = useState([]);
  const [filteredUsernames, setFilteredUsernames] = useState([]);
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

  // Fetch usernames from Firestore
  useEffect(() => {
    const fetchUsernames = async () => {
      try {
        const usersRef = collection(db, 'users');
        const querySnapshot = await getDocs(usersRef);
        const usernamesData = querySnapshot.docs.map(doc => doc.data().username);
        setUsernames(usernamesData);
        setFilteredUsernames(usernamesData);
      } catch (error) {
        console.error('Error fetching usernames:', error);
      }
    };

    fetchUsernames();
  }, []);

  // Filter usernames based on search input
  const handleSearch = (query) => {
    setPatientUsername(query);
    if (query) {
      const filtered = usernames.filter(username =>
        username.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredUsernames(filtered);
    } else {
      setFilteredUsernames(usernames);
    }
  };

  // Define test names for each report type
  const testNamesOptions = {
    "Lab_Report": ["Blood Test", "Urine Test", "Liver Function Test"],
    "Scan_Report": ["CT Scan", "MRI Scan", "Ultrasound", "X-ray"],
    "Prescription": ["Medication A", "Medication B", "Medication C"],
  };

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
  };

  const onAddNewRecords = async () => {
    try {
      const fileName = Date.now().toString() + ".jpg";
      const response = await fetch(image);
      const blob = await response.blob();
      const storageRef = ref(storage, "medicalRecords/" + fileName);
      await uploadBytes(storageRef, blob);
      const downloadUrl = await getDownloadURL(storageRef);
      saveMedicalRecords(downloadUrl);
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
        patientUsername,
        reportType,
        testName: testName === "Other" ? otherTestName : testName,
        doctorName,
        reportDate: reportDate.toISOString().split("T")[0],
        imageUrl,
        username: user?.username,
        userEmail: user?.email,
        userImage: user?.profileUrl,
      });
      setLoading(false);
      router.push("../../(tabs)/Profile");
      ToastAndroid.show(
        "New Medical Record Added Successfully",
        ToastAndroid.LONG
      );
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <MedicalRecordsAdminHeader />
      <View style={formStyles.header}>
        <TouchableOpacity onPress={() => router.push("Profile")}>
          <Entypo name="chevron-left" size={hp(4)} color="#737373" />
        </TouchableOpacity>
        <Text style={formStyles.title}>Add Medical Records</Text>
      </View>
      <CustomKeyBoardView>
        <View style={formStyles.separator} />
        <View style={formStyles.container}>
          <View style={formStyles.inputContainer}>
            <Text style={formStyles.label}>Select Patient Username:</Text>
            <TextInput
              value={patientUsername}
              onChangeText={handleSearch} // Update search input
              placeholder="Search Username"
              style={[formStyles.input, { borderColor: Colors.PRIMARY, borderWidth: 1, borderRadius: 10 }]} // Add border and rounded edges
            />

            {/* Display filtered usernames */}
            {filteredUsernames.length > 0 && (
              <FlatList
                data={filteredUsernames}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => {
                    setPatientUsername(item); // Set selected username
                    setFilteredUsernames([]); // Clear the list after selection
                  }}>
                    <Text style={{ padding: 10, fontSize: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: Colors.PRIMARY }}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            )}

            <Text style={formStyles.label}>Report Type:</Text>
            <View style={formStyles.radioGroup}>
              {Object.keys(testNamesOptions).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={formStyles.radioButton}
                  onPress={() => {
                    setReportType(type);
                    setTestName(""); // Reset test name
                    setOtherTestName(""); // Clear the other test name input
                  }}
                >
                  <View style={formStyles.radioButtonCircle}>
                    {reportType === type && <View style={formStyles.radioButtonSelected} />}
                  </View>
                  <Text>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={formStyles.label}>Test Name:</Text>
            <View style={formStyles.radioGroup}>
              {getTestNamesForReportType().map((test) => (
                <TouchableOpacity
                  key={test}
                  style={formStyles.radioButton}
                  onPress={() => setTestName(test)}
                >
                  <View style={formStyles.radioButtonCircle}>
                    {testName === test && <View style={formStyles.radioButtonSelected} />}
                  </View>
                  <Text>{test}</Text>
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                style={formStyles.radioButton}
                onPress={() => setTestName("Other")}
              >
                <View style={formStyles.radioButtonCircle}>
                  {testName === "Other" && <View style={formStyles.radioButtonSelected} />}
                </View>
                <Text>Other</Text>
              </TouchableOpacity>
            </View>

            {testName === "Other" && (
              <TextInput
                placeholder="Enter Test Name"
                value={otherTestName}
                onChangeText={setOtherTestName}
                style={formStyles.input}
              />
            )}

            <Text style={formStyles.label}>Doctor's Name:</Text>
            <TextInput
              placeholder="Doctor's Name"
              value={doctorName}
              onChangeText={setDoctorName}
              style={formStyles.input}
            />

            <Text style={formStyles.label}>Report Date:</Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={formStyles.input}
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
                style={formStyles.uploadImage}
              />
            ) : (
              <Image
                source={{ uri: image }}
                style={formStyles.imagePreview}
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            disabled={loading}
            style={formStyles.button}
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
                Add New Medical Record
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </CustomKeyBoardView>
    </View>
  );
}
