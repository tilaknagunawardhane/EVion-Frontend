import React from 'react';
import { Image } from 'react-native';
import { Marker } from 'react-native-maps';

// Static marker icons - loaded once at module load time
const markerIcons = {
  operational: require('../../assets/markers/charging-station.png'),
  partlyOperational: require('../../assets/markers/ev-marker-partly.png'),
  notOperational: require('../../assets/markers/ev-marker-not-operational.png'),
  default: require('../../assets/markers/charging-station.png'),
};

// Selected state icons (optional - slightly larger versions)
const selectedMarkerIcons = {
  operational: require('../../assets/markers/charging-station.png'),
  partlyOperational: require('../../assets/markers/ev-marker-partly.png'),
  notOperational: require('../../assets/markers/ev-marker-not-operational.png'),
  default: require('../../assets/markers/charging-station.png'),
};

export default function ChargingStationMarker({ station, onPress, isSelected = false }) {
  if (!station) return null;

  const getMarkerIcon = (statusType, selected = false) => {
    const icons = selected ? selectedMarkerIcons : markerIcons;
    
    if (!statusType) return icons.default;
    
    switch (statusType.ID) {
      case 50: // Operational
        return icons.operational;
      case 75: // Partly Operational
        return icons.partlyOperational;
      case 100: // Not Operational
        return icons.notOperational;
      default:
        return icons.default;
    }
  };

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
      icon={getMarkerIcon(station.statusType, isSelected)}
      tracksViewChanges={false} // IMPORTANT: Prevents unnecessary re-renders
    />
  );
}
