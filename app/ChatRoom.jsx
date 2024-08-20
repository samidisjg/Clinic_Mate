import {
  View,
  Text,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Alert,
  Keyboard,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import ChatRoomHeader from "../components/IT22577160_Components/ChatRoomHeader";
import MessageList from "../components/IT22577160_Components/MessageList";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Feather } from "@expo/vector-icons";
import CustomKeyBoardView from "../components/CustomKeyBoardView";
import { useAuth } from "../context/AuthContextProvider";
import { getRoomId } from "../utils/common";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../configs/firebaseConfig";

export default function ChatRoom() {
  const item = useLocalSearchParams(); // second user
  const { user } = useAuth(); // logged in user
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const textRef = useRef("");
  const inputRef = useRef(null);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    createRoomIfNotExists();
    let roomId = getRoomId(user?.userId, item?.userId);
    const docRef = doc(db, "rooms", roomId);
    const messageRef = collection(docRef, "messages");
    const q = query(messageRef, orderBy("createdAt", "asc"));

    let unSub = onSnapshot(q, (snapshot) => {
      let allMessages = snapshot.docs.map((doc) => {
        return doc.data();
      });
      setMessages(allMessages);
    });
    const KeyboardDisShowListener = Keyboard.addListener(
      "keyboardDidShow",
      updateScrollView
    );
    return () => {
      unSub();
      KeyboardDisShowListener.remove();
    };
  }, []);

  const createRoomIfNotExists = async () => {
    // roomId
    let roomId = getRoomId(user?.userId, item?.userId);
    await setDoc(doc(db, "rooms", roomId), {
      roomId,
      createdAt: Timestamp.fromDate(new Date()),
    });
  };

  const handleSendMessage = async () => {
    let message = textRef.current.trim();
    if (!message) return;
    try {
      let roomId = getRoomId(user?.userId, item?.userId);
      const docRef = doc(db, "rooms", roomId);
      const messageRef = collection(docRef, "messages");
      textRef.current = "";
      if (inputRef) {
        inputRef?.current?.clear();
      }
      const newDoc = await addDoc(messageRef, {
        userId: user?.userId,
        text: message,
        profileUrl: user?.profileUrl,
        senderName: user?.username,
        createdAt: Timestamp.fromDate(new Date()),
      });
    } catch (error) {
      Alert.alert("Message", error.message);
    }
  };

  useEffect(() => {
    updateScrollView();
  }, [messages]);

  const updateScrollView = () => {
    setTimeout(() => {
      scrollViewRef?.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return (
    <CustomKeyBoardView inChat={true}>
      <View
        style={{
          flex: 1,
          backgroundColor: "#f5f5f5",
        }}
      >
        <StatusBar style="dark" />
        <ChatRoomHeader user={item} router={router} />
        <View
          style={{
            height: 8,
            borderBottomWidth: 1,
            borderBottomColor: "#d4d4d4",
          }}
        />
        <View
          style={{
            flex: 1,
            justifyContent: "space-between",
            backgroundColor: "#f5f5f5",
            overflow: "visible",
          }}
        >
          <View style={{ flex: 1 }}>
            <MessageList
              scrollViewRef={scrollViewRef}
              messages={messages}
              currentUser={user}
            />
          </View>
          <View
            style={{
              marginBottom: hp(1.7),
              paddingTop: hp(1.7),
            }}
          >
            <View
              style={{
                flexDirection: "row",
                marginHorizontal: 10,
                justifyContent: "space-between",
                backgroundColor: "#fff",
                padding: 5,
                borderWidth: 1,
                borderColor: "#d4d4d4",
                borderRadius: 50,
                paddingLeft: 10,
              }}
            >
              <TextInput
                ref={inputRef}
                onChangeText={(value) => (textRef.current = value)}
                placeholder="Type message..."
                style={{
                  flex: 1,
                  fontSize: hp(1.8),
                  fontFamily: "outfit-medium",
                  marginRight: 10,
                }}
              />
              <TouchableOpacity
                onPress={handleSendMessage}
                style={{
                  backgroundColor: "#e5e5e5",
                  padding: 8,
                  marginRight: 5,
                  borderRadius: 50,
                }}
              >
                <Feather name="send" size={hp(2.7)} color="#737373" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </CustomKeyBoardView>
  );
}
