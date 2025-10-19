import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import colors from '../../../../constants/color';
import fonts from '../../../../constants/fonts';
import useUserData from '../../../../hooks/useUserData';
import { API_BASE_URL } from '@env';

const SessionHistory = () => {
  const { user, isLoading: userLoading } = useUserData();
  const [sessionData, setSessionData] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleBackPress = () => {
    router.back();
  };

  // Fetch sessions from backend
  useEffect(() => {
    const fetchSessions = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/charging-sessions/user`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ev_owner_id: user._id }),
          }
        );

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setSessionData(data);
      } catch (error) {
        console.error('❌ Error fetching sessions:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!userLoading) {
      fetchSessions();
    }
  }, [user, userLoading]);

  const renderSessionCard = ({ item }) => (
  <View style={styles.sessionCard}>
    {/* Existing Header */}
    <View style={styles.sessionHeader}>
      <View style={styles.stationInfo}>
        <Text style={styles.stationName}>{item.stationName}</Text>
        <Text style={styles.stationAddress}>{item.stationAddress}</Text>
      </View>
      <View style={styles.statusBadge}>
        <Text style={styles.statusText}>{item.status}</Text>
      </View>
    </View>

    {/* Existing Details */}
    <View style={styles.sessionDetails}>
      <View style={styles.detailRow}>
        <Text style={styles.detailText}>📅 {item.date}</Text>
        <Text style={styles.detailText}>⏰ {item.time}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailText}>🚗 {item.vehicle}</Text>
        <Text style={styles.detailText}>⚡ {item.connector}</Text>
      </View>
    </View>

    {/* Metrics */}
    <View style={styles.metricsContainer}>
      <View style={styles.metricItem}>
        <Text style={styles.metricValue}>{item.duration}</Text>
        <Text style={styles.metricLabel}>Duration</Text>
      </View>
      <View style={styles.metricItem}>
        <Text style={styles.metricValue}>{item.energy_delivered?.toFixed(2)} kWh</Text>
        <Text style={styles.metricLabel}>Energy Delivered</Text>
      </View>
      <View style={styles.metricItem}>
        <Text style={styles.metricValue}>LKR {item.total_cost?.toFixed(2)}</Text>
        <Text style={styles.metricLabel}>Cost</Text>
      </View>
    </View>

    {/* Payment Status */}
    <View style={[styles.statusBadge, { alignSelf: 'flex-start', marginBottom: 12 }]}>
      <Text style={styles.statusText}>{item.payment_status}</Text>
    </View>

    {/* Start & End Times */}
    <View style={styles.detailRow}>
      <Text style={styles.detailText}>Start: {new Date(item.start_time).toLocaleTimeString()}</Text>
      <Text style={styles.detailText}>End: {item.end_time ? new Date(item.end_time).toLocaleTimeString() : '-'}</Text>
    </View>

    {/* Optional battery info */}
    {item.batteryStart != null && item.batteryEnd != null && (
      <View style={styles.batteryContainer}>
        <Text style={styles.batteryLabel}>
          Battery: {item.batteryStart}% → {item.batteryEnd}%
        </Text>
        <Text style={styles.chargingSpeedText}>{item.chargingSpeed}</Text>
      </View>
    )}
  </View>
);


  if (loading || userLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color={colors.mainTextColor} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Session History</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Session List */}
      <FlatList
        data={sessionData}
        renderItem={renderSessionCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>No sessions found.</Text>}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.stroke,
  },
  backButton: { padding: 8, marginLeft: -8 },
  headerTitle: {
    fontSize: 18,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.mainTextColor,
    textAlign: 'center',
    flex: 1,
  },
  placeholder: { width: 40 },
  listContainer: { padding: 16 },
  sessionCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sessionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  stationInfo: { flex: 1, marginRight: 12 },
  stationName: { fontSize: 16, fontFamily: fonts.PlusJakartaSansBold, color: colors.mainTextColor, marginBottom: 4 },
  stationAddress: { fontSize: 12, fontFamily: fonts.PlusJakartaSans, color: colors.secondaryText },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: colors.success + '15' },
  statusText: { fontSize: 12, fontFamily: fonts.PlusJakartaSansBold, color: colors.success },
  sessionDetails: { marginBottom: 16 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  detailText: { fontSize: 12, fontFamily: fonts.PlusJakartaSans, color: colors.secondaryText, flex: 1 },
  metricsContainer: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: colors.primary + '08', borderRadius: 12, padding: 12, marginBottom: 16 },
  metricItem: { alignItems: 'center', flex: 1 },
  metricValue: { fontSize: 16, fontFamily: fonts.PlusJakartaSansBold, color: colors.primary, marginBottom: 4 },
  metricLabel: { fontSize: 10, fontFamily: fonts.PlusJakartaSans, color: colors.secondaryText, textAlign: 'center' },
  batteryContainer: { backgroundColor: colors.secondary + '08', borderRadius: 12, padding: 12, alignItems: 'center' },
  batteryLabel: { fontSize: 14, fontFamily: fonts.PlusJakartaSansMedium, color: colors.mainTextColor, marginBottom: 4 },
  chargingSpeedText: { fontSize: 12, fontFamily: fonts.PlusJakartaSans, color: colors.secondaryText },
});

export default SessionHistory;
