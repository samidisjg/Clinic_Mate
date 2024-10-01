import { View, Text, ActivityIndicator, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../configs/firebaseConfig';
import { Colors } from '../../../constants/Colors';

export default function PhysioExercisesId() {
  const { PhysioExercisesId } = useLocalSearchParams();
  const [physioExercises, setPhysioExercises] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (PhysioExercisesId) {
      GetPhysioExercisesById();
    }
  }, [PhysioExercisesId]);

  const GetPhysioExercisesById = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, "physioExercises", PhysioExercisesId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        setPhysioExercises({ id: docSnap.id, ...docSnap.data() });
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
        <View>
          {physioExercises ? (
            <Text>{JSON.stringify(physioExercises)}</Text>
          ) : (
            <Text>No exercises found</Text>
          )}
        </View>
      )}
    </ScrollView>
  );
}
