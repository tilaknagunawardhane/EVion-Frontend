import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import CustomButton from '../../components/CustomButton';
import colors from '../../constants/color';
import fonts from '../../constants/fonts';
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

            {/* Vehicle Icon & Name */}
            <View style={[styles.vehicleSummary, { alignItems: 'flex-start', marginBottom: 10 }]}>
                <View style={styles.vehicleIconCircle}>
                    <Image
                        source={require('../../assets/car.png')}
                        style={styles.vehicleIcon}
                        resizeMode="contain"
                    />
                </View>
                <Text style={styles.vehicleName}>BYD Atto 3{'\n'}(SUV)</Text>
            </View>

            <View style={{ height: 40}} />

            {/* Confirmation Message */}
            <Text style={[styles.subTitle, { marginBottom: 10 }]}>New Vehicle Added!</Text>

            {/* Vehicle Detail Card */}
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <View style={styles.cardInnerIconCircle}>
                        <Image
                            source={require('../../assets/car.png')}
                            style={styles.cardIcon}
                            resizeMode="contain"
                        />
                    </View>
                    <View style={styles.cardText}>
                        <Text style={[styles.cardTitle, { color:colors.mainTextColor }]}>BYD Atto 3 (SUV)</Text>
                        <Text style={[styles.cardYear, { color: colors.secondaryText }]}>2022</Text>


                        <Text style={[styles.cardSpec, { color: colors.mainTextColor}]}>Battery Capacity: 60.48kWh</Text>
                        <Text style={[styles.cardSpec, { color: colors.mainTextColor}]}>Battery Health: 94%</Text>
                    </View>
                </View>
                <View style={styles.separator} />

                {/* Charger Types */}
                <View style={styles.chargerRow}>
                    <View style={styles.chargerItem}>
                        <Image
                            source={require('../../assets/type2charger.png')}
                            style={styles.chargerIcon}
                            resizeMode="contain"
                        />
                        <Text style={styles.chargerText}>Type 2 (Mennekes)</Text>
                    </View>
                    <View style={styles.chargerItem}>
                        <Image
                            source={require('../../assets/chademocharger.png')}
                            style={styles.chargerIcon}
                            resizeMode="contain"
                        />
                        <Text style={styles.chargerText}>CHAdeMO</Text>
                    </View>
                </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.bottomSection}>
                <Text
                    style={[styles.addAnotherText, ]}
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
    paddingTop: 50,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 20,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    marginBottom: 24,
  },
  vehicleSummary: {
    alignItems: 'center',
    marginBottom: 30,
  },
  vehicleIconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  vehicleIcon: {
    width: 40,
    height: 40,
    tintColor: colors.primary,
  },
  vehicleName: {
    fontFamily: fonts.PlusJakartaSans,
    fontSize: 14,
    color: colors.mainTextColor,
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 18,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
   
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 240,
  },
  cardHeader: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
  },
  cardInnerIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardIcon: {
    width: 30,
    height: 30,
    tintColor: colors.primary,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontFamily: fonts.PlusJakartaSansBold,
    fontSize: 16,
    color: colors.mainTextColor,
    marginBottom: 4,
  },
  cardYear: {
    fontFamily: fonts.PlusJakartaSans,
    fontSize: 14,
    color: colors.secondaryText,
    marginBottom: 4,
  },
  cardSpec: {
    fontFamily: fonts.PlusJakartaSans,
    fontSize: 14,
    color: colors.primary, // same as car name color
    marginBottom: 2,
  },
  separator: {
    height: 1,
    backgroundColor:colors.stroke,
    marginVertical: 16,
  },
  chargerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chargerItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chargerIcon: {
    width: 24,
    height: 24,
    marginRight: 6,
  },
  chargerText: {
    fontSize: 13,
    color: colors.mainTextColor,
    fontFamily: fonts.PlusJakartaSans,
  },
  bottomSection: {
    marginBottom: 30,
    justifyContent: 'flex-end',
  },
  addAnotherText: {
    color: colors.primary,
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
    textAlign: 'center',
    marginBottom: 16,
  },
});

export default VehicleAddedScreen;
