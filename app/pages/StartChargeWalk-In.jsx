import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  Easing,
  PanResponder,
  Alert 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/color';
import fonts from '../../constants/fonts';
import CircularProgress from '../../components/CircularProgress';
import ChargingInfoCard from '../../components/ChargingInfoCard';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const StartChargeWalkInScreen = () => {
  const router = useRouter();

  const [chargingData, setChargingData] = useState({
    batteryPercentage: 17,
    chargingPower: '0 kW',
    chargingTime: '00:00:00',
    cost: '00.00'
  });

  const [isCharging, setIsCharging] = useState(false);
  const vehicleName = 'Kia EV6';
  const [seconds, setSeconds] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState('right'); // 'right' or 'left'

  useEffect(() => {
    let interval;
    if (isCharging) {
      interval = setInterval(() => {
        setSeconds(prev => {
          const newSeconds = prev + 1;
          const hours = Math.floor(newSeconds / 3600);
          const minutes = Math.floor((newSeconds % 3600) / 60);
          const secs = newSeconds % 60;

          setChargingData(prev => ({
            batteryPercentage: Math.min(prev.batteryPercentage + (100 / 3600), 100),
            chargingPower: `${Math.floor(Math.random() * 5) + 5} kW`,
            chargingTime: `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`,
            cost: (parseFloat(prev.cost) + (100 / 3600)).toFixed(2)
          }));

          return newSeconds;
        });
      }, 900);
    } else {
      // Reset timer when charging stops
      setSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isCharging]);

  const handleSwipeComplete = (direction) => {
    console.log('handleSwipeComplete called with direction:', direction);
    if (direction === 'right') {
      console.log('Starting charging...');
      setIsCharging(true);
      setSwipeDirection('left');
    } else {
      console.log('Stopping charging...');
      setIsCharging(false);
      setSwipeDirection('right');
      Alert.alert(
      'Charging Stopped',
      'Your charging session has been ended.',
      [
        {
          text: 'View Summary',
          onPress: () => router.push('/pages/ChargingStoped')
        },
        {
          text: 'OK',
          style: 'cancel'
        }
      ],
      { cancelable: false }
    );
    }
  };

  const chargingInfoItems = [
    {
      icon: 'flash',
      label: 'Charging Power',
      value: chargingData.chargingPower
    },
    {
      icon: 'time',
      label: 'Charging Time',
      value: chargingData.chargingTime
    }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ width: SCREEN_WIDTH * 0.08 }} />
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>{vehicleName}</Text>
          <Text style={styles.headerSubtitle}>
            {isCharging ? 'Charging' : 'Ready to charge'}
          </Text>
        </View>
        <View style={{ width: SCREEN_WIDTH * 0.08 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.batteryContainer}>
          <CircularProgress
            percentage={Math.floor(chargingData.batteryPercentage)}
            size={SCREEN_WIDTH * 0.5}
            additionalText={`${Math.floor(chargingData.batteryPercentage)}%`}
            strokeWidth={12}
            activeColor={isCharging ? colors.primary : colors.secondaryText}
          />
          <Text style={styles.batteryStatus}>
            {isCharging ? 'Charging...' : 'Charging not started'}
          </Text>
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
        <SwipeButton
          direction={swipeDirection}
          isCharging={isCharging}
          onSwipeComplete={handleSwipeComplete}
        />
        <Text style={{color: 'red', fontSize: 12, textAlign: 'center', marginTop: 10}}>
          Debug: Direction = {swipeDirection}, isCharging = {isCharging.toString()}
        </Text>
      </View>
    </View>
  );
};

const SwipeButton = ({ direction, isCharging, onSwipeComplete }) => {
  const buttonWidth = SCREEN_WIDTH * 0.8;
  const thumbWidth = SCREEN_HEIGHT * 0.08;
  const pan = useRef(new Animated.Value(isCharging ? buttonWidth - thumbWidth - 10 : 0)).current;
  const currentDirectionRef = useRef(direction);

  // Update current direction ref when direction changes
  useEffect(() => {
    console.log('Direction changed to:', direction);
    currentDirectionRef.current = direction;
    if (direction === 'right') {
      pan.setValue(0);
    } else {
      pan.setValue(buttonWidth - thumbWidth - 10);
    }
  }, [direction, buttonWidth, thumbWidth]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => {
        console.log('PanResponder Start');
        return true;
      },
      onMoveShouldSetPanResponder: () => {
        console.log('PanResponder Move Start');
        return true;
      },
      onPanResponderMove: (_, gestureState) => {
        // Get current direction from the ref
        const currentDirection = currentDirectionRef.current;
        console.log('PanResponder Move - dx:', gestureState.dx, 'direction:', currentDirection);
        if (currentDirection === 'right' && gestureState.dx >= 0) {
          pan.setValue(Math.min(gestureState.dx, buttonWidth - thumbWidth - 10));
        } else if (currentDirection === 'left' && gestureState.dx <= 0) {
          pan.setValue(Math.max(buttonWidth - thumbWidth - 10 + gestureState.dx, 0));
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        // Get current direction from the ref
        const currentDirection = currentDirectionRef.current;
        console.log('PanResponder Release - direction:', currentDirection, 'dx:', gestureState.dx);
        
        if (currentDirection === 'right' && gestureState.dx > 50) {
          console.log('Right swipe threshold met');
          Animated.timing(pan, {
            toValue: buttonWidth - thumbWidth - 10,
            duration: 200,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }).start(() => onSwipeComplete('right'));
        } else if (currentDirection === 'left' && gestureState.dx < -50) {
          console.log('Left swipe threshold met');
          Animated.timing(pan, {
            toValue: 0,
            duration: 200,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }).start(() => onSwipeComplete('left'));
        } else {
          console.log('Swipe threshold not met, springing back');
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
          {
            transform: [{ translateX: pan }],
            width: thumbWidth,
            height: thumbWidth,
            borderRadius: thumbWidth / 2
          }
        ]}
      >
        <Ionicons
          name={direction === 'right' ? "arrow-forward" : "arrow-back"}
          size={24}
          color="white"
        />
      </Animated.View>
      <Text style={styles.swipeText}>
        {direction === 'right' ? 'Swipe to start charging' : 'Swipe to stop charging'}
      </Text>
    </View>
  );
};

// Responsive sizing
const HEADER_HEIGHT = SCREEN_HEIGHT * 0.2;
const BUTTON_PADDING = SCREEN_HEIGHT * 0.05;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: SCREEN_WIDTH * 0.06,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: HEADER_HEIGHT,
    marginBottom: SCREEN_HEIGHT * 0.02,
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: SCREEN_WIDTH * 0.05,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
  },
  headerSubtitle: {
    fontSize: SCREEN_WIDTH * 0.035,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
    marginTop: 4,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  batteryContainer: {
    alignItems: 'center',
    marginBottom: SCREEN_HEIGHT * 0.05,
  },
  batteryStatus: {
    fontSize: SCREEN_WIDTH * 0.035,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
    marginTop: 16,
  },
  costContainer: {
    alignItems: 'center',
    marginVertical: SCREEN_HEIGHT * 0.04,
  },
  costLabel: {
    fontSize: SCREEN_WIDTH * 0.035,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
    marginBottom: 8,
  },
  costText: {
    fontSize: SCREEN_WIDTH * 0.08,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
  },
  currencyText: {
    fontSize: SCREEN_WIDTH * 0.04,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
  },
  buttonContainer: {
    paddingBottom: BUTTON_PADDING,
    alignItems: 'center',
  },
  swipeContainer: {
    height: SCREEN_HEIGHT * 0.08,
    backgroundColor: '#E9F7F4',
    borderRadius: SCREEN_HEIGHT * 0.04,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  swipeThumb: {
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 5,
    zIndex: 10,
  },
  swipeText: {
    color: colors.secondaryText,
    fontFamily: fonts.PlusJakartaSansMedium,
    fontSize: SCREEN_WIDTH * 0.035,
    textAlign: 'center',
  },
  chargingActiveIndicator: {
    backgroundColor: colors.primary,
    height: SCREEN_HEIGHT * 0.08,
    borderRadius: SCREEN_HEIGHT * 0.04,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  chargingActiveText: {
    color: 'white',
    fontFamily: fonts.PlusJakartaSansBold,
    fontSize: SCREEN_WIDTH * 0.04,
  },
});

export default StartChargeWalkInScreen;