import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../../constants/color';

export default function ChargingStationMarker({ station, onPress, isSelected = false }) {
  if (!station) return null;

  const getMarkerColor = (statusType) => {
    if (!statusType || !statusType.ID) return colors.primary;
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
  const iconSize = isSelected ? 24 : 20;
  const markerSize = isSelected ? 44 : 36;

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
      tracksViewChanges={false}
    >
      <View style={styles.markerContainer}>
        {/* Selection ring */}
        {isSelected && (
          <View style={[
            styles.selectionRing,
            { 
              borderColor: markerColor,
              width: markerSize + 16,
              height: markerSize + 16,
              borderRadius: (markerSize + 16) / 2,
            }
          ]} />
        )}
        
        {/* Main marker circle */}
        <View style={[
          styles.markerInner,
          { 
            backgroundColor: markerColor,
            width: markerSize,
            height: markerSize,
            borderRadius: markerSize / 2,
          }
        ]}>
          <MaterialIcons 
            name="ev-station" 
            size={iconSize} 
            color="#fff" 
          />
        </View>
        
        {/* Triangle tail */}
        <View style={[
          styles.markerTail,
          { 
            borderTopColor: markerColor,
            borderTopWidth: isSelected ? 12 : 10,
            borderRightWidth: isSelected ? 7 : 6,
            borderLeftWidth: isSelected ? 7 : 6,
          }
        ]} />
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerInner: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    zIndex: 2,
  },
  markerTail: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderRightColor: 'transparent',
    borderBottomWidth: 0,
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
    marginTop: -2,
    zIndex: 1,
  },
  selectionRing: {
    position: 'absolute',
    top: -8,
    borderWidth: 3,
    opacity: 0.6,
    zIndex: 0,
  },
});