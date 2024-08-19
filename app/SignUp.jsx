import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Pressable,
  Alert,
} from "react-native";
import React, { useRef, useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { StatusBar } from "expo-status-bar";
import { Colors } from "./../constants/Colors";
import { Feather, Ionicons, Octicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Loading from "../components/Loading";
import CustomKeyBoardView from "../components/CustomKeyBoardView";
import { useAuth } from "../context/AuthContextProvider";
import * as ImagePicker from "expo-image-picker";

export default function SignUp() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { register } = useAuth();

  const emailRef = useRef("");
  const passwordRef = useRef("");
  const usernameRef = useRef();
  const profileUrlRef = useRef();

  const handleSignUp = async () => {
    if (!emailRef.current || !passwordRef.current || !usernameRef.current || !profileUrlRef.current) {
      Alert.alert("Sign Up", "Please fill all the fields");
      return;
    }
    // register process
    setLoading(true);
    const res = await register(
      emailRef.current,
      passwordRef.current,
      usernameRef.current,
      profileUrlRef.current
    );
    setLoading(false);
    console.log("got result : ", res);
    if (!res.success) {
      Alert.alert("Sign Up", res.msg);
    }
  };

  const onImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    console.log("result : ", result);
    // if (!result.canceled) {
    //   setImage(result?.assets[0]?.uri);
    // }
  };

  return (
    <CustomKeyBoardView>
      <StatusBar style="dark" />
      <View
        style={{
          flex: 1,
          gap: 12,
          paddingTop: hp(2),
          paddingHorizontal: wp(5),
        }}
      >
        {/* Sign In Image */}
        <View
          style={{
            alignItems: "center",
          }}
        >
          <Image
            source={require("../assets/images/SignUp.png")}
            style={{ height: hp(40) }}
            resizeMode="contain"
          />
        </View>
        <View
          style={{
            gap: 10,
            padding: 20,
            backgroundColor: "#ccccff",
            borderRadius: 20,
            marginBottom: hp(5),
          }}
        >
          <Text
            style={{
              fontSize: hp(4),
              fontWeight: "bold",
              textAlign: "center",
              letterSpacing: 1.5,
              fontFamily: "outfit-bold",
            }}
          >
            <Text
              style={{
                color: Colors.PRIMARY,
              }}
            >
              Sign
            </Text>{" "}
            Up
          </Text>
          {/* inputs */}
          <View style={{ gap: 20, marginTop: 10 }}>
            <View
              style={{
                height: hp(7),
                flexDirection: "row",
                gap: 10,
                backgroundColor: "#f5f5f5",
                alignItems: "center",
                paddingHorizontal: wp(5),
                borderRadius: 10,
                borderColor: Colors.PRIMARY,
                borderWidth: 1,
              }}
            >
              <Feather name="user" size={hp(2.7)} color="gray" />
              <TextInput
                onChangeText={(value) => (usernameRef.current = value)}
                style={{
                  fontSize: hp(2),
                  flex: 1,
                  fontWeight: "semibold",
                  color: "#404040",
                  fontFamily: "outfit-medium",
                }}
                placeholder="Username"
                placeholderTextColor={"gray"}
              />
            </View>
            <View
              style={{
                height: hp(7),
                flexDirection: "row",
                gap: 10,
                backgroundColor: "#f5f5f5",
                alignItems: "center",
                paddingHorizontal: wp(5),
                borderRadius: 10,
                borderColor: Colors.PRIMARY,
                borderWidth: 1,
              }}
            >
              <Octicons name="mail" size={hp(2.7)} color="gray" />
              <TextInput
                onChangeText={(value) => (emailRef.current = value)}
                style={{
                  fontSize: hp(2),
                  flex: 1,
                  fontWeight: "semibold",
                  color: "#404040",
                  fontFamily: "outfit-medium",
                }}
                placeholder="Email address"
                placeholderTextColor={"gray"}
              />
            </View>
            <View
              style={{
                height: hp(7),
                flexDirection: "row",
                gap: 10,
                backgroundColor: "#f5f5f5",
                alignItems: "center",
                paddingHorizontal: wp(5),
                borderRadius: 10,
                borderColor: Colors.PRIMARY,
                borderWidth: 1,
              }}
            >
              <Octicons name="lock" size={hp(2.7)} color="gray" />
              <TextInput
                onChangeText={(value) => (passwordRef.current = value)}
                style={{
                  fontSize: hp(2),
                  flex: 1,
                  fontWeight: "semibold",
                  color: "#404040",
                  fontFamily: "outfit-medium",
                }}
                placeholder="Password"
                secureTextEntry={!passwordVisible}
                placeholderTextColor={"gray"}
              />
              <TouchableOpacity
                onPress={() => setPasswordVisible(!passwordVisible)}
              >
                <Ionicons
                  name={passwordVisible ? "eye-off" : "eye"}
                  size={hp(2.7)}
                  color="gray"
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                height: hp(7),
                flexDirection: "row",
                gap: 10,
                backgroundColor: "#f5f5f5",
                alignItems: "center",
                paddingHorizontal: wp(5),
                borderRadius: 10,
                borderColor: Colors.PRIMARY,
                borderWidth: 1,
              }}
            >
              <Feather name="image" size={hp(2.7)} color="gray" />
              <TextInput
                onChangeText={(value) => (profileUrlRef.current = value)}
                style={{
                  fontSize: hp(2),
                  flex: 1,
                  fontWeight: "semibold",
                  color: "#404040",
                  fontFamily: "outfit-medium",
                }}
                placeholder="Profile Url"
                placeholderTextColor={"gray"}
              />
            </View>
            {/* submit button */}
            <View>
              {loading ? (
                <View
                  style={{
                    height: hp(7),
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 10,
                  }}
                >
                  <Loading size={hp(12)} />
                </View>
              ) : (
                <TouchableOpacity
                  onPress={handleSignUp}
                  style={{
                    height: hp(7),
                    backgroundColor: Colors.PRIMARY,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: hp(2.5),
                      color: "#fff",
                      fontWeight: "bold",
                      letterSpacing: 1.5,
                      fontFamily: "outfit-bold",
                    }}
                  >
                    Sign Up
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            {/* sing up text */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                marginTop: -15,
              }}
            >
              <Text
                style={{
                  fontSize: hp(1.6),
                  color: "#737373",
                  textAlign: "right",
                  fontWeight: "semibold",
                  fontFamily: "outfit-medium",
                }}
              >
                Already have an account?
              </Text>
              <Pressable onPress={() => router.push("SignIn")}>
                <Text
                  style={{
                    fontSize: hp(1.6),
                    color: Colors.PRIMARY,
                    fontWeight: "bold",
                    marginLeft: 5,
                  }}
                >
                  Sign In
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </CustomKeyBoardView>
  );
}
