import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import colors from '../../../constants/color';
import fonts from '../../../constants/fonts';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';

const vehicles = [
  {
    id: 1,
    name: 'BYD Atto 3 (SUV)',
    year: 2022,
    battery: '60.48kWh',
    charging: '80 kW DC Fast Charging',
    image: require('../../../assets/vehicles/atto3.png'), // replace with real image
    connectors: ['Type 2 (Mennekes)', 'CHAdeMO'],
  },
  {
    id: 2,
    name: 'Hyundai Kona Electric (SUV)',
    year: 2022,
    battery: '64kWh',
    charging: '80 kW DC Fast Charging',
    image: require('../../../assets/vehicles/atto3.png'),
    connectors: ['Type 2 (Mennekes)', 'CCS Combo Type 2'],
  },
];

const SelectVehicle = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header Bar */}
      <View style={styles.topBar} />

      <Text style={styles.title}>Select Vehicle</Text>

      <ScrollView contentContainerStyle={styles.scroll}>
        {vehicles.map((item) => (
          <View key={item.id} style={styles.card}>
            <Image source={item.image} style={styles.image} />
            <View style={styles.content}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.detail}>{item.year}</Text>
              <Text style={styles.detail}>
                Battery Capacity: {item.battery}
              </Text>
              <Text style={styles.detail}>Charging Speed: {item.charging}</Text>
              <View style={styles.chipRow}>
                {item.connectors.map((c, i) => (
                  <View key={i} style={styles.chip}>
                    <MaterialCommunityIcons
                      name="power-plug"
                      size={14}
                      color={colors.black}
                    />
                    <Text style={styles.chipText}>{c}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Add New + Select */}
      <TouchableOpacity>
        <Text style={styles.addNew}>Add New Vehicle</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.selectBtn} disabled>
        <Text style={styles.selectText}>Select</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SelectVehicle;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  topBar: {
    alignSelf: 'center',
    width: 50,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },
  title: {
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.mainTextColor,
    textAlign: 'center',
    marginBottom: 12,
  },
  scroll: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  image: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginRight: 12,
    borderRadius: 10,
    backgroundColor: colors.lightestGray,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.mainTextColor,
  },
  detail: {
    fontSize: 12,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightestGray,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    marginRight: 8,
    marginTop: 4,
  },
  chipText: {
    marginLeft: 4,
    fontSize: 11,
    color: colors.black,
    fontFamily: fonts.PlusJakartaSans,
  },
  addNew: {
    textAlign: 'center',
    color: colors.primary,
    fontFamily: fonts.PlusJakartaSansMedium,
    fontSize: 14,
    paddingVertical: 8,
  },
  selectBtn: {
    backgroundColor: colors.lightestGray,
    margin: 16,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectText: {
    fontFamily: fonts.PlusJakartaSansMedium,
    fontSize: 15,
    color: colors.secondaryText,
  },
});
