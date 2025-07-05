// components/maps/StationInfoCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../../constants/color';

const StationInfoCard = ({ station, onClose, onNavigate }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <MaterialIcons name="close" size={24} color={colors.gray} />
      </TouchableOpacity>
      
      <Text style={styles.title}>{station.title}</Text>
      <Text style={styles.description}>{station.description}</Text>
      <Text style={styles.address}>{station.address}</Text>
      
      <TouchableOpacity 
        style={styles.navigateButton}
        onPress={() => onNavigate(station)}
      >
        <Text style={styles.navigateButtonText}>Get Directions</Text>
        <MaterialIcons name="directions" size={20} color={colors.white} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 60,
    left: 20,
    right: 20,
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    elevation: 5,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.1)',
    zIndex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: colors.black,
  },
  description: {
    fontSize: 14,
    color: colors.darkGray,
    marginBottom: 8,
  },
  address: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 16,
  },
  navigateButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navigateButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    marginRight: 8,
  },
});

export default StationInfoCard;