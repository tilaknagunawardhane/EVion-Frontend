import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import colors from '../../constants/color';
import fonts from '../../constants/fonts';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const ChargeConnectedScreen = () => {
  const router = useRouter();
  const { userId, connectorId } = useLocalSearchParams(); // ✅ get params from previous page

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push({
        pathname: '/pages/StartChargeWalk-In',
        params: { userId, connectorId } // ✅ send both IDs forward
      });
    }, 3000);
    return () => clearTimeout(timeout);
  }, [userId, connectorId]);

  return (
    <View style={styles.container}>
      {/* Header Group */}
      <View style={styles.headerGroup}>
        <View style={styles.header}>
          <View style={{ width: SCREEN_WIDTH * 0.08 }} />
          <Text style={styles.headerTitle}>All Set!</Text>
          <View style={{ width: SCREEN_WIDTH * 0.08 }} />
        </View>

        <Text style={styles.subText}>
          Vehicle successfully linked{'\n'}to the charger
        </Text>
      </View>

      {/* Centered Content */}
      <View style={styles.centerContent}>
        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/EVconnectedcharge.png')}
            style={styles.evImage}
          />
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.statusText}>Connected</Text>
      </View>
    </View>
  );
};

// Responsive sizing calculations
const HEADER_HEIGHT = SCREEN_HEIGHT * 0.08;
const IMAGE_CONTAINER_SIZE = SCREEN_WIDTH * 0.7;
const IMAGE_SIZE = SCREEN_WIDTH * 0.4;
const FOOTER_MARGIN = SCREEN_HEIGHT * 0.05;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: SCREEN_WIDTH * 0.06,
  },
  headerGroup: {
    paddingTop: HEADER_HEIGHT,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SCREEN_HEIGHT * 0.03,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    textAlign: 'center',
    flex: 1,
  },
  subText: {
    fontSize: SCREEN_WIDTH * 0.035,
    color: colors.secondaryText,
    fontFamily: fonts.PlusJakartaSans,
    textAlign: 'center',
    lineHeight: SCREEN_HEIGHT * 0.025,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: IMAGE_CONTAINER_SIZE,
    height: IMAGE_CONTAINER_SIZE,
    borderRadius: IMAGE_CONTAINER_SIZE / 2,
    backgroundColor: '#E9F7F4',
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
  statusText: {
    fontSize: SCREEN_WIDTH * 0.04,
    color: colors.primary,
    fontFamily: fonts.PlusJakartaSansMedium,
  },
});

export default ChargeConnectedScreen;
