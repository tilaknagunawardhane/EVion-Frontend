import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import colors from '../../constants/color';
import fonts from '../../constants/fonts';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const WaitingConnectionScreen = () => {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push('/pages/ChargeConnected');
    }, 4000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={styles.container}>
      {/* Header Group */}
      <View style={styles.headerGroup}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/pages/StartCharging')}>
            <Ionicons name="chevron-back" size={SCREEN_WIDTH * 0.06} color={colors.mainTextColor} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Waiting for Connection</Text>
          <View style={{ width: SCREEN_WIDTH * 0.06 }} />
        </View>

        <Text style={styles.subText}>
          Please connect your vehicle to{'\n'}the charger
        </Text>
      </View>

      {/* Centered Content */}
      <View style={styles.centerContent}>
        <Image
          source={require('../../assets/EVChargingV.png')}
          style={styles.evImage}
        />
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <ActivityIndicator size={SCREEN_WIDTH * 0.1} color={colors.danger} />
        <Text style={styles.loadingText}>Standing by..</Text>
      </View>
    </View>
  );
};

// Responsive sizing calculations
const HEADER_PADDING_TOP = SCREEN_HEIGHT * 0.08;
const HEADER_HEIGHT = SCREEN_HEIGHT * 0.08;
const IMAGE_SIZE = SCREEN_WIDTH * 0.5;
const FOOTER_MARGIN = SCREEN_HEIGHT * 0.05;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: SCREEN_WIDTH * 0.06, // 6% of screen width
  },
  headerGroup: {
    paddingTop: HEADER_PADDING_TOP,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SCREEN_HEIGHT * 0.03, // 3% of screen height
  },
  headerTitle: {
    fontSize: 18, // Responsive font size
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    textAlign: 'center',
    flex: 1, // Helps with centering
  },
  subText: {
    fontSize: SCREEN_WIDTH * 0.035,
    color: colors.secondaryText,
    fontFamily: fonts.PlusJakartaSans,
    textAlign: 'center',
    marginBottom: SCREEN_HEIGHT * 0.02,
    lineHeight: SCREEN_HEIGHT * 0.025, // Responsive line height
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  evImage: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    resizeMode: 'contain',
  },
  footer: {
    alignItems: 'center',
    marginBottom: FOOTER_MARGIN,
  },
  loadingText: {
    marginTop: SCREEN_HEIGHT * 0.02,
    fontSize: SCREEN_WIDTH * 0.035,
    color: colors.secondaryText,
    fontFamily: fonts.PlusJakartaSans,
  },
});

export default WaitingConnectionScreen;