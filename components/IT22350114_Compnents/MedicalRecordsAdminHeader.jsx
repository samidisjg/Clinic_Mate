import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen"; // For responsive screen dimensions
import { Colors } from "../../constants/Colors"; // Import your custom colors

export default function MedicalRecordsAdminHeader() {
  const { top } = useSafeAreaInsets(); // Handle safe area insets for devices with notches

  return (
    <View
      style={[
        styles.container,
        { paddingTop: top + 10 }, // Add top padding based on safe area insets
      ]}
    >
      {/* Left Side: Title */}
      <Text style={styles.title}>Medical{"\n"}Records</Text>

      {/* Right Side: Logo */}
      <Image
        source={require("./../../assets/images/adminLogo.png")} // Update with your image path
        style={styles.logo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row", // Align items in a row
    justifyContent: "space-between", // Space between the title and the logo
    alignItems: "center", // Align items vertically centered
    paddingHorizontal: wp("5%"), // Responsive horizontal padding (5% of screen width)
    paddingBottom: hp("2%"), // Responsive bottom padding (2% of screen height)
    borderBottomLeftRadius: 20, // Rounded corners on the bottom left
    borderBottomRightRadius: 20, // Rounded corners on the bottom right
    backgroundColor: "#ffffff", // Background color (if needed)
    position: "relative", // Add relative positioning to adjust absolute children
  },
  title: {
    color: Colors.BLACK, // Use your primary color
    fontSize: wp("7%"), // Font size as a percentage of screen width
    fontFamily: "outfit-medium", // Custom font
    fontWeight: "600", // Font weight
    width: wp("40%"), // Set a width constraint to wrap text to 2 lines
    flexWrap: "wrap", // Enable text wrapping
    lineHeight: wp("8%"), // Adjust line height for better spacing
    textAlign: "left", // Align text to the left
  },
  //   logo: {
  //     width: wp("50%"), // Set a smaller width for the logo
  //     height: undefined, // Let height be determined automatically
  //     aspectRatio: 3, // Maintain aspect ratio (width / height = 3)
  //     resizeMode: "contain", // Keep aspect ratio
  //     position: "absolute", // Use absolute positioning
  //     right: wp("-5%"), // Move the logo further right by increasing the negative value
  //   },

  logo: {
    width: wp("50%"), // Set a smaller width for the logo
    height: undefined, // Let height be determined automatically
    aspectRatio: 3, // Maintain aspect ratio (width / height = 3)
    resizeMode: "contain", // Keep aspect ratio
    marginRight: wp("-10%"), // Move the logo further right using margin
  },
});
