import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function BookingDetails() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.time}>9:30</Text>
      </View>

      <Text style={styles.title}>Booking Details</Text>

      <View style={styles.stationCard}>
        <Image
          source={{ uri: 'https://i.imgur.com/EZf5GQh.jpg' }} // Placeholder image
          style={styles.stationImage}
        />
        <View style={styles.stationInfo}>
          <Text style={styles.stationName}>Genso Charging Station</Text>
          <Text style={styles.stationLocation}>Southern Highway, Welipenna, Matugama</Text>
        </View>
        <Ionicons name="arrow-forward" size={24} color="green" style={styles.stationArrow} />
      </View>

      <View style={styles.datetimeRow}>
        <Text style={styles.dateText}>Jun 11, 2025</Text>
        <View style={styles.durationBox}>
          <Text style={styles.durationText}>1Hr 30 Mins</Text>
        </View>
        <Text style={styles.timeText}>9:30 AM</Text>
      </View>

      <View style={styles.connectorInfoBox}>
        <View style={styles.connectorRow}>
          <Text style={styles.connectorLabel}>Connector Type:</Text>
          <Text style={styles.connectorValue}>CCS 2</Text>
        </View>
        <View style={styles.connectorRow}>
          <Text style={styles.connectorLabel}>Power Output</Text>
          <Text style={styles.connectorValue}>50kW</Text>
        </View>
        <View style={styles.connectorRow}>
          <Text style={styles.connectorLabel}>Charging Speed</Text>
          <Text style={styles.connectorValue}>DC Fast Charging</Text>
        </View>
        <View style={styles.connectorRow}>
          <Text style={styles.connectorLabel}>Price per kWh</Text>
          <Text style={styles.connectorValue}>LKR 55.00</Text>
        </View>
      </View>

      <View style={styles.summaryBox}>
        <Text style={styles.summaryText}>Estimated Energy Delivered:</Text>
        <Text style={styles.summaryValue}>75kWh</Text>

        <Text style={styles.summaryText}>Estimated Battery % Increase:</Text>
        <Text style={styles.summaryValue}>+40%</Text>

        <Text style={styles.summaryText}>Estimated Cost:</Text>
        <Text style={styles.estimatedCost}>LKR 4125</Text>
      </View>

      <TouchableOpacity style={styles.startButton}>
        <Text style={styles.startButtonText}>Start Charging</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton}>
        <Text style={styles.secondaryButtonText}>Reschedule</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton}>
        <Text style={styles.cancelButtonText}>Cancel Booking</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  header: {
    paddingTop: 40,
    alignItems: 'center',
  },
  time: {
    fontSize: 16,
    color: '#333',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 10,
  },
  stationCard: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#0abf53',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  stationImage: {
    width: 60,
    height: 60,
    borderRadius: 6,
  },
  stationInfo: {
    flex: 1,
    marginLeft: 10,
  },
  stationName: {
    fontSize: 16,
    fontWeight: '600',
  },
  stationLocation: {
    fontSize: 12,
    color: '#666',
  },
  stationArrow: {
    marginLeft: 10,
  },
  datetimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
  },
  dateText: {
    fontSize: 14,
  },
  durationBox: {
    backgroundColor: '#fff6e5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },
  durationText: {
    color: '#e49f00',
    fontSize: 12,
  },
  timeText: {
    fontSize: 14,
  },
  connectorInfoBox: {
    borderWidth: 1,
    borderColor: '#eee',
    padding: 12,
    marginTop: 16,
    borderRadius: 8,
  },
  connectorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  connectorLabel: {
    fontSize: 14,
    color: '#444',
  },
  connectorValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  summaryBox: {
    marginTop: 16,
    marginBottom: 24,
  },
  summaryText: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  estimatedCost: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },
  startButton: {
    backgroundColor: '#0abf53',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  startButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#e8f0ec',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  secondaryButtonText: {
    color: '#0abf53',
    fontWeight: '600',
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  cancelButtonText: {
    color: '#e63946',
    fontWeight: '600',
  },
});