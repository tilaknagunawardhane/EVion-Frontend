import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import colors from '../../../constants/color';
import fonts from '../../../constants/fonts';
import ConnectorCard from '../../../components/SelectConnectorCard';
 // <-- adjust path if needed

/* ------------------------------------------------------------------ */
/* Demo data – plug in your API response here                         */
/* ------------------------------------------------------------------ */
const connectors = [
  {
    id: '#E0299',
    status: 'Available',
    type: 'Type 2 (Mennekes)',
    batteryGain: '~20% in 30 mins',
    estTime: '~2.5 – 3 hrs',
    power: '22kW (AC)',
    price: 'LKR 55.00 /kW',
    icon: require('../../../assets/type2.png'),
  },
];

const SelectConnector = () => {
  const router = useRouter();
  const [selectedConnector, setSelectedConnector] = useState(null);

  const handleSelect = () => {
    if (selectedConnector) {
      router.push({
        pathname: '/pages/bookings/AddBooking',
        params: { selectedConnector },
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* drag‑handle */}
      <View style={styles.topBar} />

      <Text style={styles.title}>Select Connector</Text>

      <ScrollView contentContainerStyle={styles.scroll}>
        {connectors.map((item) => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.9}
            onPress={() => setSelectedConnector(item)}
          >
            <ConnectorCard
              connector={item}
              selected={selectedConnector?.id === item.id}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* SELECT BUTTON */}
      <TouchableOpacity
        style={[styles.selectBtn, !selectedConnector && styles.disabledBtn]}
        onPress={handleSelect}
        disabled={!selectedConnector}
      >
        <Text
          style={[styles.selectText, !selectedConnector && styles.disabledText]}
        >
          Select
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SelectConnector;

/* ----------------------------- STYLES ----------------------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  topBar: {
    alignSelf: 'center',
    width: 50,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },
  title: {
    fontSize: 20,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.mainTextColor,
    textAlign: 'center',
    marginBottom: 12,
  },
  scroll: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  /* button */
  selectBtn: {
    backgroundColor: colors.primary,
    margin: 16,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectText: {
    fontSize: 15,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.white,
  },
  disabledBtn: {
    backgroundColor: colors.lightestGray,
  },
  disabledText: {
    color: colors.secondaryText,
  },
});
