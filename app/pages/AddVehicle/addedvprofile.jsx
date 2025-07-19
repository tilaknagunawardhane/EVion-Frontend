import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import CustomButton from '../../../components/CustomButton';
import AppBar from '../../../components/AppBar';
import colors from '../../../constants/color';
import fonts from '../../../constants/fonts';
import { router, useLocalSearchParams } from 'expo-router';
import { API_BASE_URL } from '@env';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import useUserData from '../../../hooks/useUserData';
import * as SecureStore from 'expo-secure-store';

const AddYourEVScreen = () => {
  const { user, isLoading: isUserLoading } = useUserData();
  const params = useLocalSearchParams();
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectFiles = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Permission required',
        'Sorry, we need camera roll permissions to make this work!',
        [{ text: 'OK' }]
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8, // Reduced quality for faster uploads
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleSkip = async () => {
    await submitVehicleData(null); // Submit without image
  };

  const handleAddVehicle = async () => {
    if (!selectedImage) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: 'No Image Selected',
        textBody: 'Please upload an image of your vehicle or skip this step',
      });
      return;
    }
    await submitVehicleData(selectedImage);
  };

  const submitVehicleData = async (imageUri) => {
    setIsLoading(true);
    setIsSubmitting(true);
    try {
      const token = await SecureStore.getItemAsync('accessToken');
      if (!token) {
        throw new Error('Not authenticated');
      }
      if (!user?._id) {
        throw new Error('User ID not found');
      }

      const formData = new FormData();
      formData.append('ownerId', user._id);

      // Add vehicle data from previous screens
      Object.entries(params).forEach(([key, value]) => {
        if (value && value !== 'undefined' && value !== 'null') {
          formData.append(key, value);
        }
      });

      if (imageUri) {
        const filename = imageUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image';

        formData.append('vehicleImage', {
          uri: imageUri,
          name: filename,
          type
        });
      }

      const response = await fetch(`${API_BASE_URL}/api/vehicles/addVehicle`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add vehicle');
      }

      const data = await response.json();

      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: 'Success',
        textBody: 'Vehicle added successfully',
      });

      // Navigate to next screen with proper data
      router.push({
        pathname: '/pages/AddVehicle/addedvprofile2',
        params: {
          userID: data.data?.userID || user._id,
          newVehicleID: data.data?.newVehicleID || data.data?._id
        }
      });

    } catch (error) {
      console.error('Submission error:', error);
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: error.message || 'Failed to submit vehicle data',
      });

      // Handle auth errors
      if (error.message.includes('authenticated') || error.message.includes('Unauthorized')) {
        router.replace('/pages/SignInScreen');
      }
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  };

  // Dynamic styles based on selectedImage
  const uploadBoxStyle = {
    ...styles.uploadBox,
    borderStyle: selectedImage ? 'solid' : 'dashed',
  };

  if (isUserLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading user data...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Please sign in to add a vehicle</Text>
        <CustomButton
          title="Go to Sign In"
          onPress={() => router.replace('/pages/SignInScreen')}
          type="primary"
          style={{ marginTop: 20 }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppBar />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Add Your EV</Text>
        <Text style={styles.subtitle}>Upload an image of your vehicle</Text>

        <View style={styles.stepIndicator}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={[styles.dot, styles.activeDot]} />
        </View>

        <Text style={styles.sectionTitle}>Vehicle Photo</Text>

        <View style={uploadBoxStyle}>
          {selectedImage ? (
            <Image
              source={{ uri: selectedImage }}
              style={styles.previewImage}
              resizeMode="contain"
            />
          ) : (
            <>
              <Image
                source={require('../../../assets/upload.png')}
                style={styles.uploadIcon}
              />
              <Text style={styles.uploadText}>Upload files here</Text>
            </>
          )}
          <TouchableOpacity
            style={styles.selectButton}
            onPress={handleSelectFiles}
            disabled={isLoading}
          >
            <Text style={styles.selectButtonText}>
              {selectedImage ? 'Change Image' : 'Select Files'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.bottomSection}>
        <TouchableOpacity onPress={handleSkip} disabled={isSubmitting}>
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>
        <CustomButton
          title="Add Vehicle"
          onPress={handleAddVehicle}
          type="primary"
          style={styles.addButton}
          loading={isSubmitting}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 24,
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
    marginBottom: 24,
  },
  stepIndicator: {
    flexDirection: 'row',
    marginBottom: 24,
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 8,
    backgroundColor: colors.stroke,
    marginHorizontal: 4,
  },
  activeDot: {
    width: 50,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    marginBottom: 12,
  },
  uploadBox: {
    borderWidth: 1,
    borderColor: colors.stroke,
    borderRadius: 12,
    height: 232,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    marginBottom: 20,
    overflow: 'hidden',
  },
  uploadIcon: {
    width: 32,
    height: 32,
    marginBottom: 8,
    tintColor: colors.secondaryText,
  },
  uploadText: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
    marginBottom: 12,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  selectButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 8,
    position: 'absolute',
    bottom: 16,
  },
  selectButtonText: {
    color: colors.background,
    fontFamily: fonts.PlusJakartaSansBold,
    fontSize: 14,
  },
  skipText: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
    textAlign: 'center',
    marginBottom: 6,
  },
  addButton: {
    width: '100%',
    height: 48,
    alignSelf: 'center',
  },
  bottomSection: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 8,
    alignItems: 'center',
    gap: 9,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 16,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.mainTextColor,
  },
});

export default AddYourEVScreen;