import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, Easing, PanResponder, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import colors from '../../constants/color';
import fonts from '../../constants/fonts';
import CircularProgress from '../../components/CircularProgress';
import ChargingInfoCard from '../../components/ChargingInfoCard';
import { API_BASE_URL } from '@env';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const POLL_INTERVAL = 3000; // Poll every 3 seconds
const batteryCapacity = 77; 

// Custom Arrow Icons
function ArrowForwardIcon({ size = 24, color = 'white' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z"
        fill={color}
      />
    </Svg>
  );
}

function ArrowBackIcon({ size = 24, color = 'white' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z"
        fill={color}
      />
    </Svg>
  );
}

const StartChargeWalkInScreen = () => {
  const router = useRouter();
  const { connectorId, userId } = useLocalSearchParams();

  const [chargingData, setChargingData] = useState({
    totalEnergy: 0, // total kWh delivered
    chargingPower: '0 kW',
    chargingTime: '00:00:00',
    cost: '0.00',
  });

  const [isCharging, setIsCharging] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState('right');
  const vehicleName = 'Kia EV6';

  // 🔘 Poll charging data when charging is active
  useEffect(() => {
    let interval;
    if (isCharging && connectorId && userId) {
      interval = setInterval(async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/api/ocpp/data?connectorId=${connectorId}`);
          const text = await response.text();
          let data;
          try {
            data = JSON.parse(text);
          } catch {
            console.error('❌ Invalid JSON response:', text);
            return;
          }

          setChargingData({
            totalEnergy: parseFloat(data.totalEnergy || 0).toFixed(2),// ⚡ total energy in kWh
            chargingPower: `${parseFloat(data.power || 0).toFixed(2)} kW`,
            chargingTime: new Date((data.timeElapsed || 0) * 1000).toISOString().substr(11, 8),
            cost: parseFloat(data.cost || 0).toFixed(2),
          });
        } catch (err) {
          console.error('Error fetching charging status:', err);
        }
      }, POLL_INTERVAL);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCharging, connectorId, userId]);

  // 🔘 Swipe handler to start/stop charging
  const handleSwipeComplete = async (direction) => {
    if (!connectorId || !userId) return console.warn('⚠️ Missing IDs for charging request.');

    if (direction === 'right') {
      setIsCharging(true);
      setSwipeDirection('left');

      try {
        const response = await fetch(`${API_BASE_URL}/api/ocpp/start`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ connectorId, ev_owner_id: userId }),
        });
        const data = await response.json();
        console.log('OCPP start response:', data);
      } catch (err) {
        console.error('Error starting OCPP server:', err);
      }

    } else {
      setIsCharging(false);
      setSwipeDirection('right');

      try {
        const response = await fetch(`${API_BASE_URL}/api/ocpp/stop`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ connectorId, ev_owner_id: userId }),
        });
        const data = await response.json();
        console.log('OCPP stop response:', data);

        // 🔹 Show alert AFTER data is received
        Alert.alert(
          'Charging Stopped',
          'Your charging session has been ended.',
          [
            {
              text: 'View Summary',
              onPress: () =>
                router.push({
                  pathname: '/pages/bookings/ReceiptScreen',
                  params: {
                    stationName: data.station_name,
                    message: data.message,
                    startTime: data.start_time,
                    endTime: data.end_time,
                    date: data.date,
                    totalEnergy: data.total_energy_kwh,
                    costPerKwh: data.cost_per_kwh,
                    totalCost: data.total_cost,
                    durationMinutes: data.duration_minutes,
                  },
                }),
            },
            { text: 'OK', style: 'cancel' },
          ],
          { cancelable: false }
        );

      } catch (err) {
        console.error('Error stopping OCPP server:', err);
      }
    }
  };

  const chargingInfoItems = [
    { icon: 'flash', label: 'Charging Power', value: chargingData.chargingPower },
    { icon: 'time', label: 'Charging Time', value: chargingData.chargingTime },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ width: SCREEN_WIDTH * 0.08 }} />
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>{vehicleName}</Text>
          <Text style={styles.headerSubtitle}>{isCharging ? 'Charging' : 'Ready to charge'}</Text>
        </View>
        <View style={{ width: SCREEN_WIDTH * 0.08 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.batteryContainer}>
          <CircularProgress
            percentage={(chargingData.totalEnergy / batteryCapacity) * 100}
            size={SCREEN_WIDTH * 0.5}
            additionalText={`${chargingData.totalEnergy} kWh`} // show total power
            strokeWidth={12}
            activeColor={isCharging ? colors.primary : colors.secondaryText}
          />
          <Text style={styles.batteryStatus}>{isCharging ? 'Charging...' : 'Charging not started'}</Text>
        </View>

        <ChargingInfoCard items={chargingInfoItems} />

        <View style={styles.costContainer}>
          <Text style={styles.costLabel}>Estimated Cost</Text>
          <Text style={styles.costText}>
            <Text style={styles.currencyText}>LKR </Text>
            {chargingData.cost}
          </Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <SwipeButton direction={swipeDirection} isCharging={isCharging} onSwipeComplete={handleSwipeComplete} />
      </View>
    </View>
  );
};

// ⚙️ Swipe Button Component
const SwipeButton = ({ direction, isCharging, onSwipeComplete }) => {
  const buttonWidth = SCREEN_WIDTH * 0.8;
  const thumbWidth = SCREEN_HEIGHT * 0.08;
  const pan = useRef(new Animated.Value(isCharging ? buttonWidth - thumbWidth - 10 : 0)).current;
  const currentDirectionRef = useRef(direction);

  useEffect(() => {
    currentDirectionRef.current = direction;
    pan.setValue(direction === 'right' ? 0 : buttonWidth - thumbWidth - 10);
  }, [direction, buttonWidth, thumbWidth]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const currentDirection = currentDirectionRef.current;
        if (currentDirection === 'right' && gestureState.dx >= 0) {
          pan.setValue(Math.min(gestureState.dx, buttonWidth - thumbWidth - 10));
        } else if (currentDirection === 'left' && gestureState.dx <= 0) {
          pan.setValue(Math.max(buttonWidth - thumbWidth - 10 + gestureState.dx, 0));
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const currentDirection = currentDirectionRef.current;
        if (currentDirection === 'right' && gestureState.dx > 50) {
          Animated.timing(pan, {
            toValue: buttonWidth - thumbWidth - 10,
            duration: 200,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }).start(() => onSwipeComplete('right'));
        } else if (currentDirection === 'left' && gestureState.dx < -50) {
          Animated.timing(pan, {
            toValue: 0,
            duration: 200,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }).start(() => onSwipeComplete('left'));
        } else {
          Animated.spring(pan, {
            toValue: currentDirection === 'right' ? 0 : buttonWidth - thumbWidth - 10,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <View style={[styles.swipeContainer, { width: buttonWidth }]}>
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.swipeThumb,
          { transform: [{ translateX: pan }], width: thumbWidth, height: thumbWidth, borderRadius: thumbWidth / 2 },
        ]}
      >
        {direction === 'right' ? (
          <ArrowForwardIcon size={24} color="white" />
        ) : (
          <ArrowBackIcon size={24} color="white" />
        )}
      </Animated.View>
      <Text style={styles.swipeText}>{direction === 'right' ? 'Swipe to start charging' : 'Swipe to stop charging'}</Text>
    </View>
  );
};

const HEADER_HEIGHT = SCREEN_HEIGHT * 0.2;
const BUTTON_PADDING = SCREEN_HEIGHT * 0.05;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: SCREEN_WIDTH * 0.06 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: HEADER_HEIGHT, marginBottom: SCREEN_HEIGHT * 0.02 },
  headerTitleContainer: { alignItems: 'center' },
  headerTitle: { fontSize: SCREEN_WIDTH * 0.05, fontFamily: fonts.PlusJakartaSansBold, color: colors.mainTextColor },
  headerSubtitle: { fontSize: SCREEN_WIDTH * 0.035, fontFamily: fonts.PlusJakartaSans, color: colors.secondaryText, marginTop: 4 },
  content: { flex: 1, justifyContent: 'center' },
  batteryContainer: { alignItems: 'center', marginBottom: SCREEN_HEIGHT * 0.05 },
  batteryStatus: { fontSize: SCREEN_WIDTH * 0.035, fontFamily: fonts.PlusJakartaSans, color: colors.secondaryText, marginTop: 16 },
  costContainer: { alignItems: 'center', marginVertical: SCREEN_HEIGHT * 0.04 },
  costLabel: { fontSize: SCREEN_WIDTH * 0.035, fontFamily: fonts.PlusJakartaSans, color: colors.secondaryText, marginBottom: 8 },
  costText: { fontSize: SCREEN_WIDTH * 0.08, fontFamily: fonts.PlusJakartaSansBold, color: colors.mainTextColor },
  currencyText: { fontSize: SCREEN_WIDTH * 0.04, fontFamily: fonts.PlusJakartaSans, color: colors.secondaryText },
  buttonContainer: { paddingBottom: BUTTON_PADDING, alignItems: 'center' },
  swipeContainer: { height: SCREEN_HEIGHT * 0.08, backgroundColor: '#E9F7F4', borderRadius: SCREEN_HEIGHT * 0.04, justifyContent: 'center', paddingHorizontal: 10 },
  swipeThumb: { backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', position: 'absolute', left: 5, zIndex: 10 },
  swipeText: { color: colors.secondaryText, fontFamily: fonts.PlusJakartaSansMedium, fontSize: SCREEN_WIDTH * 0.035, textAlign: 'center' },
});

export default StartChargeWalkInScreen;