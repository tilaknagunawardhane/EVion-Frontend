import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import colors from "../../constants/color";
import YourThoughtsHeader from "../../components/YourThoughtsHeader";
import CustomTextInput from "../../components/CustomTextInput";
import ImageUpload from "../../components/ImageUpload";

const YourThoughts = () => {
  const [title, setTitle] = useState("BYD Atto 3 vs Nissan Leaf - Which is Better for Long Trips?");
  const [description, setDescription] = useState("Hi everyone, I recently bought an EV and noticed that the real-world range I'm getting on a full charge is significantly lower than the manufacturer's advertised range");
  const [selectedImage, setSelectedImage] = useState(require("../../assets/Station.jpg"));
  const router = useRouter();

  const handleImageUpload = () => {
    // For demo purposes, we'll set a placeholder image
    setSelectedImage(require("../../assets/Station.jpg"));
  };

  const handleBack = () => {
    // Navigate back to home/community page
    router.back();
  };

  const handleAttach = () => {
    // Handle attach action (file picker, image picker, etc.)
    handleImageUpload();
  };

  const handleShare = () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please add a title for your discussion");
      return;
    }
    
    if (!description.trim()) {
      Alert.alert("Error", "Please add a description for your discussion");
      return;
    }

    // Handle post submission logic here
    Alert.alert("Success", "Your discussion has been posted!", [
      {
        text: "OK",
        onPress: () => {
          // Navigate back to home after successful post
          router.push("/(tabs)");
        }
      }
    ]);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <YourThoughtsHeader
        title="Your Thoughts"
        onBack={handleBack}
        onEdit={handleAttach}
        onPost={handleShare}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Title Input */}
        <CustomTextInput
          placeholder="Add title here"
          value={title}
          onChangeText={setTitle}
          multiline={true}
          withBorder={true}
          minHeight={50}
        />

        {/* Description Input */}
        <CustomTextInput
          placeholder="Add description here (Use '#' to add keywords eg: #ChargingStations)"
          value={description}
          onChangeText={setDescription}
          multiline={true}
          minHeight={100}
          inputStyle={styles.descriptionInput}
        />

        {/* Image Upload Section */}
        <ImageUpload
          selectedImage={selectedImage}
          onRemoveImage={handleRemoveImage}
        />

        {/* Add more content space for scrolling */}
        <View style={styles.spacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  descriptionInput: {
    paddingTop: 16,
  },
  spacer: {
    height: 100,
  },
});

export default YourThoughts;
