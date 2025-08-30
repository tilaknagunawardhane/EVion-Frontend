import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Linking,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../../constants/color';
import { getDistanceFromLatLonInKm } from '../../utils/mapUtils';

export default function StationDetailsModal({
  station,
  userLocation,
  onClose,
  isVisible,
}) {
  if (!station) return null;

  const distance = userLocation 
    ? getDistanceFromLatLonInKm(
        userLocation.latitude,
        userLocation.longitude,
        station.latitude,
        station.longitude
      ).toFixed(2)
    : null;

  const handleGetDirections = () => {
    const scheme = Platform.select({
      ios: 'maps:0,0?q=',
      android: 'geo:0,0?q=',
    });
    const latLng = `${station.latitude},${station.longitude}`;
    const label = station.title;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    Linking.openURL(url).catch(() => {
      // Fallback to Google Maps web
      Linking.openURL(
        `https://www.google.com/maps/search/?api=1&query=${latLng}`
      );
    });
  };

  const handleCall = () => {
    if (station.phone) {
      Linking.openURL(`tel:${station.phone}`);
    }
  };

  const handleWebsite = () => {
    if (station.website) {
      Linking.openURL(station.website);
    }
  };

  const getStatusColor = (statusType) => {
    if (!statusType) return colors.gray;
    switch (statusType.ID) {
      case 50: // Operational
        return '#4CAF50';
      case 75: // Partly Operational
        return '#FF9800';
      case 100: // Not Operational
        return '#F44336';
      default:
        return colors.gray;
    }
  };

  const getConnectionTypeInfo = (connections) => {
    if (!connections || connections.length === 0) return 'No connection info';
    
    return connections.map(conn => {
      const type = conn.ConnectionType?.Title || 'Unknown';
      const level = conn.Level?.Title || '';
      return level ? `${type} (${level})` : type;
    }).join(', ');
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <MaterialIcons 
                name="ev-station" 
                size={24} 
                color={colors.primary}
              />
              <Text style={styles.title} numberOfLines={2}>
                {station.title}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color={colors.gray} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Status */}
            {station.statusType && (
              <View style={styles.infoRow}>
                <MaterialIcons name="info" size={20} color={colors.gray} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Status</Text>
                  <View style={styles.statusContainer}>
                    <View 
                      style={[
                        styles.statusDot, 
                        { backgroundColor: getStatusColor(station.statusType) }
                      ]} 
                    />
                    <Text style={styles.infoValue}>
                      {station.statusType.Title}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* Address */}
            <View style={styles.infoRow}>
              <MaterialIcons name="location-on" size={20} color={colors.gray} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Address</Text>
                <Text style={styles.infoValue}>{station.address}</Text>
              </View>
            </View>

            {/* Distance */}
            {distance && (
              <View style={styles.infoRow}>
                <MaterialIcons name="straighten" size={20} color={colors.gray} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Distance</Text>
                  <Text style={styles.infoValue}>{distance} km away</Text>
                </View>
              </View>
            )}

            {/* Number of Charging Points */}
            {station.numberOfPoints && (
              <View style={styles.infoRow}>
                <MaterialIcons name="electrical-services" size={20} color={colors.gray} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Charging Points</Text>
                  <Text style={styles.infoValue}>{station.numberOfPoints} points</Text>
                </View>
              </View>
            )}

            {/* Connection Types */}
            {station.connections && station.connections.length > 0 && (
              <View style={styles.infoRow}>
                <MaterialIcons name="power" size={20} color={colors.gray} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Connection Types</Text>
                  <Text style={styles.infoValue}>
                    {getConnectionTypeInfo(station.connections)}
                  </Text>
                </View>
              </View>
            )}

            {/* Operator */}
            {station.operatorInfo && (
              <View style={styles.infoRow}>
                <MaterialIcons name="business" size={20} color={colors.gray} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Operator</Text>
                  <Text style={styles.infoValue}>{station.operatorInfo.Title}</Text>
                </View>
              </View>
            )}

            {/* Usage Type */}
            {station.usageType && (
              <View style={styles.infoRow}>
                <MaterialIcons name="accessibility" size={20} color={colors.gray} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Access</Text>
                  <Text style={styles.infoValue}>{station.usageType.Title}</Text>
                </View>
              </View>
            )}

            {/* Contact Info */}
            {station.phone && (
              <TouchableOpacity style={styles.infoRow} onPress={handleCall}>
                <MaterialIcons name="phone" size={20} color={colors.primary} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Phone</Text>
                  <Text style={[styles.infoValue, styles.linkText]}>
                    {station.phone}
                  </Text>
                </View>
              </TouchableOpacity>
            )}

            {station.website && (
              <TouchableOpacity style={styles.infoRow} onPress={handleWebsite}>
                <MaterialIcons name="language" size={20} color={colors.primary} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Website</Text>
                  <Text style={[styles.infoValue, styles.linkText]}>
                    Visit website
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.directionsButton]}
              onPress={handleGetDirections}
            >
              <MaterialIcons name="directions" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Get Directions</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black,
    marginLeft: 12,
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  infoContent: {
    marginLeft: 16,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: colors.black,
    lineHeight: 22,
  },
  linkText: {
    color: colors.primary,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  actionButtons: {
    padding: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginBottom: 8,
  },
  directionsButton: {
    backgroundColor: colors.primary,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
});