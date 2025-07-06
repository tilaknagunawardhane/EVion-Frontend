import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import colors from '../../../constants/color';
import fonts from '../../../constants/fonts';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const MyEVsScreen = () => {
  const router = useRouter();

  const myVehicles = [
    {
      brand: 'BYD',
      model: 'Atto 3 (SUV)',
      year: '2025',
      power: '61.4 kW',
      image: require('../../../assets/BYDred.png'),
    },
    {
      brand: 'Ford',
      model: 'Mustang (Mach-E)',
      year: '2023',
      power: '62 kW',
      image: require('../../../assets/Ford.png'),
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.mainTextColor} />
        </TouchableOpacity>
        <Text style={styles.title}>My EVs</Text>
        <TouchableOpacity onPress={() => router.push('pages/AddVehicle1')}>
          <Ionicons name="add-circle-outline" size={24} color={colors.mainTextColor} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {myVehicles.map((vehicle, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
             onPress={() =>
                router.push({
                  pathname: 'pages/Profile/VehicleProfile',
                  params: {
                    ...vehicle,
                    image: Image.resolveAssetSource(vehicle.image).uri,
                  },
                })
              }
          >
            <Image source={vehicle.image} style={styles.image} />
            <View style={styles.info}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.brand}>{vehicle.brand}</Text>
              </View>
              <Text style={styles.model}>{vehicle.model}</Text>
              <Text style={styles.year}>{vehicle.year}</Text>
              <Text style={styles.kW}>{vehicle.power}</Text>
            </View>
            
              <Ionicons name="chevron-forward" size={20} color={colors.mainTextColor} />

          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default MyEVsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  appBar: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: colors.background,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    height: 132,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  image: {
    width: 130,
    height: 100,
    resizeMode: 'contain',
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  brand: {
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.mainTextColor,
  },
  model: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.mainTextColor,
    marginTop: 2,
  },
  year: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.secondaryText,
    marginTop: 2,
  },
  kW: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.HighlightText,
    marginTop: 4,
  },
});
