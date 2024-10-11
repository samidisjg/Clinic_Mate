import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ToastAndroid,
    ActivityIndicator,
  } from "react-native";
  import React, { useEffect, useState } from "react";
  import { useRouter } from "expo-router";
  import { router, useNavigation } from "expo-router";
  import { Colors } from "../../../constants/Colors";
  import { Entypo } from "@expo/vector-icons";
  import { collection, doc, setDoc } from "firebase/firestore";
  import { db } from "../../../configs/firebaseConfig";
  import CustomKeyBoardView from "../../../components/CustomKeyBoardView";
  import ClinicHeader from "../../../components/IT22003546_Components/ClinicHeader";
  import { useLocalSearchParams } from 'expo-router';
  import RNPickerSelect from "react-native-picker-select";
  import DateTimePicker from '@react-native-community/datetimepicker';
  
  export default function Add_Session() {
    const router = useRouter();
    const navigation = useNavigation();
    const [sessionName, setSessionName] = useState("");
    const [sessionDate, setSessionDate] = useState(""); // New field for session date
    const [doctorName, setDoctorName] = useState(""); // New field for doctor name
    const [patientCount, setPatientCount] = useState(""); // New field for patient count
    const [startTime, setStartTime] = useState(""); // New field for start time
    const [endTime, setEndTime] = useState(""); // New field for end time
    const [location, setLocation] = useState(""); // New field for location
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);
    const { clinicId } = useLocalSearchParams();
    const [showDatePicker, setShowDatePicker] = useState(false);

    useEffect(() => {
      navigation.setOptions({
        headerTitle: "Add Session",
        headerShown: true,
        headerStyle: {
          backgroundColor: Colors.PRIMARY,
        },
      });
    }, []);
  
    const onAddNewSession = async () => {
      try {
        // Validate inputs
        if (!sessionName || !sessionDate || !doctorName || !patientCount || !startTime || !endTime || !location || !status) {
          throw new Error("Please fill all the fields.");
        }
  
        // Create a new document for the session
        await setDoc(doc(db, "sessions", Date.now().toString()), {
          clinicID: clinicId,
          name: sessionName,
          date: sessionDate,
          doctor: doctorName,
          location: location,
          patientCount: parseInt(patientCount, 10), // Convert patient count to a number
          startTime: startTime, // Store start time
          endTime: endTime, // Store end time
          status: status,
          currentNum: 0,
        });
  
        ToastAndroid.show("New Session Added Successfully", ToastAndroid.LONG);
        router.push(`/IT22003546/clinicDetails/` + clinicId); // Change the route to your sessions page
      } catch (error) {
        console.error("Error adding document: ", error);
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
          <View
              style={{
                  marginTop: 20,
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
                      Add Session
                  </Text>
              </View>
          </View>
  
          <View style={{
              padding: 20,
              backgroundColor: "#ffffff",
              borderRadius: 20,
              elevation: 3,
              marginHorizontal: 20,
              marginTop: 10,
          }}>
              {loading ? (
                  <ActivityIndicator size="large" color={Colors.PRIMARY} />
              ) : (
                  <>
                      <TextInput
                          placeholder="Session Name"
                          placeholderTextColor="#A9A9A9"
                          onChangeText={setSessionName}
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
                      <View>
                            <TextInput
                                placeholder="Session Date (YYYY-MM-DD)"
                                placeholderTextColor="#A9A9A9"
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
                      <TextInput
                          placeholder="Doctor Name"
                          placeholderTextColor="#A9A9A9"
                          onChangeText={setDoctorName}
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
                      <TextInput
                          placeholder="Location"
                          placeholderTextColor="#A9A9A9"
                          onChangeText={setLocation}
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
                      <TextInput
                          placeholder="Patient Count"
                          placeholderTextColor="#A9A9A9"
                          keyboardType="numeric"
                          onChangeText={setPatientCount}
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
                      <TextInput
                          placeholder="Start Time (HH:MM)"
                          placeholderTextColor="#A9A9A9"
                          onChangeText={setStartTime}
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
                      <TextInput
                          placeholder="End Time (HH:MM)"
                          placeholderTextColor="#A9A9A9"
                          onChangeText={setEndTime}
                          style={{
                              padding: 15,
                              borderWidth: 1,
                              borderRadius: 10,
                              fontSize: 17,
                              backgroundColor: "#f9f9f9",
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
                           
                            style={{
                                inputIOS: {
                                    padding: 15,
                                    borderWidth: 1,
                                    borderRadius: 10,
                                    marginBottom: 20,   
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
                              alignItems: 'center',
                          }}
                          onPress={onAddNewSession}
                          disabled={loading}
                      >
                          <Text
                              style={{
                                  textAlign: "center",
                                  color: "#fff",
                                  fontSize: 16,
                                  fontWeight: 'bold',
                              }}
                          >
                              {loading ? "Adding..." : "Add Session"}
                          </Text>
                      </TouchableOpacity>
                  </>
              )}
          </View>
      </CustomKeyBoardView>
  );
  
  
  
  }
  