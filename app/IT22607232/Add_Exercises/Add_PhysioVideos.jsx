import {
    View,
    Text,
    TouchableOpacity,
    Image,
    TextInput,
    ToastAndroid,
    ActivityIndicator,
  } from "react-native";
  import React, { useEffect, useState } from "react";
  import { router, useNavigation } from "expo-router";
  import { Colors } from "../../../constants/Colors";
  import { Entypo } from "@expo/vector-icons";
  import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from "react-native-responsive-screen";
  import * as ImagePicker from "expo-image-picker";
  import RNPickerSelect from "react-native-picker-select";
  import { doc, setDoc } from "firebase/firestore";
  import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
  import { db, storage } from "../../../configs/firebaseConfig";
  import { useAuth } from "../../../context/AuthContextProvider";
  import CustomKeyBoardView from "../../../components/CustomKeyBoardView";
  import { Video } from "expo-av"; // Importing video from expo-av
  
  export default function Add_PhysioVideos() {
    const navigation = useNavigation();
    const [video, setVideo] = useState(null);
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
  
    useEffect(() => {
      navigation.setOptions({
        headerTitle: "Add Trending Physio Videos",
        headerShown: true,
        headerStyle: {
          backgroundColor: Colors.PRIMARY,
        },
      });
    }, []);
  
    const onVideoPick = async () => {
      try {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Videos,
          allowsEditing: true,
          quality: 1,
        });
        if (!result.canceled) {
          setVideo(result.assets[0]?.uri);
        }
      } catch (error) {
        console.error("Error picking video:", error);
      }
    };
  
    const onAddNewTips = async () => {
      try {
        const fileName = Date.now().toString() + ".mp4";
        const response = await fetch(video);
        const blob = await response.blob();
        const storageRef = ref(storage, "/PhysiotherapySection/" + fileName);
        await uploadBytes(storageRef, blob);
        const downloadUrl = await getDownloadURL(storageRef);
        savePhysioExercise(downloadUrl);
      } catch (error) {
        console.error("Error uploading video:", error);
      } finally {
        setLoading(false);
      }
    };
  
    const savePhysioExercise = async (videoUrl) => {
      try {
        if (!video) throw new Error("Please select a video.");
  
        setLoading(true);
        await setDoc(doc(db, "physioExercises", Date.now().toString()), {
          title,
          category,
          content,
          videoUrl,
          username: user?.username,
          userEmail: user?.email,
          userImage: user?.profileUrl,
        });
  
        ToastAndroid.show(
          "New Exercise Video Added Successfully",
          ToastAndroid.LONG
        );
        router.push("IT22607232/Add_Exercises/View_PhysioLog");
      } catch (error) {
        console.error("Error adding Video:", error);
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <CustomKeyBoardView>
        <View
          style={{
            marginTop: hp(4),
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: wp(5),
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
            }}
          >
            <TouchableOpacity onPress={() => router.push("Profile")}>
              <Entypo name="chevron-left" size={hp(4)} color="#737373" />
            </TouchableOpacity>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
              }}
            >
              <Text
                style={{
                  fontSize: hp(2),
                  fontWeight: "medium",
                  color: "#262626",
                  fontFamily: "outfit-medium",
                }}
              >
                Add Trending Physio Videos
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            height: 8,
            borderBottomWidth: 1,
            borderBottomColor: "#d4d4d4",
          }}
        />
        <View style={{ padding: 20 }}>
          <Text
            style={{
              fontSize: hp(2.5),
              fontWeight: "medium",
              color: Colors.PRIMARY,
              fontFamily: "outfit-medium",
              textAlign: "center",
            }}
          >
            Add Physio Video
          </Text>
          <TouchableOpacity style={{ marginTop: 20 }} onPress={onVideoPick}>
            {!video ? (
              <Image
                source={require("../../../assets/images/video.png")}
                style={{
                  width: 220,
                  height: 220,
                  borderWidth: 1,
                  borderRadius: 15,
                  borderColor: Colors.PRIMARY,
                }}
              />
            ) : (
              <Video
                source={{ uri: video }}
                rate={1.0}
                volume={1.0}
                isMuted={false}
                resizeMode="cover"
                shouldPlay
                isLooping
                style={{
                  width: 220,
                  height: 220,
                  borderWidth: 1,
                  borderRadius: 15,
                  borderColor: Colors.PRIMARY,
                }}
              />
            )}
          </TouchableOpacity>
          <View
            style={{
              marginTop: 30,
              gap: 10,
              padding: 20,
              backgroundColor: "#ccccff",
              borderRadius: 20,
            }}
          >
            <TextInput
              placeholder="Physio Exercise Title"
              onChangeText={(v) => setTitle(v)}
              style={{
                padding: 10,
                borderWidth: 1,
                borderRadius: 10,
                fontSize: 17,
                backgroundColor: "#fff",
                marginTop: 10,
                borderColor: Colors.PRIMARY,
                fontFamily: "outfit",
              }}
            />
            <View
              style={{
                borderWidth: 1,
                borderRadius: 10,
                backgroundColor: "#fff",
                marginTop: 20,
                borderColor: Colors.PRIMARY,
              }}
            >
              <RNPickerSelect
                onValueChange={(value) => setCategory(value)}
                items={[
                  { label: "Core Stability", value: "Core Stability" },
                  { label: "Coordination", value: "Coordination" },
                  { label: "Mobility Therapy", value: "Mobility Therapy" },
                ]}
                placeholder={{
                  label: "Category",
                  value: null,
                }}
                style={{
                  inputIOS: {
                    padding: 10,
                    fontSize: 17,
                    fontFamily: "outfit",
                  },
                  inputAndroid: {
                    padding: 10,
                    fontSize: 17,
                    fontFamily: "outfit",
                  },
                }}
              />
            </View>
            <TextInput
              placeholder="Exercise Content"
              onChangeText={(v) => setContent(v)}
              multiline
              numberOfLines={5}
              style={{
                padding: 10,
                borderWidth: 1,
                borderRadius: 10,
                fontSize: 17,
                backgroundColor: "#fff",
                marginTop: 20,
                borderColor: Colors.PRIMARY,
                fontFamily: "outfit",
                textAlignVertical: "top",
              }}
            />
          </View>
          <TouchableOpacity
            disabled={loading}
            style={{
              backgroundColor: Colors.PRIMARY,
              padding: 15,
              borderRadius: 10,
              marginTop: 20,
            }}
            onPress={onAddNewTips}
          >
            {loading ? (
              <ActivityIndicator size={"large"} color={"#fff"} />
            ) : (
              <Text
                style={{
                  textAlign: "center",
                  color: "#fff",
                  fontFamily: "outfit-medium",
                }}
              >
                Add Physio Video
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </CustomKeyBoardView>
    );
  }
  