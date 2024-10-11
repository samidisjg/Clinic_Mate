import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    ToastAndroid,
    ScrollView
  } from "react-native";
  import React, { useEffect, useState } from "react";
  import { useRouter, useLocalSearchParams } from "expo-router";
  import { doc, getDoc, updateDoc } from "firebase/firestore";
  import { db } from "../../../configs/firebaseConfig";
  import { Colors } from "../../../constants/Colors";
  import CustomKeyBoardView from "../../../components/CustomKeyBoardView";
  import { Entypo } from "@expo/vector-icons";
  import ClinicHeader from "../../../components/IT22003546_Components/ClinicHeader";
  import RNPickerSelect from "react-native-picker-select";
  import DateTimePicker from '@react-native-community/datetimepicker';
  
  export default function EditSession() {
    const router = useRouter();
    const { EditSession } = useLocalSearchParams(); // Fetch the session ID from route params
    const [clinicId, setClinicId] = useState(""); // New field for clinic ID
    const [sessionName, setSessionName] = useState("");
    const [sessionDate, setSessionDate] = useState(""); // New field for session date
    const [doctorName, setDoctorName] = useState(""); // New field for doctor name
    const [startTime, setStartTime] = useState(""); // New field for start time
    const [endTime, setEndTime] = useState(""); // New field for end time
    const [patientCount, setPatientCount] = useState(""); // New field for patient count
    const [location, setLocation] = useState(""); // New field for location
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("");
    const [showDatePicker, setShowDatePicker] = useState(false);
  
    useEffect(() => {
      fetchSessionDetails();
    }, []);
  
    // Fetch the session details by its ID
    const fetchSessionDetails = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "sessions", EditSession);
        const docSnap = await getDoc(docRef);
  
        if (docSnap.exists()) {
          const data = docSnap.data();
          setClinicId(data.clinicID); // Set the clinic ID
          setSessionName(data.name);
          setSessionDate(data.date);
          setDoctorName(data.doctor);
          setLocation(data.location);
          setPatientCount(data.patientCount.toString()); // Convert number to string for TextInput
          setStartTime(data.startTime); // Set the start time
          setEndTime(data.endTime); // Set the end time
          setStatus(data.status);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document: ", error);
      } finally {
        setLoading(false);
      }
    };
  
    // Update the session details
    const onUpdateSession = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "sessions", EditSession);
        await updateDoc(docRef, {
          clinicID: clinicId, // Update clinic ID
          name: sessionName,
          date: sessionDate,
          doctor: doctorName,
          location: location,
          patientCount: parseInt(patientCount, 10), // Ensure to store as number
          startTime: startTime, // Store start time
          endTime: endTime, // Store end time
          status: status,
        });
  
        ToastAndroid.show("Session Updated Successfully", ToastAndroid.LONG);
        router.push(`/IT22003546/clinicDetails/` + clinicId); // Navigate back to the sessions list
      } catch (error) {
        console.error("Error updating document: ", error);
      } finally {
        setLoading(false);
      }
    };

    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || new Date();
        setShowDatePicker(false);
        setSessionDate(currentDate.toISOString().split('T')[0]); // Format date as YYYY-MM-DD
    };
  
    return (
      <CustomKeyBoardView>
        <ClinicHeader />
        <ScrollView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
          
          <View
              style={{
                  marginTop: 20,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingHorizontal: 20,
              }}
          >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <TouchableOpacity onPress={() => router.push(`/IT22003546/clinicDetails/` + clinicId)}>
                      <Entypo name="chevron-left" size={24} color="#737373" />
                  </TouchableOpacity>
                  <Text
                      style={{
                          fontSize: 20,
                          fontWeight: "bold",
                          color: "#262626",
                          marginLeft: 10,
                      }}
                  >
                      Edit Session Details
                  </Text>
              </View>
          </View>
          <View style={{ padding: 20 }}>
              {loading ? (
                  <ActivityIndicator size="large" color={Colors.PRIMARY} />
              ) : (
                  <>
                      <Text style={{ marginBottom: 5, fontWeight: 'bold', color: Colors.PRIMARY }}>Session Name</Text>
                      <TextInput
                          placeholder="Enter session name"
                          value={sessionName}
                          onChangeText={setSessionName}
                          style={{
                              padding: 10,
                              borderWidth: 1,
                              borderRadius: 10,
                              fontSize: 17,
                              backgroundColor: "#fff",
                              marginBottom: 20,
                              borderColor: Colors.PRIMARY,
                          }}
                      />
  
                      <Text style={{ marginBottom: 5, fontWeight: 'bold', color: Colors.PRIMARY }}>Session Date (YYYY-MM-DD)</Text>
                      <View>
                            <TextInput
                                placeholder="Session Date (YYYY-MM-DD)"
                                value={sessionDate}
                                onFocus={() => setShowDatePicker(true)} // Show date picker when focused
                                style={{
                                    padding: 15,
                                    borderWidth: 1,
                                    borderRadius: 10,
                                    fontSize: 17,
                                    backgroundColor: "#f9f9f9",
                                    marginBottom: 15,
                                    borderColor: Colors.PRIMARY,
                                }}
                            />

                            {/* Date Picker */}
                            {showDatePicker && (
                                <DateTimePicker
                                    testID="dateTimePicker"
                                    value={new Date(sessionDate || Date.now())} // Use current date if sessionDate is empty
                                    mode="date"
                                    is24Hour={true}
                                    display="default"
                                    onChange={onChangeDate}
                                />
                            )}
                        </View>
  
                      <Text style={{ marginBottom: 5, fontWeight: 'bold', color: Colors.PRIMARY }}>Doctor Name</Text>
                      <TextInput
                          placeholder="Enter doctor name"
                          value={doctorName}
                          onChangeText={setDoctorName}
                          style={{
                              padding: 10,
                              borderWidth: 1,
                              borderRadius: 10,
                              fontSize: 17,
                              backgroundColor: "#fff",
                              marginBottom: 20,
                              borderColor: Colors.PRIMARY,
                          }}
                      />
  
                      <Text style={{ marginBottom: 5, fontWeight: 'bold', color: Colors.PRIMARY }}>Location</Text>
                      <TextInput
                          placeholder="Enter location"
                          value={location}
                          onChangeText={setLocation}
                          style={{
                              padding: 10,
                              borderWidth: 1,
                              borderRadius: 10,
                              fontSize: 17,
                              backgroundColor: "#fff",
                              marginBottom: 20,
                              borderColor: Colors.PRIMARY,
                          }}
                      />
  
                      <Text style={{ marginBottom: 5, fontWeight: 'bold', color: Colors.PRIMARY }}>Patient Count</Text>
                      <TextInput
                          placeholder="Enter patient count"
                          value={patientCount}
                          keyboardType="numeric"
                          onChangeText={setPatientCount}
                          style={{
                              padding: 10,
                              borderWidth: 1,
                              borderRadius: 10,
                              fontSize: 17,
                              backgroundColor: "#fff",
                              marginBottom: 20,
                              borderColor: Colors.PRIMARY,
                          }}
                      />
  
                      <Text style={{ marginBottom: 5, fontWeight: 'bold', color: Colors.PRIMARY }}>Start Time (HH:MM)</Text>
                      <TextInput
                          placeholder="Enter start time"
                          value={startTime}
                          onChangeText={setStartTime}
                          style={{
                              padding: 10,
                              borderWidth: 1,
                              borderRadius: 10,
                              fontSize: 17,
                              backgroundColor: "#fff",
                              marginBottom: 20,
                              borderColor: Colors.PRIMARY,
                          }}
                      />
  
                      <Text style={{ marginBottom: 5, fontWeight: 'bold', color: Colors.PRIMARY }}>End Time (HH:MM)</Text>
                      <TextInput
                          placeholder="Enter end time"
                          value={endTime}
                          onChangeText={setEndTime}
                          style={{
                              padding: 10,
                              borderWidth: 1,
                              borderRadius: 10,
                              fontSize: 17,
                              backgroundColor: "#fff",
                              marginBottom: 20,
                              borderColor: Colors.PRIMARY,
                          }}
                      />
                      <RNPickerSelect
                            onValueChange={(value) => setStatus(value)}
                            items={[
                                { label: "Upcoming", value: "Upcoming" },
                                { label: "Ongoing", value: "Ongoing" },
                            ]}
                            placeholder={{ label: "Select Status", value: null }}
                            value={status}
                            style={{
                                inputIOS: {
                                    padding: 15,
                                    borderWidth: 1,
                                    borderRadius: 10,
                                    fontSize: 17,
                                    backgroundColor: "#f9f9f9",
                                    borderColor: Colors.PRIMARY,
                                }
                            }}
                        />
  
                      <TouchableOpacity
                          style={{
                              backgroundColor: Colors.PRIMARY,
                              padding: 15,
                              borderRadius: 10,
                          }}
                          onPress={onUpdateSession}
                          disabled={loading}
                      >
                          <Text
                              style={{
                                  textAlign: "center",
                                  color: "#fff",
                                  fontSize: 16,
                              }}
                          >
                              {loading ? "Updating..." : "Update Session"}
                          </Text>
                      </TouchableOpacity>
                  </>
              )}
          </View>
          </ScrollView>
      </CustomKeyBoardView>
  );
  
  }
  