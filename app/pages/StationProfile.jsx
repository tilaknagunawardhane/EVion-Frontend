import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Modal } from 'react-native';
import CustomButton from '../../components/CustomButton';
import ConnectorCard from '../../components/ConnectorCard';
import colors from '../../constants/color';
import fonts from '../../constants/fonts';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';

const ChargingStationScreen = () => {
  const navigation = useNavigation();
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [popupIndex, setPopupIndex] = useState(null); // To track which popup to show

  const stationImage = require('../../assets/Station.jpg');
  const stationName = 'Fonseka Charging Station';
  const address = 'No: 2/82, Maha Payagala, Payagala';

  const connectorArray = [
    {
      status: 'Available',
      connectorType: 'CCS 2',
      connectorID: '#E0299',
      connectorImage: require('../../assets/ccs2.png'),
      batteryGain: '35% in 30 mins',
      estimatedTime: '~45 mins',
      powerInfo: '50kW (DC)',
      price: 'LKR 55.00',
    },
    {
      status: 'Charger Busy',
      connectorType: 'Type 2 (Mennekes)',
      connectorID: '#E1121',
      connectorImage: require('../../assets/type2.png'),
      batteryGain: '20% in 30 mins',
      estimatedTime: '~2.5 - 3 hrs',
      powerInfo: '22kW (AC)',
      price: 'LKR 55.00',
    },
  ];

  const handleReport = () => console.log('Report pressed');
  const handleBookNow = () => console.log('Book Now pressed');
  const handleCheckAvailability = () => console.log('Check Availability pressed');

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <View style={styles.imageContainer}>
          <Image source={stationImage} style={styles.stationImage} />
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Image source={require('../../assets/back-icon.png')} style={styles.backIcon} />
          </TouchableOpacity>
        </View>

        {/* Header Title */}
        <View style={styles.topRow}>
          <Text style={styles.title}>{stationName}</Text>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity>
              <Image source={require('../../assets/bookmark.png')} style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image source={require('../../assets/navigation.png')} style={styles.icon} />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.subtitle}>{address}</Text>

        {/* Status & Rating */}
        <View style={styles.statusRow}>
          <View style={styles.openBadge}>
            <Text style={styles.openText}>Open</Text>
          </View>
          <View style={styles.ratingRow}>
            <Image source={require('../../assets/star.png')} style={styles.starIcon} />
            <Text style={styles.ratingText}>4.5 (43 Reviews)</Text>
          </View>
          <TouchableOpacity onPress={handleReport}>
            <Text style={styles.reportText}>Report</Text>
          </TouchableOpacity>
        </View>

        {/* Connectors  */}
        <Text style={styles.sectionTitle}>Available Connectors</Text>

        {connectorArray.length > 0 ? (
          connectorArray.map((connector, index) => (
            <ConnectorCard
              key={index}
              {...connector}
              isSelected={index === selectedIndex}
              onSelect={() => setSelectedIndex(index)}
              onDotsPress={() => setPopupIndex(index)}
            />
          ))
        ) : (
          <Text style={styles.noConnectors}>No connectors available.</Text>
        )}

        {/* Footer Buttons */}
        {selectedIndex !== null && (
          <View style={[styles.footer, { bottom: 24 }]}>
            <CustomButton title="Book Now" onPress={handleBookNow} type="primary" style={styles.bookButton} />
            <CustomButton
              title="Check Availability"
              onPress={handleCheckAvailability}
              type="primary"
              style={styles.checkButton}
              textStyle={{ color: colors.primary }}
            />
            <TouchableOpacity onPress={handleReport}>
              <Text style={styles.reportText}>Report</Text>
            </TouchableOpacity>
          </View>
        )}
        </ScrollView>

        {/* Popup Modal */}
      <Modal transparent visible={popupIndex !== null} animationType="fade">
        <TouchableOpacity
          style={styles.popupOverlay}
          onPress={() => setPopupIndex(null)}
          activeOpacity={1}
        >
          <View style={styles.popupBox}>
            <Text style={styles.popupText}>Check Availability</Text>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContainer: { paddingBottom: 120 },
  imageContainer: { position: 'relative' },
  stationImage: { width: '100%', height: 220 },
  backButton: { position: 'absolute', top: 40, left: 16, backgroundColor: colors.background         , padding: 8, borderRadius: 20 },
  backIcon: { width: 18, height: 18, tintColor: colors.mainTextColor },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 24, marginTop: 16 },
  title: { fontSize: 18, fontFamily: fonts.PlusJakartaSansBold, color: colors.mainTextColor },
  icon: { width: 23, height: 24, marginLeft: 8 },
  subtitle: { fontSize: 12, fontFamily: fonts.PlusJakartaSans, color: colors.secondaryText, marginHorizontal: 24 },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', margin: 16, marginTop: 12 },
  openBadge: { backgroundColor: colors.primary, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 6 },
  openText: { color: colors.background, fontFamily: fonts.PlusJakartaSansBold, fontSize: 10 },
  ratingRow: { flexDirection: 'row', alignItems: 'center' },
  starIcon: { width: 14, height: 14, tintColor: colors.star, marginRight: 4 },
  ratingText: { fontSize: 10, fontFamily: fonts.PlusJakartaSans, color: colors.mainTextColor },
  reportText: { fontSize: 14, fontFamily: fonts.PlusJakartaSans, color: colors.danger, textAlign: 'center', textDecorationLine: 'underline' },
  sectionTitle: { fontSize: 13, fontFamily: fonts.PlusJakartaSansBold, color: colors.mainTextColor, marginBottom: 8, marginHorizontal: 24 },
  noConnectors: { marginHorizontal: 24, color: colors.secondaryText, fontFamily: fonts.PlusJakartaSans },
  footer: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: colors.background, padding: 16 },
  bookButton: { marginBottom: 12 },
  checkButton: { marginBottom: 12, borderColor: colors.primary, borderWidth: 1, backgroundColor: colors.background },
  popupOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background       },
  popupBox: { backgroundColor: 'white', padding: 10,borderRadius: 8, elevation: 4},
  popupText: { fontFamily: fonts.PlusJakartaSans, fontSize: 14 },
});

export default ChargingStationScreen;