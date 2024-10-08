import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    ToastAndroid,
  } from "react-native";
  import React, { useEffect, useState } from "react";
  import { useRouter, useLocalSearchParams } from "expo-router";
  import { doc, getDoc, updateDoc } from "firebase/firestore";
  import { db } from "../../../configs/firebaseConfig";
  import { Colors } from "../../../constants/Colors";
  import CustomKeyBoardView from "../../../components/CustomKeyBoardView";
  import { Entypo } from "@expo/vector-icons";
  
  export default function EditSession() {
    const router = useRouter();
    const { sessionId } = useLocalSearchParams(); // Fetch the session ID from route params
    const [sessionName, setSessionName] = useState("");
    const [sessionDate, setSessionDate] = useState(""); // New field for session date
    const [doctorName, setDoctorName] = useState(""); // New field for doctor name
    const [patientCount, setPatientCount] = useState(""); // New field for patient count
    const [loading, setLoading] = useState(false);
  
    console.log("Session ID:", sessionId); // Log the session ID
  
    useEffect(() => {
      fetchSessionDetails();
    }, []);
  
    // Fetch the session details by its ID
    const fetchSessionDetails = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "sessions", sessionId);
        const docSnap = await getDoc(docRef);
  
        if (docSnap.exists()) {
          const data = docSnap.data();
          setSessionName(data.name);
          setSessionDate(data.date);
          setDoctorName(data.doctor);
          setPatientCount(data.patientCount.toString()); // Convert number to string for TextInput
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
        const docRef = doc(db, "sessions", sessionId);
        await updateDoc(docRef, {
          name: sessionName,
          date: sessionDate,
          doctor: doctorName,
          patientCount: parseInt(patientCount, 10), // Ensure to store as number
        });
  
        ToastAndroid.show("Session Updated Successfully", ToastAndroid.LONG);
        router.push("/IT22003546/Sessions/MySessions"); // Navigate back to the sessions list
      } catch (error) {
        console.error("Error updating document: ", error);
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <CustomKeyBoardView>
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
              Edit Session Details
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
              <TextInput
                placeholder="Session Date (YYYY-MM-DD)"
                value={sessionDate}
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
              <TextInput
                placeholder="Patient Count"
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
      </CustomKeyBoardView>
    );
  }
  