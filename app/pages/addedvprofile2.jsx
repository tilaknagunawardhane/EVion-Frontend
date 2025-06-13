import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import CustomButton from '../../components/CustomButton';
import colors from '../../constants/color';
import fonts from '../../constants/fonts';
import VehicleProfile from '../../components/VehicleProfile';
import VehicleCard from '../../components/VehicleCard';
import { useNavigation } from '@react-navigation/native';
import InputField from '../../components/InputField';

const VehicleAddedScreen = ({ navigation, route }) => {
  // Get vehicle parameters from route params
  const vehicleParams = route?.params?.vehicle || {};

  const handleAddVehicle = () => {
    navigation.navigate('AddVehicle');
  };

  const handleAddAnotherVehicle = () => {
    navigation.navigate('AddVehicle');
  };

  const handleContinue = () => {
    navigation.navigate('Home'); // or your next screen
  };


  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>My Vehicles</Text>

        <View style={styles.vehicleListContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
            <VehicleProfile
              image={require('../../assets/car.png')}
              name={'BYD Atto 3\n(SUV)'}
            />
            <VehicleProfile
              image={require('../../assets/car.png')}
              name={'Tesla Model 3\n(Sedan)'}
            />
          </ScrollView>
        </View>


        <Text style={styles.subTitle}>New Vehicle Added!</Text>

        {/* Pass all vehicle parameters to VehicleCard */}
        <VehicleCard
          image={require('../../assets/car.png')}
          name="BYD Atto 3 (SUV)"
          year="2022"
          batteryCapacity="60.48kWh"
          batteryHealth="94%"
          connector1_image={require('../../assets/type2charger.png')}
          connector1_name="Type 2 (Mennekes)"
          connector2_image={require('../../assets/chademocharger.png')}
          connector2_name="CHAdeMO"
        />


      </ScrollView>
      <View />
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
  vehicleListContainer: {
    height: 140, // Adjust based on your VehicleProfile card height
    marginBottom: 30,
  },

  horizontalScroll: {
    flexDirection: 'row',
    gap: 16, // Space between cards
    paddingBottom: 10,
    paddingHorizontal: 10,
  },

  subTitle: {
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    textAlign: 'center',
    marginBottom: 15,
  },
  bottomSection: {
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  addAnotherText: {
    color: colors.primary,
    fontSize: 1,
    fontFamily: fonts.PlusJakartaSansMedium,
    textAlign: 'center',
    marginBottom: 30,
    // marginTop: 10
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
