import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import CustomButton from '../../components/CustomButton';
import ConnectorCard from '../../components/ConnectorCard';
import colors from '../../constants/color';
import fonts from '../../constants/fonts';
import { useNavigation } from '@react-navigation/native';

const ChargingStationScreen = () => {
  const navigation = useNavigation();

  const stationImage = require('../../assets/Station.jpg');
  const stationName = 'City Center Charging Station';
  const address = '123 Main St, Springfield';

  const connectorArray = [
    {
      status: 'Available',
      connectorType: 'Type 2',
      connectorID: 'CS123',
      connectorImage: require('../../assets/ccs2.png'),
      batteryGain: '50%',
      estimatedTime: '30 mins',
      powerInfo: '22 kW',
      price: '100',
    },
    {
      status: 'Charger Busy',
      connectorType: 'CCS',
      connectorID: 'CS456',
      connectorImage: require('../../assets/type2.png'),
      batteryGain: '30%',
      estimatedTime: '45 mins',
      powerInfo: '50 kW',
      price: '150',
    },
  ];

  const handleReport = () => {
    console.log('Report pressed');
  };

  const handleBookNow = () => {
    console.log('Book Now pressed');
  };

  const handleCheckAvailability = () => {
    console.log('Check Availability pressed');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image source={stationImage} style={styles.stationImage} />
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Image source={require('../../assets/back-icon.png')} style={styles.backIcon} />
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 24, marginTop: 16, justifyContent: 'space-between' }}>
          <Text style={[styles.title, { fontSize: 18, marginTop: 0, marginHorizontal: 0 }]}>{stationName}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity>
              <Image source={require('../../assets/bookmark.png')} style={[styles.bookmarkIcon, { width: 23, height: 24, marginRight: 8 }]} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image source={require('../../assets/navigation.png')} style={[styles.navigationIcon, { width: 23, height: 24 }]} />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={[styles.subtitle, { fontSize: 12 }]}>{address}</Text>

        <View style={[styles.statusRow, { justifyContent: 'space-between' }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={[styles.openBadge, { backgroundColor: colors.primary, paddingHorizontal: 16, paddingVertical: 2 }]}>
              <Text style={[styles.openText, { fontSize: 10 }]}>Open</Text>
            </View>
            <View style={styles.ratingRow}>
              <Image source={require('../../assets/star.png')} style={styles.starIcon} />
              <Text style={[styles.ratingText, { fontSize: 10 }]}>4.5 (43 Reviews)</Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleReport}>
            <Text style={styles.reportText}>Report</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionTitle, { fontSize: 13 }]}>Available Connectors</Text>

        {connectorArray.length > 0 ? (
          connectorArray.map((connector, index) => (
            <ConnectorCard key={index} {...connector} />
          ))
        ) : (
          <Text style={{ marginHorizontal: 24, color: colors.secondaryText, fontFamily: fonts.PlusJakartaSans }}>
            No connectors available.
          </Text>
        )}

        <View>
          <CustomButton title="Book Now" onPress={handleBookNow} type="primary" style={styles.bookButton} />
          <CustomButton
            title="Check Availability"
            onPress={handleCheckAvailability}
            type="primary"
            style={styles.checkButton}
            textStyle={{ color: colors.primary }}
          />
        </View>

        <TouchableOpacity onPress={handleReport}>
          <Text style={styles.reportText}>Report</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContainer: { paddingBottom: 40 },
  imageContainer: { position: 'relative' },
  stationImage: { width: '100%', height: 220 },
  backButton: { position: 'absolute', top: 40, left: 16, backgroundColor: '#FFFFFFB3', padding: 8, borderRadius: 20 },
  backIcon: { width: 18, height: 18, tintColor: colors.mainTextColor },
  title: { fontSize: 24, fontFamily: fonts.PlusJakartaSansBold, color: colors.mainTextColor, marginTop: 16, marginHorizontal: 24 },
  subtitle: { fontSize: 14, fontFamily: fonts.PlusJakartaSans, color: colors.secondaryText, marginBottom: 16, marginHorizontal: 24 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 16, marginHorizontal: 24 },
  openBadge: { backgroundColor: colors.primary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  openText: { color: colors.background, fontFamily: fonts.PlusJakartaSansBold, fontSize: 12 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  starIcon: { width: 14, height: 14, tintColor: '#FFD700' },
  ratingText: { fontSize: 12, fontFamily: fonts.PlusJakartaSans, color: colors.mainTextColor },
  sectionTitle: { fontSize: 16, fontFamily: fonts.PlusJakartaSansBold, color: colors.mainTextColor, marginBottom: 12, marginHorizontal: 24 },
  bookButton: { marginHorizontal: 24, marginBottom: 12 },
  checkButton: { marginHorizontal: 24, marginBottom: 12, borderColor: colors.primary, borderWidth: 1, backgroundColor: colors.background },
  reportText: { fontSize: 14, fontFamily: fonts.PlusJakartaSans, color: '#FF5A5F', textAlign: 'center', textDecorationLine: 'underline' },
});

export default ChargingStationScreen;
