import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../../constants/color';

export default function ChargingStationMarker({ station, onPress, isSelected = false }) {
  if (!station) return null;

  const getMarkerColor = (statusType) => {
    if (!statusType) return colors.primary;
    switch (statusType.ID) {
      case 50: // Operational
        return '#4CAF50';
      case 75: // Partly Operational
        return '#FF9800';
      case 100: // Not Operational
        return '#F44336';
      default:
        return colors.primary;
    }
  };

  const markerColor = getMarkerColor(station.statusType);

  return (
    <Marker
      coordinate={{
        latitude: station.latitude,
        longitude: station.longitude,
      }}
      title={station.title}
      description={station.description}
      onPress={onPress}
      anchor={{ x: 0.5, y: 1 }}
    >
      <View style={[
        styles.markerContainer,
        isSelected && styles.selectedMarkerContainer
      ]}>
        <View style={[
          styles.markerInner,
          { backgroundColor: markerColor },
          isSelected && styles.selectedMarkerInner
        ]}>
          <MaterialIcons 
            name="ev-station" 
            size={isSelected ? 28 : 24} 
            color="#fff" 
          />
        </View>
        <View style={[
          styles.markerTail,
          { backgroundColor: markerColor }
        ]} />
        
        {/* Selection ring */}
        {isSelected && (
          <View style={[
            styles.selectionRing,
            { borderColor: markerColor }
          ]} />
        )}
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedMarkerContainer: {
    // Additional styles for selected state if needed
  },
  markerInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  selectedMarkerInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    elevation: 8,
    shadowOpacity: 0.35,
  },
  markerTail: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 12,
    borderRightWidth: 8,
    borderBottomWidth: 0,
    borderLeftWidth: 8,
    borderTopColor: colors.primary,
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
    marginTop: -2,
  },
  selectionRing: {
    position: 'absolute',
    top: -6,
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: colors.primary,
    opacity: 0.7,
  },
});