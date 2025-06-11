import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import CustomButton from '../../components/CustomButton';
import colors from '../../constants/color';
import fonts from '../../constants/fonts';
import VehicleProfile from '../../components/VehicleProfile';
import VehicleCard from '../../components/VehicleCard';
import { useNavigation } from '@react-navigation/native';
import InputField from '../../components/InputField';

const VehicleAddedScreen = ({ navigation }) => {
  const handleAddAnotherVehicle = () => {
    // navigation logic for adding another vehicle
  };

  const handleContinue = () => {
    // navigation logic for continuing
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>My Vehicles</Text>

        <VehicleProfile />

        {/* Added spacing between profile and subtitle */}
        <View style={{ height: 20 }} />

        <Text style={styles.subTitle}>New Vehicle Added!</Text>

        <VehicleCard />

        {/* Action Buttons */}
        <View style={styles.bottomSection}>
          <Text style={styles.addAnotherText}></Text>
          <View style={{ marginBottom: -40 }} />
          <Text
            style={styles.addAnotherLink}
            onPress={handleAddAnotherVehicle}
          >
            Add Another Vehicle
          </Text>
          <CustomButton title="Continue" onPress={handleContinue} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 18,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    marginBottom: 20,
  },
  subTitle: {
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    textAlign: 'center',
    marginBottom: 15,
  },
  bottomSection: {
    marginTop: 10,
    marginBottom: 20,
  },
  addAnotherText: {
    color: colors.primary,
    fontSize: 1,
    fontFamily: fonts.PlusJakartaSansMedium,
    textAlign: 'center',
    marginBottom: 270,
  },
  addAnotherLink: {
    color: colors.primary,
    textAlign: 'center',
    fontFamily: fonts.PlusJakartaSansMedium,
    fontSize: 14, // reduced from 16 to 14
    marginBottom: 10,
  },
});

export default VehicleAddedScreen;
