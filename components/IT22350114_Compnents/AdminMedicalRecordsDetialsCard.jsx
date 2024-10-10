import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import { Colors } from "../../constants/Colors";
import pdfIcon from "../../assets/images/pdfIcon.png";

const AdminMedicalRecordsDetialsCard = ({ title, date, onEdit, onDelete }) => {
  const [menuVisible, setMenuVisible] = useState(false); // State to control the visibility of the menu

  const handleEdit = () => {
    onEdit(); // Call the edit function passed as a prop
    setMenuVisible(false); // Close the menu
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Record",
      "Are you sure you want to delete this record?",
      [
        {
          text: "Cancel",
          onPress: () => setMenuVisible(false),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            onDelete(); // Call the delete function passed as a prop
            setMenuVisible(false); // Close the menu
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <TouchableOpacity style={styles.card}>
      <View style={styles.cardContent}>
        <Image source={pdfIcon} style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.date}>{date}</Text>
        </View>
        <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
          <Text style={styles.menuIcon}>⋮</Text> {/* Three dots for the menu */}
        </TouchableOpacity>
      </View>
      {menuVisible && (
        <View style={styles.menu}>
          <TouchableOpacity onPress={handleEdit} style={styles.menuItem}>
            <Text>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} style={styles.menuItem}>
            <Text>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
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
    justifyContent: "space-between", // Added to space the items evenly
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
  menuIcon: {
    fontSize: 20, // Adjust size of the three dots
    color: Colors.BLACK,
  },
  menu: {
    position: "absolute",
    top: 50, // Adjust based on your design
    right: 20, // Position to the right
    backgroundColor: Colors.WHITE,
    borderRadius: 5,
    elevation: 5,
    padding: 10,
  },
  menuItem: {
    padding: 10,
  },
});

export default AdminMedicalRecordsDetialsCard;
