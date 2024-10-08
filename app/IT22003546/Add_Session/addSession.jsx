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
  
  export default function Add_Session() {
    const router = useRouter();
    const navigation = useNavigation();
    const [sessionName, setSessionName] = useState("");
    const [sessionDate, setSessionDate] = useState(""); // New field for session date
    const [doctorName, setDoctorName] = useState(""); // New field for doctor name
    const [patientCount, setPatientCount] = useState(""); // New field for patient count
    const [startTime, setStartTime] = useState(""); // New field for start time
    const [endTime, setEndTime] = useState(""); // New field for end time
    const [loading, setLoading] = useState(false);
    const { clinicId } = useLocalSearchParams();

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
        if (!sessionName || !sessionDate || !doctorName || !patientCount) {
          throw new Error("Please fill all the fields.");
        }
  
        // Create a new document for the session
        await setDoc(doc(db, "sessions", Date.now().toString()), {
          clinicID: clinicId,
          name: sessionName,
          date: sessionDate,
          doctor: doctorName,
          patientCount: parseInt(patientCount, 10), // Convert patient count to a number
          startTime: startTime, // Store start time
          endTime: endTime, // Store end time
        });
  
        ToastAndroid.show("New Session Added Successfully", ToastAndroid.LONG);
        router.push("IT22003546/Add_Session/MySession"); // Change the route to your sessions page
      } catch (error) {
        console.error("Error adding document: ", error);
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <CustomKeyBoardView>
        <ClinicHeader />
        <View
          style={{
            marginTop: 20,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 20,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <TouchableOpacity onPress={() => router.push("Profile")}>
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
        <View style={{ padding: 20 }}>
          {loading ? (
            <ActivityIndicator size="large" color={Colors.PRIMARY} />
          ) : (
            <>
              <TextInput
                placeholder="Session Name"
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
              <TextInput
                placeholder="Session Date (YYYY-MM-DD)"
                onChangeText={setSessionDate}
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
              <TextInput
                placeholder="Doctor Name"
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
              <TextInput
                placeholder="Patient Count"
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
              <TextInput
                placeholder="Start Time"
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
              <TextInput
                placeholder="End Time"
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
              <TouchableOpacity
                style={{
                  backgroundColor: Colors.PRIMARY,
                  padding: 15,
                  borderRadius: 10,
                }}
                onPress={onAddNewSession}
                disabled={loading}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: "#fff",
                    fontSize: 16,
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
  