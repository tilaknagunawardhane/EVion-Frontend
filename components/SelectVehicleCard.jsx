import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import colors from '../constants/color';
import fonts from '../constants/fonts';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import dolphine from '../assets/vehicles/dolphin.png'
import ccs1 from '../assets/connectors/ccs1.png';
import ccs2 from '../assets/connectors/ccs2.png';
import type2 from '../assets/connectors/type2.png';

const connectorImages = {
  'connectors/type2.png': type2,
  'connectors/ccs1.png': ccs1,
  'connectors/ccs2.png': ccs2,
};

const vehicleImages = {
  'vehicles/dolphine.png' : dolphine,
}

const VehicleCard = ({ vehicle, selected }) => {
  return (
    <View style={[styles.card, selected && styles.selectedCard]}>
      <View style={styles.topRow}>
        <Image source={vehicleImages[vehicle.image]} style={styles.image} />
        <View style={styles.textContainer}>
          <Text style={styles.name}>{vehicle.make.make} {vehicle.model.model}</Text>
          <Text style={styles.year}>{vehicle.manufactured_year}</Text>
          <Text style={styles.details}>Battery Capacity: {vehicle.battery_capacity}</Text>
          <Text style={styles.details}>Charging Power DC: {vehicle.max_power_DC}</Text>
          <Text style={styles.details}>Charging Power AC: {vehicle.max_power_AC}</Text>
        </View>
      </View> 

      <View style={styles.divider} />

      <View style={styles.portRow}>
        {[vehicle.connector_type_AC, vehicle.connector_type_DC].map((port, index) => (
          <View key={index} style={styles.portItem}>
            {port?.image && (
              <Image
                 source={connectorImages[port.image]}
                style={styles.portIcon}
              />
            )}
            <Text style={styles.portLabel}>{port?.type_name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default VehicleCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  selectedCard: {
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontFamily: fonts.PlusJakartaSansSemiBold,
    color: colors.mainTextColor,
  },
  year: {
    fontSize: 13,
    color: colors.secondaryText,
  },
  details: {
    fontSize: 13,
    color: colors.secondaryText,
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: colors.lightestGray,
    marginVertical: 10,
  },
  portRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  portItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  portLabel: {
    marginLeft: 4,
    fontSize: 12,
    color: colors.mainTextColor,
    alignItems: 'center',
  },
  portIcon: {
    width: 30,
    height: 30,
    borderRadius: 5,
    marginRight: 5,
  },
});
