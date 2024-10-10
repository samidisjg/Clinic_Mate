import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Colors } from "../../constants/Colors";
import pdfIcon from "../../assets/images/pdfIcon.png"; // Adjusted path


const MedicalRecordsDetialsCard = ({ title, date, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <View style={styles.cardContent}>
        <Image
          source={pdfIcon} // Use imported image
          style={styles.icon}
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.date}>{date}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.LIGHTBLUE,
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.BLACK,
  },
  date: {
    fontSize: 14,
    color: Colors.GRAY,
  },
});

export default MedicalRecordsDetialsCard;
