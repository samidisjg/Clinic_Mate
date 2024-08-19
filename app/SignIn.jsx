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
import { Ionicons, Octicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Loading from "../components/Loading";
import CustomKeyBoardView from "../components/CustomKeyBoardView";
import { useAuth } from "../context/AuthContextProvider";

export default function SignIn() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const emailRef = useRef("");
  const passwordRef = useRef("");

  const handleSignIn = async () => {
    if (!emailRef.current || !passwordRef.current) {
      Alert.alert("Sign In", "Please fill all the fields");
      return;
    }
    // login process
    setLoading(true);
    const res = await login(emailRef.current, passwordRef.current);
    setLoading(false);
    console.log("Sign In response : ", res);
    if (!res.success) {
      Alert.alert("Sign In", res.msg);
    }
  };

  return (
    <CustomKeyBoardView>
      <StatusBar style="dark" />
      <View
        style={{
          flex: 1,
          gap: 12,
          paddingTop: hp(5),
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
            source={require("../assets/images/SignIn.png")}
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
            In
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
            <View style={{ gap: 3 }}>
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
              <Text
                style={{
                  fontSize: hp(1.6),
                  color: "#737373",
                  textAlign: "right",
                  fontWeight: "semibold",
                  fontFamily: "outfit-medium",
                }}
              >
                Forgot password
              </Text>
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
                  onPress={handleSignIn}
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
                    Sign In
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
                Don't have an account?
              </Text>
              <Pressable onPress={() => router.push("SignUp")}>
                <Text
                  style={{
                    fontSize: hp(1.6),
                    color: Colors.PRIMARY,
                    fontWeight: "bold",
                    marginLeft: 5,
                  }}
                >
                  Sign Up
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </CustomKeyBoardView>
  );
}
