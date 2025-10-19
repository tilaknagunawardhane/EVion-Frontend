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
  Text,
  ActivityIndicator // Added for explicit loading indicator (though YourThoughtsHeader may handle it)
} from "react-native";
import { useRouter } from "expo-router";
import { API_BASE_URL } from '@env';
import * as ImagePicker from 'expo-image-picker';
import colors from "../../../constants/color";
import fonts from "../../../constants/fonts";
import YourThoughtsHeader from "../../../components/community/YourThoughtsHeader";
import CustomTextInput from "../../../components/CustomTextInput";
// 🔑 IMPORT THE AUTH HOOK
import { useAuth } from '../../../context/AuthContext'; // ⚠️ VERIFY THIS PATH!
const BACKEND_URL = API_BASE_URL;


const YourThoughts = () => {
  // 🔑 USE THE HOOK TO GET THE CURRENT USER
  const { user, isLoading: isAuthLoading } = useAuth();
  
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
    // 🔑 Dynamic User Check
    if (!user) {
        Alert.alert("Login Required", "You must be logged in to share a discussion.");
        return;
    }
    
    // 🔑 Get dynamic user details
    const currentUserName = user.name || user.userName || user.email;
    const currentUserId = user._id || user.id;

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
        // 🔑 Use dynamic user data
        user: currentUserName, // Display name
        userId: currentUserId, // Unique ID for backend linking
        title,
        description,
        hashtags,
        images: selectedImages
      };

      console.log("Posting discussion to backend:", discussionData);

      // Assuming your API requires an Authorization header for authenticated actions
      // You should generally pass the auth token here, but based on your previous code 
      // where you didn't have a token, I'll stick to passing user data in the body.

      const response = await fetch(
        `${BACKEND_URL}/api/discussions/create-discussion`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(discussionData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to post discussion");
      }

      console.log("Response from backend:", data);

      Alert.alert("Success", "Your discussion has been posted!", [
        {
          text: "OK",
          onPress: () => {
            setTitle("");
            setDescription("");
            setSelectedImages([]);
            router.push("/(tabs)/Community");
          },
        },
      ]);
    } catch (error) {
      console.error("Error posting discussion:", error);
      Alert.alert("Error", "Failed to post discussion. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Optionally show a loading state while fetching auth context
  if (isAuthLoading) {
    return (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={{color: colors.secondaryText, marginTop: 10}}>Loading user data...</Text>
        </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <YourThoughtsHeader
        title="Your Thoughts"
        onBack={handleBack}
        onAttach={pickImage}
        onPost={handleShare}
        isSubmitting={isSubmitting}
        // Disable posting if not logged in
        postDisabled={isSubmitting || !user} 
      />

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <CustomTextInput
          placeholder="Add title here"
          value={title}
          onChangeText={setTitle}
          multiline={true}
          withBorder={true}
          minHeight={50}
          maxLength={100}
          inputStyle={styles.titleInput}
          editable={!!user} // Disable if not logged in
        />

        <CustomTextInput
          placeholder={!user ? "Please log in to start a discussion." : "Add description here (Use '#' to add keywords eg: #ChargingStations)"}
          value={description}
          onChangeText={setDescription}
          multiline={true}
          minHeight={150}
          inputStyle={styles.descriptionInput}
          maxLength={1000}
          editable={!!user} // Disable if not logged in
        />
        
        {/* Login Prompt */}
        {!user && (
            <View style={styles.loginPrompt}>
                <Text style={styles.loginPromptText}>You must be logged in to create a discussion.</Text>
                <TouchableOpacity onPress={() => router.push("/login")}>
                    <Text style={styles.loginButtonText}>Login Now</Text>
                </TouchableOpacity>
            </View>
        )}

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

        {(selectedImages.length > 0 || user) && ( // Show image section if images are present OR user is logged in
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
                  {/* Remove button only visible if user is logged in */}
                  {!!user && ( 
                    <TouchableOpacity 
                      style={styles.removeImageButton}
                      onPress={() => handleRemoveImage(index)}
                    >
                      <Text style={styles.removeImageText}>×</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
              {selectedImages.length < 4 && !!user && ( // Only show add button if user is logged in
                <TouchableOpacity 
                  style={styles.addImageButton}
                  onPress={pickImage}
                  disabled={!user}
                >
                  <Text style={styles.addImageText}>+</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        )}

        {selectedImages.length === 0 && !!user && (
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  loginPrompt: {
    backgroundColor: colors.stroke,
    borderRadius: 8,
    padding: 15,
    marginVertical: 10,
    alignItems: 'center',
  },
  loginPromptText: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.secondaryText,
    marginBottom: 5,
  },
  loginButtonText: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.primary,
    textDecorationLine: 'underline',
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
  attachIcon: { 
    width: 16, 
    height: 16, 
    tintColor: colors.primary, // Assuming you want a tint
    marginRight: 8,
  },
  attachButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  attachText: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.primary,
  }
});

export default YourThoughts;