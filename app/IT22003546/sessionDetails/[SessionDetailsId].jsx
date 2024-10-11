import { View, Text, ActivityIndicator, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../configs/firebaseConfig';
import { Colors } from '../../../constants/Colors';

export default function SessionDetailsId() {
    const { sessionId } = useLocalSearchParams(); // Get the session ID from route parameters
    const [sessionDetails, setSessionDetails] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        console.log("Session ID:", sessionId); // Log the sessionId to verify
        if (sessionId) {
            GetSessionById(); // Call your function to fetch session details
        } else {
            console.log("Session ID is undefined"); // Debug log if ID is not provided
        }
    }, [sessionId]);

    const GetSessionById = async () => {
        setLoading(true);
        try {
            const docRef = doc(db, "sessions", sessionId); // Reference to the specific session document
            const docSnap = await getDoc(docRef);
            console.log("Document snapshot:", docSnap); // Log the document snapshot
            if (docSnap.exists()) {
                console.log("Document data:", docSnap.data());
                setSessionDetails({ id: docSnap.id, ...docSnap.data() }); // Set the session data to state
            } else {
                console.log("No such document!");
            }
        } catch (error) {
            console.error("Error fetching document: ", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView>
            {loading ? (
                <ActivityIndicator
                    style={{ marginTop: "70%" }}
                    size={"large"}
                    color={Colors.PRIMARY}
                />
            ) : (
                <View style={{ padding: 20 }}>
                    {sessionDetails ? (
                        <>
                            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{sessionDetails.name}</Text>
                            <Text style={{ fontSize: 18, marginTop: 10 }}>Date: {sessionDetails.date}</Text>
                            <Text style={{ fontSize: 18, marginTop: 10 }}>Doctor: {sessionDetails.doctor}</Text>
                            <Text style={{ fontSize: 18, marginTop: 10 }}>Patient Count: {sessionDetails.patientCount}</Text>
                        </>
                    ) : (
                        <Text>No session details found</Text>
                    )}
                </View>
            )}
        </ScrollView>
    );
}
