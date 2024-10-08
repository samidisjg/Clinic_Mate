import { View, Text, ScrollView, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContextProvider';
import ClinicHeader from '../../components/IT22003546_Components/ClinicHeader'; 
import { useRouter } from 'expo-router'; 
import { db } from '../../configs/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore'; 
import { Colors } from '../../constants/Colors';

export default function Home() {
  const { user } = useAuth();
  const router = useRouter(); 
  const [enrolledClinics, setEnrolledClinics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrolledClinics = async () => {
      setLoading(true);
      try {
        const clinicsRef = collection(db, "clinics");
        const q = query(clinicsRef, where("enrolledUsers", "array-contains", user.email));
        const snapshot = await getDocs(q);
        const fetchedClinics = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setEnrolledClinics(fetchedClinics);
      } catch (error) {
        console.error("Error fetching enrolled clinics: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledClinics();
  }, [user]);

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <ClinicHeader />

      <View style={{ padding: 10, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Enrolled Clinics</Text>
        <TouchableOpacity onPress={() => router.push('/IT22003546/EnrollClinic/enrollForClinic')}>
          <Text style={{ color: '#007BFF' }}>Enroll for Clinic</Text>
        </TouchableOpacity>
      </View>

      {/* Loading State */}
      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" style={{ marginTop: 20 }} />
      ) : (
        <>
          {/* <Text style={{ fontSize: 24, fontWeight: 'bold', padding: 20 }}>Enrolled Clinics</Text> */}
          <FlatList
            data={enrolledClinics}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={{ padding: 15, backgroundColor: '#e0f7fa', borderRadius: 10, margin: 10 }}
                onPress={() => router.push(`/IT22003546/clinicDetails/` + item.id)} // Navigate to ClinicDetails with ID
              >
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.name}</Text>
                <Text style={{ fontSize: 14, color: '#00796b' }}>{item.hospital}</Text>
                <Text style={{ fontSize: 14, color: '#757575' }}>{`Days: ${item.days.join(', ')}`}</Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={<Text style={{ textAlign: "center", color: Colors.GRAY }}>No enrolled clinics available.</Text>}
          />
        </>
      )}
    </View>
  );
}
