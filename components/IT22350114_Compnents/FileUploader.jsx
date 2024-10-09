import React, { useState } from "react";
import { View, TouchableOpacity, Text, ActivityIndicator, ToastAndroid } from "react-native";
import * as DocumentPicker from "expo-document-picker"; // Import Document Picker for file uploads
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"; // Import Firebase Storage
import { Colors } from "../constants/Colors"; // Update path to match your project structure

export default function FileUploader({ onFileUploadComplete }) {
  const [file, setFile] = useState(null);
  const [blobFile, setBlobFile] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [loading, setLoading] = useState(false);

  // Function to handle file picking and convert to blob
  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });

      if (result.type === "success") {
        const fileUri = result.uri;
        const fileName = result.name;

        // Convert the selected file to a blob
        const response = await fetch(fileUri);
        const fileBlob = await response.blob();

        setFile(result);
        setBlobFile(fileBlob); // Set the blob file
        setFileUrl(""); // Reset file URL whenever a new file is selected
        ToastAndroid.show("File Selected Successfully", ToastAndroid.LONG);
        console.log("File selected:", result);
      }
    } catch (error) {
      console.error("Error selecting file:", error);
      ToastAndroid.show("Error selecting file: " + error.message, ToastAndroid.LONG);
    }
  };

  // Function to handle file upload to Firebase Storage using `uploadBytesResumable`
  const uploadFile = async () => {
    try {
      if (!blobFile || !file) throw new Error("No file selected. Please pick a file first.");

      setLoading(true); // Set loading state for file upload
      const storage = getStorage();
      const fileName = file.name; // Use the file name from the selected file
      const storageRef = ref(storage, `medicalRecords/${fileName}`);

      console.log("Uploading file to Firebase Storage:", file.uri);

      // Upload the blob file using `uploadBytesResumable`
      const uploadTask = uploadBytesResumable(storageRef, blobFile);

      // Monitor the upload process and get the download URL after upload completes
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // You can monitor upload progress here if needed
          console.log("Upload progress:", (snapshot.bytesTransferred / snapshot.totalBytes) * 100, "%");
        },
        (error) => {
          console.error("File upload error:", error);
          setLoading(false);
        },
        async () => {
          // Get the download URL after the upload is complete
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("File available at:", downloadUrl);
          setFileUrl(downloadUrl); // Set the file URL state
          ToastAndroid.show("File Uploaded Successfully", ToastAndroid.LONG);
          setLoading(false);

          // Pass the URL back to the parent component using the callback function
          onFileUploadComplete(downloadUrl);
        }
      );
    } catch (error) {
      console.error("Error uploading file:", error);
      setLoading(false); // Stop loading indicator
      ToastAndroid.show("Error uploading file: " + error.message, ToastAndroid.LONG);
    }
  };

  return (
    <View>
      {/* File Picker */}
      <TouchableOpacity
        style={{ padding: 15, backgroundColor: Colors.PRIMARY, borderRadius: 10, marginTop: 10 }}
        onPress={pickFile}
      >
        <Text style={{ color: "#fff", textAlign: "center" }}>Upload File</Text>
      </TouchableOpacity>

      {/* Display Selected File */}
      {file && (
        <Text style={{ fontSize: 14, color: Colors.GRAY, marginTop: 10 }}>
          Selected File: {file.name}
        </Text>
      )}

      {/* Upload Button */}
      <TouchableOpacity
        disabled={loading || !file} // Disable button if loading or no file selected
        style={{ padding: 15, backgroundColor: Colors.PRIMARY, borderRadius: 10, marginTop: 10 }}
        onPress={uploadFile}
      >
        {loading ? (
          <ActivityIndicator size={"large"} color={"#fff"} />
        ) : (
          <Text style={{ color: "#fff", textAlign: "center" }}>Upload</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
