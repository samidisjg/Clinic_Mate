import { View, Text, TouchableOpacity, Alert, ToastAndroid } from "react-native";
import React from "react";
import { Colors } from "../../constants/Colors";
import { useRouter } from "expo-router";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useAuth } from "../../context/AuthContextProvider";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../configs/firebaseConfig";

export default function ClinicCard({ item }) {
  const router = useRouter();
  const { user } = useAuth();

  const onDelete = () => {
    Alert.alert('Delete Clinic', 'Are you sure you want to delete this clinic?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: deleteClinic }
    ]);
  };

  const deleteClinic = async () => {
    await deleteDoc(doc(db, 'clinics', item?.id));
    router.push('/IT22003546/Add_Clinic/MyClinics');
    ToastAndroid.show('Clinic Deleted Successfully', ToastAndroid.LONG);
  };

  return (
    <TouchableOpacity
      style={{
        padding: 15,
        marginVertical: 10,
        backgroundColor: '#e0f7fa', // Light blue background
        borderRadius: 10,
        elevation: 2, // Adds shadow effect on Android
        flexDirection: 'column',
      }}
      onPress={() => router.push(`/IT22003546/clinicDetails/` + item.id)} // Navigate to clinic details
    >
      <Text style={{ fontSize: 18, fontWeight: 'bold', color: Colors.PRIMARY }}>
        {item?.name}
      </Text>
      <Text style={{ fontSize: 14, color: Colors.GRAY, marginTop: 5 }}>
        {item?.hospital} {/* Display hospital name instead of type */}
      </Text>
      <Text style={{ fontSize: 14, color: Colors.GRAY }}>
        Days: {item?.days.join(', ')} {/* Display clinic days */}
      </Text>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
      }}>
        <View style={{ flexDirection: 'row' }}>
          {user?.email === 'tommy1914@gmail.com' && (
            <TouchableOpacity onPress={() => router.push(`/IT22003546/updateClinic/` + item.id)}>
              <MaterialIcons name="edit" size={24} color={Colors.PRIMARY} />
            </TouchableOpacity>
          )}
          {user?.email === 'tommy1914@gmail.com' && (
            <TouchableOpacity onPress={onDelete}>
              <MaterialIcons name="delete" size={24} color={Colors.PRIMARY} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
