import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
  TouchableOpacity,
  Text
} from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import colors from "../../../constants/color";
import fonts from "../../../constants/fonts";
import YourThoughtsHeader from "../../../components/community/YourThoughtsHeader";
import CustomTextInput from "../../../components/CustomTextInput";

const YourThoughts = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

   useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission required',
          'Sorry, we need camera roll permissions to upload images.'
        );
      }
    })();
  }, []);

  const pickImage = async () => {
    try {
      if (selectedImages.length >= 4) {
        Alert.alert("Limit Reached", "You can attach up to 4 images only");
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedImages([...selectedImages, result.assets[0].uri]);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  const handleBack = () => {
    if (title || description || selectedImages.length > 0) {
      Alert.alert(
        "Discard Changes?",
        "You have unsaved changes. Are you sure you want to leave?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Discard", onPress: () => router.back() },
        ]
      );
    } else {
      router.back();
    }
  };

  const handleRemoveImage = (index) => {
    const newImages = [...selectedImages];
    newImages.splice(index, 1);
    setSelectedImages(newImages);
  };

  const extractHashtags = (text) => {
    const hashtagRegex = /#(\w+)/g;
    const matches = text.match(hashtagRegex);
    return matches ? matches.map(tag => tag.substring(1)) : [];
  };

  const handleShare = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please add a title for your discussion");
      return;
    }
    
    if (!description.trim()) {
      Alert.alert("Error", "Please add a description for your discussion");
      return;
    }

    setIsSubmitting(true);

    try {
      const hashtags = extractHashtags(description);
      
      const discussionData = {
        title,
        description,
        hashtags,
        images: selectedImages,
        userName: "Current User",
        timeAgo: "Just now",
      };

      console.log("Posting discussion:", discussionData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      Alert.alert("Success", "Your discussion has been posted!", [
        {
          text: "OK",
          onPress: () => {
            setTitle("");
            setDescription("");
            setSelectedImages([]);
            router.push("/(tabs)/Community");
          }
        }
      ]);
    } catch (error) {
      console.error("Error posting discussion:", error);
      Alert.alert("Error", "Failed to post discussion. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      {/* Header with attach button */}
      <YourThoughtsHeader
        title="Your Thoughts"
        onBack={handleBack}
        onAttach={pickImage}
        onPost={handleShare}
        isSubmitting={isSubmitting}
      />

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Title Input */}
        <CustomTextInput
          placeholder="Add title here"
          value={title}
          onChangeText={setTitle}
          multiline={true}
          withBorder={true}
          minHeight={50}
          maxLength={100}
          inputStyle={styles.titleInput}
        />

        {/* Description Input */}
        <CustomTextInput
          placeholder="Add description here (Use '#' to add keywords eg: #ChargingStations)"
          value={description}
          onChangeText={setDescription}
          multiline={true}
          minHeight={150}
          inputStyle={styles.descriptionInput}
          maxLength={1000}
        />

        {/* Hashtag Preview */}
        {extractHashtags(description).length > 0 && (
          <View style={styles.hashtagContainer}>
            <Text style={styles.hashtagTitle}>Tags:</Text>
            <View style={styles.hashtagList}>
              {extractHashtags(description).map((tag, index) => (
                <View key={index} style={styles.hashtagPill}>
                  <Text style={styles.hashtagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Image Upload Section */}
        {selectedImages.length > 0 && (
          <View style={styles.imagesContainer}>
            <Text style={styles.sectionTitle}>Attached Images ({selectedImages.length}/4)</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.imagesScrollContainer}
            >
              {selectedImages.map((uri, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image 
                    source={{ uri }} 
                    style={styles.image} 
                    onError={() => console.log("Failed to load image")}
                  />
                  <TouchableOpacity 
                    style={styles.removeImageButton}
                    onPress={() => handleRemoveImage(index)}
                  >
                    <Text style={styles.removeImageText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
              {selectedImages.length < 4 && (
                <TouchableOpacity 
                  style={styles.addImageButton}
                  onPress={pickImage}
                >
                  <Text style={styles.addImageText}>+</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        )}

        {/* Add Image Button (when no images are selected) */}
        {selectedImages.length === 0 && (
          <TouchableOpacity 
            style={styles.attachButton}
            onPress={pickImage}
          >
            <Image 
              source={require("../../../assets/Attached.png")} 
              style={styles.attachIcon}
            />
            <Text style={styles.attachText}>Attach Images (up to 4)</Text>
          </TouchableOpacity>
        )}

        {/* Add more content space for scrolling */}
        <View style={styles.spacer} />
      </ScrollView>
    </KeyboardAvoidingView>
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
  titleInput: {
    fontSize: 18,
    fontFamily: fonts.PlusJakartaSansBold,
    marginBottom: 16,
  },
  descriptionInput: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    lineHeight: 20,
    paddingTop: 16,
  },
  hashtagContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  hashtagTitle: {
    fontSize: 12,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.secondaryText,
    marginBottom: 4,
  },
  hashtagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  hashtagPill: {
    backgroundColor: colors.stroke,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  hashtagText: {
    fontSize: 12,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.primary,
  },
  imagesContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.mainTextColor,
    marginBottom: 12,
  },
  imagesScrollContainer: {
    paddingBottom: 8,
  },
  imageWrapper: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 12,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageText: {
    color: colors.background,
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSansBold,
    lineHeight: 20,
    marginTop: -2,
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.stroke,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageText: {
    fontSize: 24,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.secondaryText,
  },
  spacer: {
    height: 100,
  },
  attachIcon:{
    width: 16,
    height: 16
  }
});

export default YourThoughts;