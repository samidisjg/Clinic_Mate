import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { Colors } from "../../constants/Colors";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../configs/firebaseConfig";
import OngoingSessionCard from "./ongoingSessionCard"; // Import your ongoing session card component

export default function OngoingSessions() {
  const [sessions, setSessions] = useState([]);

  const getOngoingSessions = async () => {
    setSessions([]);
    const q = query(collection(db, "sessions"), where("status", "==", "Ongoing")); // Adjust to fetch ongoing sessions
    const querySnapshot = await getDocs(q);
    const fetchedSessions = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setSessions(fetchedSessions);
  };

  useEffect(() => {
    getOngoingSessions();
  }, []);

  return (
    <View style={{ marginTop: 20 }}>
      <View
        style={{
          padding: 20,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontFamily: "outfit-bold",
          }}
        >
          Ongoing Sessions
        </Text>
        
      </View>
      <FlatList 
        data={sessions}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <OngoingSessionCard session={item} />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}
