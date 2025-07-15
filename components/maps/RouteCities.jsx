import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../../constants/color';
import fonts from '../../constants/fonts';

const RouteCities = ({ cities }) => {
  if (!cities || cities.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Main Cities on Route</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {cities.map((city, index) => (
          <View key={index} style={styles.cityContainer}>
            <MaterialIcons name="location-city" size={16} color={colors.primary} />
            <Text style={styles.cityText}>{city}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    marginBottom: 8,
  },
  cityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  cityText: {
    fontSize: 12,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.mainTextColor,
    marginLeft: 5,
  },
});

export default RouteCities;