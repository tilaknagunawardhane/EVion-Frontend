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
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { Svg, Path, Circle, Rect, G } from 'react-native-svg';
import useUserData from '../../../../hooks/useUserData';
import { API_BASE_URL } from '@env';

// SVG Icons as components
const BackIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const CalendarIcon = () => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="4" width="18" height="18" rx="2" stroke="#6B7280" strokeWidth="2"/>
    <Path d="M16 2V6M8 2V6M3 10H21" stroke="#6B7280" strokeWidth="2" strokeLinecap="round"/>
  </Svg>
);

const ClockIcon = () => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke="#6B7280" strokeWidth="2"/>
    <Path d="M12 6V12L16 14" stroke="#6B7280" strokeWidth="2" strokeLinecap="round"/>
  </Svg>
);

const BoltIcon = () => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="#F59E0B" stroke="#F59E0B" strokeWidth="2" strokeLinejoin="round"/>
  </Svg>
);

const BatteryIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <Rect x="2" y="7" width="18" height="10" rx="2" stroke="#10B981" strokeWidth="2"/>
    <Path d="M20 10H22V14H20" stroke="#10B981" strokeWidth="2"/>
    <Rect x="4" y="9" width="12" height="6" fill="#10B981" rx="1"/>
  </Svg>
);

const colors = {
  background: '#F9FAFB',
  white: '#FFFFFF',
  mainTextColor: '#1A1A1A',
  secondaryText: '#6B7280',
  primary: '#3B82F6',
  success: '#10B981',
  warning: '#F59E0B',
  stroke: '#E5E7EB',
  cardBg: '#FFFFFF',
};

const fonts = {
  PlusJakartaSans: 'PlusJakartaSans-Regular',
  PlusJakartaSansMedium: 'PlusJakartaSans-Medium',
  PlusJakartaSansBold: 'PlusJakartaSans-Bold',
};

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
      if (!user) {
        console.log('⚠️ No user found');
        return;
      }
      try {
        setLoading(true);
        console.log('🔄 Fetching sessions for user:', user._id);
        
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
        
        console.log('✅ Sessions fetched successfully:', data.length, 'sessions');
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

  const formatDateTime = (isoString) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    const dateStr = date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
    const timeStr = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
    return { date: dateStr, time: timeStr };
  };

  const renderSessionCard = ({ item }) => {
    console.log('\n🎴 Rendering card for session:', item.id);
    console.log('Card data:', item);
    
    const startDateTime = formatDateTime(item.start_time);
    const endDateTime = formatDateTime(item.end_time);
    
    return (
      <View style={styles.sessionCard}>
        {/* Status Badge */}
        <View style={styles.statusBadgeTop}>
          <Text style={styles.statusText}>
            {item.status?.toUpperCase() || 'N/A'}
          </Text>
        </View>

        {/* Main Info Section */}
        <View style={styles.mainInfoSection}>
          <Text style={styles.sessionId}>Session ID: {item.id.slice(-8)}</Text>
          
          <View style={styles.infoRow}>
            <CalendarIcon />
            <Text style={styles.infoText}>{startDateTime.date}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <ClockIcon />
            <Text style={styles.infoText}>
              {startDateTime.time} - {endDateTime.time}
            </Text>
          </View>
        </View>

        {/* Energy & Cost Metrics */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricBox}>
            <View style={styles.metricIconContainer}>
              <BoltIcon />
            </View>
            <Text style={styles.metricValue}>
              {item.energy_delivered?.toFixed(2) || '0.00'}
            </Text>
            <Text style={styles.metricLabel}>kWh Delivered</Text>
          </View>

          <View style={styles.metricBox}>
            <View style={styles.metricIconContainer}>
              <Text style={styles.timeIconText}>⏱️</Text>
            </View>
            <Text style={styles.metricValue}>
              {item.duration || 'N/A'}
            </Text>
            <Text style={styles.metricLabel}>Duration</Text>
          </View>

          <View style={styles.metricBox}>
            <View style={styles.metricIconContainer}>
              <Text style={styles.costIconText}>💰</Text>
            </View>
            <Text style={styles.metricValue}>
              {item.total_cost?.toFixed(2) || '0.00'}
            </Text>
            <Text style={styles.metricLabel}>LKR Total</Text>
          </View>
        </View>

        {/* Pricing Info */}
        <View style={styles.pricingSection}>
          <Text style={styles.pricingLabel}>Rate:</Text>
          <Text style={styles.pricingValue}>
            LKR {item.price_per_kwh || 0}/kWh
          </Text>
        </View>

        {/* Payment Status */}
        <View style={styles.paymentSection}>
          <Text style={styles.sectionLabel}>Payment Status</Text>
          <View style={[
            styles.paymentBadge,
            item.payment_status === 'completed' && styles.paymentCompleted,
            item.payment_status === 'pending' && styles.paymentPending,
          ]}>
            <Text style={styles.paymentText}>
              {item.payment_status?.toUpperCase() || 'UNKNOWN'}
            </Text>
          </View>
        </View>

        {/* IDs Section */}
        <View style={styles.idsSection}>
          <View style={styles.idRow}>
            <Text style={styles.idLabel}>Station ID:</Text>
            <Text style={styles.idValue}>{item.station_id?.slice(-8) || 'N/A'}</Text>
          </View>
          <View style={styles.idRow}>
            <Text style={styles.idLabel}>Charger ID:</Text>
            <Text style={styles.idValue}>{item.charger_id?.slice(-8) || 'N/A'}</Text>
          </View>
          <View style={styles.idRow}>
            <Text style={styles.idLabel}>Connector ID:</Text>
            <Text style={styles.idValue}>{item.connector_id?.slice(-8) || 'N/A'}</Text>
          </View>
          {item.transaction_id && (
            <View style={styles.idRow}>
              <Text style={styles.idLabel}>Transaction ID:</Text>
              <Text style={styles.idValue}>{item.transaction_id.slice(-8)}</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  if (loading || userLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading sessions...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleBackPress} 
          activeOpacity={0.7}
        >
          <BackIcon />
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
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No sessions found.</Text>
            <Text style={styles.emptySubtext}>Your charging history will appear here</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.secondaryText,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.stroke,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    textAlign: 'center',
    flex: 1,
  },
  placeholder: {
    width: 40,
  },
  listContainer: {
    padding: 16,
  },
  sessionCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: colors.stroke,
  },
  statusBadgeTop: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: colors.success,
  },
  statusText: {
    fontSize: 11,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.white,
    letterSpacing: 0.5,
  },
  mainInfoSection: {
    marginBottom: 20,
    paddingRight: 80,
  },
  sessionId: {
    fontSize: 12,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.secondaryText,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.mainTextColor,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  metricBox: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.stroke,
  },
  metricIconContainer: {
    marginBottom: 8,
  },
  timeIconText: {
    fontSize: 20,
  },
  costIconText: {
    fontSize: 20,
  },
  metricValue: {
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 11,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
    textAlign: 'center',
  },
  pricingSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primary + '10',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  pricingLabel: {
    fontSize: 13,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.mainTextColor,
  },
  pricingValue: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.primary,
  },
  paymentSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 13,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.mainTextColor,
  },
  paymentBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  paymentCompleted: {
    backgroundColor: colors.success + '20',
  },
  paymentPending: {
    backgroundColor: colors.warning + '20',
  },
  paymentText: {
    fontSize: 12,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.success,
  },
  idsSection: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  idRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  idLabel: {
    fontSize: 12,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
  },
  idValue: {
    fontSize: 12,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.mainTextColor,
    fontVariant: ['tabular-nums'],
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.mainTextColor,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
  },
});

export default SessionHistory;