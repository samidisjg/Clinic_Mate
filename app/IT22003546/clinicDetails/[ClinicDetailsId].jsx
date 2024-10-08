import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity, ToastAndroid } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc, collection, getDocs, query, where, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../../configs/firebaseConfig';
import { Colors } from '../../../constants/Colors';
import ClinicHeader from "../../../components/IT22003546_Components/ClinicHeader";
import { useAuth } from '../../../context/AuthContextProvider';

export default function ClinicDetailsId() {
    const [clinicDetails, setClinicDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [sessions, setSessions] = useState([]);
    const [isEnrolled, setIsEnrolled] = useState(false); // State to track enrollment status
    const { user } = useAuth();
    const router = useRouter();

    const { ClinicDetailsId } = useLocalSearchParams();
    
    useEffect(() => {
        if (ClinicDetailsId) {
            GetClinicById();
            fetchSessions();
        } else {
            console.log("Clinic ID is undefined");
        }
    }, [ClinicDetailsId]);

    const GetClinicById = async () => {
        setLoading(true);
        try {
            const docRef = doc(db, "clinics", ClinicDetailsId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setClinicDetails({ id: docSnap.id, ...data });
                // Check if the user is already enrolled
                if (data.enrolledUsers && data.enrolledUsers.includes(user.email)) {
                    setIsEnrolled(true); // User is enrolled
                }
            } else {
                console.log("No such document!");
            }
        } catch (error) {
            console.error("Error fetching document: ", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSessions = async () => {
        setLoading(true);
        try {
            const sessionsRef = collection(db, "sessions");
            const q = query(sessionsRef, where("clinicID", "==", ClinicDetailsId));
            const sessionsSnapshot = await getDocs(q);
            const fetchedSessions = sessionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setSessions(fetchedSessions);
        } catch (error) {
            console.error("Error fetching sessions: ", error);
        } finally {
            setLoading(false);
        }
    };

    const enrollInClinic = async () => {
        if (!user) {
            alert("Please log in to enroll in a clinic.");
            return;
        }
        try {
            const clinicRef = doc(db, "clinics", ClinicDetailsId);
            await updateDoc(clinicRef, {
                enrolledUsers: arrayUnion(user.email),
            });
            ToastAndroid.show("Successfully enrolled in the clinic!", ToastAndroid.LONG);
            setIsEnrolled(true); // Set the state to enrolled
            router.push("/Clinic"); // Navigate to another screen
        } catch (error) {
            console.error("Error enrolling in clinic: ", error);
            ToastAndroid.show("Failed to enroll in clinic. Please try again.", ToastAndroid.LONG);
        }
    };

    return (
        <ScrollView style={{ flex: 1, backgroundColor: '#f5f5f5', padding: 0 }}>
            <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
                <ClinicHeader />
                {loading ? (
                    <ActivityIndicator style={{ marginTop: "70%" }} size={"large"} color={Colors.PRIMARY} />
                ) : (
                    <View style={{ flex: 1, backgroundColor: '#f5f5f5', padding: 20 }}>
                        {clinicDetails ? (
                            <>
                                <Text style={{ fontSize: 24, fontWeight: 'bold', color: Colors.PRIMARY }}>
                                    {clinicDetails.hospital}
                                </Text>
                                <Text style={{ fontSize: 20, fontWeight: 'bold', marginVertical: 10 }}>
                                    {clinicDetails.name}
                                </Text>
                                <Text style={{ fontSize: 16, marginBottom: 5 }}>
                                    <Text style={{ fontWeight: 'bold' }}>Clinic Days:</Text> 
                                    {` ${clinicDetails.days.join(', ')}`}
                                </Text>

                                {isEnrolled ? (
                                    <View
                                        style={{
                                            backgroundColor: Colors.RED,
                                            padding: 15,
                                            borderRadius: 10,
                                            marginTop: 20,
                                        }}
                                        onPress={enrollInClinic}
                                    >
                                        <Text style={{ textAlign: 'center', color: '#fff', fontSize: 16 }}>
                                            Enrolled
                                        </Text>
                                    </View>
                                ) : (
                                    <TouchableOpacity
                                        style={{
                                            backgroundColor: Colors.PRIMARY,
                                            padding: 15,
                                            borderRadius: 10,
                                            marginTop: 20,
                                        }}
                                        onPress={enrollInClinic}
                                    >
                                        <Text style={{ textAlign: 'center', color: '#fff', fontSize: 16 }}>
                                            Enroll
                                        </Text>
                                    </TouchableOpacity>
                                )}
                                <View style={{ padding: 10, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={{ fontSize: 18, marginTop: 0, fontWeight: 'bold' }}>
                                        Upcoming Sessions
                                    </Text>
                                    {user.email === 'tommy1914@gmail.com' && ( // Check if the user's email matches
                                        <TouchableOpacity onPress={() => router.push(`/IT22003546/Add_Session/addSession?clinicId=${clinicDetails.id}`)}>
                                            <Text style={{ color: '#007BFF' }}>Add Sessions</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>

                                <View style={{ marginTop: 10 }}>
                                    {sessions.length > 0 ? sessions.map(session => (
                                        <View 
                                            key={session.id} 
                                            style={{ 
                                                padding: 15, 
                                                backgroundColor: '#e0f7fa',
                                                borderRadius: 10, 
                                                marginBottom: 10,
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <View style={{ flexDirection: 'column' }}>
                                                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{session.date}</Text>
                                                <Text style={{ fontSize: 16, color: '#00796b' }}>{`${session.startTime} - ${session.endTime}`}</Text>
                                            </View>
                                            <View style={{ paddingHorizontal: 10 }}>
                                                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{session.doctor}</Text>
                                                <Text style={{ fontSize: 14, color: '#757575' }}>{`L${session.doctor}`}</Text> 
                                            </View>
                                            <TouchableOpacity onPress={() => {/* Add your more options functionality here */}}>
                                                <Text style={{ fontSize: 16, color: '#007BFF' }}>...</Text> 
                                            </TouchableOpacity>
                                        </View>
                                    )) : (
                                        <Text style={{ textAlign: "center", color: Colors.GRAY }}>No upcoming sessions available.</Text>
                                    )}
                                </View>
                            </>
                        ) : (
                            <Text>No clinic details found</Text>
                        )}
                    </View>
                )}
            </View>
        </ScrollView>
    );
}
