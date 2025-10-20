import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';
import Svg, { Path } from 'react-native-svg';
import colors from '../../constants/color';

// Custom EV Station Icon Component
function EVStationIcon({ size = 24, color = '#fff' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M16.41 4H6V20H16V8.41L16.41 4ZM14 20H8V6H14V20ZM19.5 3.5L17.5 5.5V13C17.5 13.83 18.17 14.5 19 14.5C19.83 14.5 20.5 13.83 20.5 13V5L19.5 3.5ZM10 18H12V14H10V18ZM10 12H12V8H10V12Z"
        fill={color}
      />
    </Svg>
  );
}

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
          <EVStationIcon 
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