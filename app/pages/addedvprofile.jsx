import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import CustomButton from '../../components/CustomButton';
import InputField from '../../components/InputField';
import AppBar from '../../components/AppBar';
import colors from '../../constants/color';
import fonts from '../../constants/fonts';
import { useNavigation } from '@react-navigation/native';

const AddYourEVScreen = () => {
  const navigation = useNavigation();

  const handleSelectFiles = () => {
    // Implement file/image picker logic here
    console.log('Select files tapped');
  };

  const handleSkip = () => {
    console.log('Skip tapped');
    // Navigate or skip action
  };

  const handleAddVehicle = () => {
    console.log('Add vehicle tapped');
    navigation.navigate('NextScreen'); // Replace with actual screen
  };

  return (
    <View style={styles.container}>
      <AppBar />
      <Text style={styles.title}>Add Your EV</Text>
      <Text style={styles.subtitle}>Upload an image of your vehicle</Text>

      {/* Step indicator */}
      <View style={styles.stepIndicator}>
        <View style={styles.dot} />
        <View style={styles.dot} />
         <View style={styles.dot} />
        <View style={[styles.dot, styles.activeDot]} />
        
      </View>

      <Text style={styles.sectionTitle}>Vehicle Photo</Text>

      <View style={styles.uploadBox}>
        <Image
          source={require('../../assets/upload.png')} // Replace with your actual icon
          style={styles.uploadIcon}
        />
        <Text style={styles.uploadText}>Upload files here</Text>
        <TouchableOpacity style={styles.selectButton} onPress={handleSelectFiles}>
          <Text style={styles.selectButtonText}>Select Files</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1 }} />

      <TouchableOpacity onPress={handleSkip}>
        <Text style={styles.skipText}>Skip for now</Text>
      </TouchableOpacity>

      <CustomButton
        title="Add Vehicle"
        onPress={handleAddVehicle}
        type="primary"
        style={styles.addButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
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
    borderRadius: 4,
    backgroundColor: colors.secondaryText,
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
    borderStyle: 'dashed',
    borderRadius: 12,
    height: 232,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    marginBottom: 20,
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
  selectButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 8,
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
    marginBottom: 12,
  },
  addButton: {
    width: '100%',
    height: 48,
    alignSelf: 'center',
  },
  bottomSection: {
    alignItems: 'center',
    gap: 16, // Adds space between skip text and button
    paddingBottom: 99, // Increased value brings the section up
  },
});

export default AddYourEVScreen;
