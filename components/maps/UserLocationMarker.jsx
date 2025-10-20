import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';
import Svg, { Path } from 'react-native-svg';
import colors from '../../constants/color';

// Custom Person Pin Icon
function PersonPinIcon({ size = 24, color = '#fff' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2C8.14 2 5 5.14 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.14 15.86 2 12 2ZM12 4C13.1 4 14 4.9 14 6C14 7.11 13.1 8 12 8C10.9 8 10 7.11 10 6C10 4.9 10.9 4 12 4ZM12 14C10.33 14 8.86 13.15 8 11.85C8.03 10.49 10.67 9.75 12 9.75C13.32 9.75 15.97 10.49 16 11.85C15.14 13.15 13.67 14 12 14Z"
        fill={color}
      />
    </Svg>
  );
}

export default function UserLocationMarker({ location }) {
  if (!location) return null;

  return (
    <Marker
      coordinate={{
        latitude: location.latitude,
        longitude: location.longitude,
      }}
      title="Your Location"
      description="You are here"
      anchor={{ x: 0.5, y: 0.5 }}
    >
      <View style={styles.markerContainer}>
        <View style={styles.markerInner}>
          <PersonPinIcon size={24} color="#fff" />
        </View>
        <View style={styles.markerPulse} />
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.danger,
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
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  markerPulse: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    opacity: 0.2,
    borderWidth: 2,
    borderColor: colors.primary,
  },
});