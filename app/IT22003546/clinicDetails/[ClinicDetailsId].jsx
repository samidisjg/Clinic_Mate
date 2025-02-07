import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity, ToastAndroid, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc, collection, getDocs, query, where, updateDoc, arrayUnion, deleteDoc, arrayRemove } from 'firebase/firestore';
import { db } from '../../../configs/firebaseConfig';
import { Colors } from '../../../constants/Colors';
import ClinicHeader from "../../../components/IT22003546_Components/ClinicHeader";
import { useAuth } from '../../../context/AuthContextProvider';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons'; // Import the icons
import { Entypo } from "@expo/vector-icons";


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

    const unenrollFromClinic = async () => {
        if (!user) {
            alert("Please log in to unenroll from a clinic.");
            return;
        }
        try {
            const clinicRef = doc(db, "clinics", ClinicDetailsId); // Reference to the specific clinic document
            await updateDoc(clinicRef, {
                enrolledUsers: arrayRemove(user.email), // Remove the user's email from the enrolledUsers array
            });
            ToastAndroid.show("Successfully unenrolled from the clinic!", ToastAndroid.LONG);
            setIsEnrolled(false); // Update the state to reflect unenrollment
        } catch (error) {
            console.error("Error unenrolling from clinic: ", error);
            ToastAndroid.show("Failed to unenroll from clinic. Please try again.", ToastAndroid.LONG);
        }
    };

    const incrementCount = async (sessionId, currentCount) => {
        setLoading(true);
        try {
            const sessionRef = doc(db, "sessions", sessionId); // Adjust your collection name if necessary
            
            // Increment the patientCount in Firestore
            await updateDoc(sessionRef, {
                currentNum: currentCount + 1, // Increment patient count
            });
    
            // Update local state for immediate feedback in UI
            setSessions(prevSessions =>
                prevSessions.map(session =>
                    session.id === sessionId
                        ? { ...session, currentNum: currentCount + 1 } // Update patientCount locally
                        : session
                )
            );
        } catch (error) {
            console.error("Error updating document: ", error);
        } finally {
            setLoading(false);
        }
    };
    
    

    return (
        <ScrollView style={{ flex: 1, backgroundColor: '#f5f5f5', padding: 0 }}>
            <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
                <ClinicHeader />

                <TouchableOpacity
                    onPress={() => {
                        if (user.email === 'tommy1914@gmail.com') {
                            router.push("/IT22003546/Add_Clinic/MyClinics");
                        } else {
                            router.push("/Clinic");
                        }
                    }}
                    style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 10, paddingTop: 10 }}
                >
                    <Entypo name="chevron-left" size={24} color={Colors.PRIMARY} />
                    {clinicDetails ? (
                        <Text style={{ fontSize: 24, fontWeight: 'bold', color: Colors.PRIMARY, marginLeft: 5 }}>
                            {clinicDetails.hospital}
                        </Text>
                    ) : null}
                </TouchableOpacity>
                {!clinicDetails && (
                    <Text style={{ fontSize: 16, color: 'gray', paddingLeft: 10 }}>
                        Clinic details are currently unavailable.
                    </Text>
                )}



                {loading ? (
                    <ActivityIndicator style={{ marginTop: "70%" }} size={"large"} color={Colors.PRIMARY} />
                ) : (
                    
                    <View style={{ flex: 1, backgroundColor: '#f5f5f5', padding: 20 }}>
                        {clinicDetails ? (
                            <>
                            
                                {/* <Text style={{ fontSize: 24, fontWeight: 'bold', color: Colors.PRIMARY }}>
                                    {clinicDetails.hospital}
                                </Text> */}
                                <Text style={{ fontSize: 20, fontWeight: 'bold', marginVertical: 10 }}>
                                    {clinicDetails.name}
                                </Text>
                                <Text style={{ fontSize: 16, marginBottom: 5 }}>
                                    <Text style={{ fontWeight: 'bold' }}>Clinic Days:</Text> 
                                    {` ${clinicDetails.days.join(', ')}`}
                                </Text>

                                {isEnrolled ? (
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
                                    <View
                                        style={{
                                            backgroundColor: Colors.GREEN,
                                            padding: 15,
                                            borderRadius: 10,
                                            marginRight: 10, 
                                            flex: 1, 
                                        }}
                                    >
                                        <Text style={{ textAlign: 'center', color: '#fff', fontSize: 16 }}>
                                            Already Enrolled
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        style={{
                                            backgroundColor: Colors.RED, 
                                            padding: 15,
                                            borderRadius: 10,
                                            flex: 1, 
                                        }}
                                        onPress={unenrollFromClinic}
                                    >
                                        <Text style={{ textAlign: 'center', color: '#fff', fontSize: 16 }}>
                                            Unenroll
                                        </Text>
                                    </TouchableOpacity>
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
                                        Sessions
                                    </Text>
                                    {user.email === 'tommy1914@gmail.com' && (
                                        <TouchableOpacity onPress={() => router.push(`/IT22003546/Add_Session/addSession?clinicId=${clinicDetails.id}`)}>
                                            <Text style={{ color: '#007BFF' }}>Add Sessions</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>

                                <View style={{ marginTop: 10 }}>
                                {sessions.length > 0 ? 
                                    sessions
                                        .sort((a, b) => new Date(a.date) - new Date(b.date)) // Sort sessions by date in ascending order
                                        .map(session => (
                                            <View 
                                                key={session.id} 
                                                style={{ 
                                                    padding: 15,
                                                    backgroundColor: '#e0f7fa',
                                                    borderRadius: 24, 
                                                    marginBottom: 15,
                                                    elevation: 3, 
                                                    shadowColor: '#000',
                                                    shadowOffset: { width: 0, height: 1 },
                                                    shadowOpacity: 0.2,
                                                    shadowRadius: 2,
                                                    flexDirection: 'row', 
                                                }}
                                            >
                                                {/* Left Side for Date and Month */}
                                                <View style={{ 
                                                    width: 80, 
                                                    height: 80, 
                                                    flexDirection: 'column', 
                                                    alignItems: 'center', 
                                                    justifyContent: 'center',
                                                    marginRight: 15, 
                                                    backgroundColor: '#fff',
                                                    padding: 10,
                                                    borderRadius: 18, 
                                                    elevation: 3, 
                                                    shadowColor: '#000', 
                                                    shadowOffset: { width: 0, height: 1 },
                                                    shadowOpacity: 0.2,
                                                    shadowRadius: 2,
                                                }}>
                                                    <Text style={{ fontSize: 42, fontWeight: 'bold', color: '#0d47a1' }}>
                                                        {new Date(session.date).toLocaleDateString('en-US', { day: 'numeric' })}
                                                    </Text>
                                                    <Text style={{ fontSize: 18, color: '#555', marginBottom:10 }}>
                                                        {new Date(session.date).toLocaleString('en-US', { month: 'short' })}
                                                    </Text>
                                                </View>

                                                {/* Right Side for Session Details */}
                                                <View style={{ 
                                                    flex: 1, 
                                                    flexDirection: 'column', 
                                                    justifyContent: 'center',
                                                    alignItems: 'flex-start', 
                                                }}>
                                                    <View>
                                                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#00796b' }}>{session.doctor}</Text>
                                                        {session.status === "Ongoing" ? (
                                                            <Text style={{ fontSize: 16, color: '#757575', fontWeight: 'bold' }}>{`Ongoing No: ${session.currentNum}`}</Text>
                                                        ) : (
                                                            <Text style={{ fontSize: 16, color: '#555' }}>{`${session.startTime} - ${session.endTime}`}</Text>
                                                        )}
                                                        <Text style={{ fontSize: 14, color: '#757575', fontWeight: 'bold' }}>{`L${session.location}`}</Text>
                                                    </View>
                                                </View>

                                                {/* Status Tag */}
                                                {session.status === "Ongoing" && user.email !== 'tommy1914@gmail.com' && (
                                                    <View style={{ 
                                                        position: 'absolute', 
                                                        top: 10, 
                                                        right: 10, 
                                                        backgroundColor: '#4CAF50',
                                                        paddingVertical: 5,
                                                        paddingHorizontal: 10,
                                                        borderRadius: 12,
                                                    }}>
                                                        <Text style={{ fontSize: 10, color: '#fff', fontWeight: 'bold' }}>Ongoing</Text>
                                                    </View>
                                                )}

                                                {/* Edit and Delete Icons */}
                                                <View style={{ flexDirection: 'column', marginTop: 10, alignItems: 'center' }}>
                                                    {session.status === "Ongoing" && user.email === 'tommy1914@gmail.com' && (
                                                        <TouchableOpacity 
                                                            onPress={() => incrementCount(session.id, session.currentNum)}
                                                            style={{ 
                                                                marginLeft: 10, 
                                                                marginBottom: 10,
                                                                backgroundColor: '#00796b', 
                                                                paddingVertical: 5,
                                                                paddingHorizontal: 10,
                                                                borderRadius: 10,
                                                                width: 50,
                                                                height: 30,
                                                                justifyContent: 'center', 
                                                                alignItems: 'center' 
                                                            }}
                                                        >
                                                            {loading ? (
                                                                <ActivityIndicator color="#fff" />
                                                            ) : (
                                                                <Text style={{ color: '#fff', fontWeight: 'bold' }}>+</Text>
                                                            )}
                                                        </TouchableOpacity>
                                                    )}
                                                    {user.email === 'tommy1914@gmail.com' && (
                                                        <TouchableOpacity onPress={() => deleteSession(session.id)} style={{ marginBottom: 10 }}>
                                                            <MaterialIcons name="delete" size={24} color="#FF5722" /> 
                                                        </TouchableOpacity>
                                                    )}
                                                    {user.email === 'tommy1914@gmail.com' && (
                                                        <TouchableOpacity onPress={() => updateSession(session.id)}>
                                                            <FontAwesome name="edit" size={24} color="#007BFF" />
                                                        </TouchableOpacity>
                                                    )}
                                                </View>
                                            </View>
                                        )) 
                                        : (
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