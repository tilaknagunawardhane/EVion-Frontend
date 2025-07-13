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
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddYourEVScreen = () => {
  const params = useLocalSearchParams();
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function getUser() {
      const user = await AsyncStorage.getItem('user');
      if (user) {
        console.log(user);
        setUser(JSON.parse(user));
      }
    }
    getUser();
  }, []);

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
    try {

      if (user && user.user._id) {
        const userId = user.user._id;
        console.log(userId);

        const formData = new FormData();

        formData.append('ownerId', userId);

        // Add all vehicle data from previous screens
        Object.entries(params).forEach(([key, value]) => {
          if (value) formData.append(key, value);
        });

        // Add image file if exists
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

        console.log(formData);

        const response = await fetch(`${API_BASE_URL}/api/vehicles/addVehicle`, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
          },
        });

        const data = await response.json();

        if (!response.ok) {
          Toast.show({
            type: ALERT_TYPE.DANGER,
            textBody: data.message || 'Failed to add vehicle',
            title: 'Error',

          });
          return;
          // throw new Error(data.message || 'Failed to add vehicle');
        }

        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          textBody: 'Vehicle added successfully',
          title: 'success',
        });

        setTimeout(() => {
          router.push({
            pathname: '/pages/AddVehicle/addedvprofile2',
            params: {
              userID: data.data.userID,
              newVehicleID: data.data.newVehicleID
            }
          });
        }, 1500);
        // Navigate to success screen
      }
      else {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: 'Error',
          textBody: 'Please Sign Up first',
        });
      }
    } catch (error) {
      console.error('Submission error:', error);
      Toast.show({
        type: ALERT_TYPE.ERROR,
        title: 'Error',
        textBody: error.message || 'Failed to submit vehicle data',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Dynamic styles based on selectedImage
  const uploadBoxStyle = {
    ...styles.uploadBox,
    borderStyle: selectedImage ? 'solid' : 'dashed',
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Uploading your vehicle...</Text>
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
        <TouchableOpacity onPress={handleSkip} disabled={isLoading}>
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>
        <CustomButton
          title="Add Vehicle"
          onPress={handleAddVehicle}
          type="primary"
          style={styles.addButton}
          loading={isLoading}
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