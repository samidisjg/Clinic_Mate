import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity, ToastAndroid, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc, collection, getDocs, query, where, updateDoc, arrayUnion, deleteDoc } from 'firebase/firestore';
import { db } from '../../../configs/firebaseConfig';
import { Colors } from '../../../constants/Colors';
import ClinicHeader from "../../../components/IT22003546_Components/ClinicHeader";
import { useAuth } from '../../../context/AuthContextProvider';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons'; // Import the icons


export default function ClinicDetailsId() {
    const [clinicDetails, setClinicDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [sessions, setSessions] = useState([]);
    const [isEnrolled, setIsEnrolled] = useState(false);
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
                if (data.enrolledUsers && data.enrolledUsers.includes(user.email)) {
                    setIsEnrolled(true);
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
            setIsEnrolled(true);
            router.push("/Clinic");
        } catch (error) {
            console.error("Error enrolling in clinic: ", error);
            ToastAndroid.show("Failed to enroll in clinic. Please try again.", ToastAndroid.LONG);
        }
    };

    const deleteSession = async (sessionId) => {
        Alert.alert('Delete Session', 'Are you sure you want to delete this session?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: async () => {
                try {
                    await deleteDoc(doc(db, 'sessions', sessionId));
                    ToastAndroid.show('Session Deleted Successfully', ToastAndroid.LONG);
                    fetchSessions(); // Refresh the sessions after deletion
                } catch (error) {
                    console.error("Error deleting session: ", error);
                }
            }},
        ]);
    };

    const updateSession = async (sessionId) => {
        router.push(`/IT22003546/updateSession/` + sessionId); // Navigate to update session page with session ID
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
                                    {user.email === 'tommy1914@gmail.com' && (
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
                                                <Text style={{ fontSize: 14, color: '#757575' }}>{`L${session.location}`}</Text> 
                                            </View>
                                            {user.email === 'tommy1914@gmail.com' && (
                                                <TouchableOpacity onPress={() => deleteSession(session.id)} style={{ marginRight: 10 }}>
                                                    <MaterialIcons name="delete" size={24} color="#FF5722" /> 
                                                </TouchableOpacity>
                                            )}
                                            {user.email === 'tommy1914@gmail.com' && (
                                                <TouchableOpacity onPress={() => updateSession(session.id)}>
                                                    <FontAwesome name="edit" size={24} color="#007BFF" />
                                                </TouchableOpacity>
                                            )}
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
