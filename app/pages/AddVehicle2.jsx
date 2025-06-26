import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import AppBar from '../../components/AppBar';
import CustomButton from '../../components/CustomButton';
import PlugBox from '../../components/PlugBox';
import colors from '../../constants/color';
import fonts from '../../constants/fonts';

const plugTypes = [
  { id: 'type1', label: 'Type 1\n(SAE J1772)', image: require('../../assets/type1.png') },
  { id: 'type2', label: 'Type 2\n(Mennekes)', image: require('../../assets/type2.png') },
  { id: 'ccs1', label: 'CCS Combo\nType 1', image: require('../../assets/ccs1.png') },
  { id: 'ccs2', label: 'CCS Combo\nType 2', image: require('../../assets/ccs2.png') },
  { id: 'chademo', label: 'CHAdeMO', image: require('../../assets/chademo.png') },
  { id: 'tesla', label: 'Tesla', image: require('../../assets/tesla.png') },
];

const AddPlugTypeScreen = () => {
  const [selectedPlug, setSelectedPlug] = useState(null); // Single plug selection

  const togglePlugSelection = (id) => {
    setSelectedPlug((prev) => (prev === id ? null : id)); // Select or unselect
  };

  const handleNext = () => {
    if (selectedPlug) {
      router.push('/pages/AddVehicle3'); // Next screen
    } else {
      Alert.alert('Select Plug Type', 'Please select a plug type before proceeding.');
    }
  };

  return (
    <View style={styles.container}>
      <AppBar />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.mainContent}>
          <Text style={styles.title}>Add Your EV</Text>
          <Text style={styles.subtitle}>Please select supported plug type</Text>

          <View style={styles.progressBar}>
            <View style={styles.inactiveDot} />
            <View style={styles.activeDot} />
            <View style={styles.inactiveDot} />
            <View style={styles.inactiveDot} />
          </View>

          <Text style={styles.sectionTitle}>Plug Types</Text>

          <Text style={styles.sectionSubtitle}>AC Plugs</Text>
          <View style={styles.grid}>
            {plugTypes.slice(0, 2).map((plug) => (
              <PlugBox
                key={plug.id}
                plug={plug}
                isSelected={selectedPlug === plug.id}
                onPress={() => togglePlugSelection(plug.id)}
              />
            ))}
          </View>

          <Text style={styles.sectionSubtitle}>DC Fast Charging Plugs</Text>
          <View style={styles.grid}>
            {plugTypes.slice(2, 5).map((plug) => (
              <PlugBox
                key={plug.id}
                plug={plug}
                isSelected={selectedPlug === plug.id}
                onPress={() => togglePlugSelection(plug.id)}
              />
            ))}
          </View>

          <Text style={styles.sectionSubtitle}>Tesla</Text>
          <View style={styles.grid}>
            <PlugBox
              plug={plugTypes[5]}
              isSelected={selectedPlug === plugTypes[5].id}
              onPress={() => togglePlugSelection(plugTypes[5].id)}
            />
          </View>

          <CustomButton title="Next" onPress={handleNext} type="primary" />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    paddingBottom: 24,
  },
  mainContent: {
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: colors.secondaryText,
    fontFamily: fonts.PlusJakartaSans,
    marginBottom: 20,
  },
  progressBar: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  activeDot: {
    width: 34,
    height: 6,
    borderRadius: 8,
    backgroundColor: colors.primary,
    marginRight: 6,
  },
  inactiveDot: {
    width: 6,
    height: 6,
    borderRadius: 8,
    backgroundColor: colors.stroke,
    marginRight: 6,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    marginTop: 16,
    marginBottom: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});

export default AddPlugTypeScreen;
