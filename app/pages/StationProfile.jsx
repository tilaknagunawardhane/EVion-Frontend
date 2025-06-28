import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import CustomButton from '../../components/CustomButton';
import AppBar from '../../components/AppBar';
import colors from '../../constants/color';
import fonts from '../../constants/fonts';
import { useNavigation } from '@react-navigation/native';
import InputField from '../../components/InputField';
import DropdownField from '../../components/DropdownField';
import { router } from 'expo-router';
 


const ChargingStationScreen = () => {
  const navigation = useNavigation();

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
      <Image source={require('../../assets/Station.jpg')} style={styles.stationImage} />
      {/* Back Icon */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Image source={require('../../assets/back-icon.png')} style={styles.backIcon} />
      </TouchableOpacity>
    </View>

    {/* Title with icons on the right */}
    <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 24, marginTop: 16, justifyContent: 'space-between' }}>
      <Text style={[styles.title, { fontSize: 18, marginTop: 0, marginHorizontal: 0 }]}>Fonseka Charging Station</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity>
          <Image source={require('../../assets/bookmark.png')} style={[styles.bookmarkIcon, { width: 23, height: 24, marginRight: 8 }]} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={require('../../assets/navigation.png')} style={[styles.navigationIcon, { width: 23, height: 24 }]} />
        </TouchableOpacity>
      </View>
    </View>
    <Text style={[styles.subtitle, { fontSize: 12 }]}>No: 2/82, Maha Payagala, Payagala</Text>

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
    <View style={styles.connectorCard}>
      <View style={styles.connectorHeader}>
        <Text style={[styles.availableText, { color: colors.primary }]}>Available</Text>
        <Text style={styles.connectorID}>ID: #E0299</Text>
      
      </View>
      {/* Charger name and image row */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
        <Image
          source={require('../../assets/ccs2.png')}
          style={[styles.chargerIcon, { tintColor: colors.primary, marginRight: 8 }]}
        />
        <Text style={styles.connectorType}>CCS 2</Text>
      </View>
    {/* Separator line */}
    <View style={{ height: 1, backgroundColor: colors.stroke, marginVertical: 8 }} />
    <View style={[styles.batteryInfo, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }]}>
        <Text style={styles.batteryText}>Battery Gain:</Text>
        <Text style={[styles.batteryText, { color: colors.mainTextColor, textAlign: 'right' }]}>~35% in 30 mins</Text>
    </View>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <Text style={styles.batteryText}>Est. Time to 80%:</Text>
        <Text style={[styles.batteryText, { color: colors.mainTextColor, textAlign: 'right' }]}>~45 mins</Text>
    </View>
    <View style={styles.powerRow}>
       
        {/* Small gray test box */}
        <View
            style={{
              color: colors. secondaryText,
                borderRadius: 4,
                paddingHorizontal: 8,
                paddingVertical: 2,
                marginHorizontal: 8,
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 32,
                borderWidth: 1,
               Color: colors.boder,
            }}
        >
            <Text
                style={{
                    color: colors.mainTextColor,
                    fontSize: 12,
                    fontFamily: fonts.PlusJakartaSansBold, // Make it bolder
                    fontWeight: 'bold', // Extra boldness for safety
                }}
            >
                ⚡ 50kW (DC)
            </Text>
        </View>

        <View
            style={{
               Color: colors.secondaryText,
                borderRadius: 4,
                paddingHorizontal: 8,
                paddingVertical: 2,
                marginHorizontal: 8,
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 32,
                borderWidth: 1,
               Color:colors.border ,
            }}
        >
            <Text
                style={{
                    color: colors.mainTextColor,
                    fontSize: 12,
                    fontFamily: fonts.PlusJakartaSansBold, // Make it bolder
                    fontWeight: 'bold', // Extra boldness for safety
                }}
            >
                LKR 55.00 /kW
            </Text>
        </View>
        </View>
       
        </View>
        <View style={styles.connectorCard}>
            <View style={styles.connectorHeader}>
                <Text style={[styles.busyText, { color: 'orange' }]}>Charger Busy</Text>
                <Text style={styles.connectorID}>ID: #E1121</Text>
            </View>
            {/* Charger name and image row */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
        <Image
          source={require('../../assets/type2.png')}
          style={[styles.chargerIcon, { tintColor: colors.primary, marginRight: 8 }]}
        />
        <Text style={styles.connectorType}>Type 2 (Mennekes)</Text>
      </View>
    /* Separator line */
    <View style={{ height: 1, backgroundColor: colors.stroke, marginVertical: 8 }} />
    <View style={styles.batteryInfo}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={styles.batteryText}>Battery Gain:</Text>
            <Text style={[styles.batteryText, { color: colors.mainTextColor, textAlign: 'right' }]}>~20% in 30 mins</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={styles.batteryText}>Est. Time to 80%:</Text>
            <Text style={[styles.batteryText, { color: colors.mainTextColor, textAlign: 'right' }]}>~2.5 - 3 hrs</Text>
        </View>
    </View>
    <View style={[styles.powerRow, { gap: 4 }]}>
        <View
            style={{
            Color:colors.secondaryText,
                borderRadius: 4,
                paddingHorizontal: 8,
                paddingVertical: 2,
                marginHorizontal: 4, // reduced from 8 to 4
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 32,
                borderWidth: 1,
                Color: colors.border ,
            }}
          >
            <Text
                style={{
                  color: colors.mainTextColor,
                  fontSize: 12,
                  fontFamily: fonts.PlusJakartaSansBold, // Make it bolder
                    fontWeight: 'bold', // Extra boldness for safety
                }}
            >
               ⚡ 22kW (AC)
            </Text>
        </View> 
       
        <View style={styles.kwBox}></View>
      

        <View
            style={{
                color: colors.secondaryText,
                borderRadius: 4,
                paddingHorizontal: 8,
                paddingVertical: 2,
                marginHorizontal: 8,
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 32,
                borderWidth: 1,
               color: colors.boder,
            }}
        >
            <Text
                style={{
                    color: colors.mainTextColor,
                    fontSize: 12,
                    fontFamily: fonts.PlusJakartaSansBold, // Make it bolder
                    fontWeight: 'bold', // Extra boldness for safety
                }}
            >
                LKR 55.00 /kW
            </Text>
        </View> 
       

        <View style={styles.kwBox}></View>
      </View>
    </View>

    {/* Buttons */}
    <View>
      <CustomButton title="Book Now" onPress={handleBookNow} type="primary" style={styles.bookButton} />
      <CustomButton
        title="Check Availability"
        onPress={() => router.push('/pages/CheckAvailability')}
        type="primary"
        style={styles.checkButton}
        textStyle={{ color: colors.primary }} // Ensure this prop is supported by CustomButton
      />
    </View>

    {/* Report Link */}
    <TouchableOpacity onPress={handleReport}>
      <Text style={styles.reportText}>Report</Text>
    </TouchableOpacity>
    </ScrollView>
  </View>
);
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContainer: { paddingBottom: 40 },
  imageContainer: { position: 'relative' },
  stationImage: { width: '100%', height: 220 },
  backButton: { position: 'absolute', top: 40, left: 16, backgroundColor: '#FFFFFFB3', padding: 8, borderRadius: 20 },
  backIcon: { width: 18, height: 18, tintColor: colors.mainTextColor },
  iconRow: { position: 'absolute', top: 40, right: 16, flexDirection: 'row', gap: 12 },
  actionIcon: { width: 24, height: 24, tintColor: colors.mainTextColor },
  title: { fontSize: 24, fontFamily: fonts.PlusJakartaSansBold, color: colors.mainTextColor, marginTop: 16, marginHorizontal: 24 },
  subtitle: { fontSize: 14, fontFamily: fonts.PlusJakartaSans, color: colors.secondaryText, marginBottom: 16, marginHorizontal: 24 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 16, marginHorizontal: 24 },
  openBadge: { backgroundColor: colors.primary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  openText: { color: colors.background, fontFamily: fonts.PlusJakartaSansBold, fontSize: 12 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  starIcon: { width: 14, height: 14, tintColor: '#FFD700' },
  ratingText: { fontSize: 12, fontFamily: fonts.PlusJakartaSans, color: colors.mainTextColor },
  sectionTitle: { fontSize: 16, fontFamily: fonts.PlusJakartaSansBold, color: colors.mainTextColor, marginBottom: 12, marginHorizontal: 24 },
  connectorCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, marginHorizontal: 24, borderWidth: 1, borderColor: colors.stroke, shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 1 }, shadowRadius: 2, elevation: 2 },
  connectorHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  availableText: { color: '#00A86B', fontFamily: fonts.PlusJakartaSansBold, fontSize: 14 },
  busyText: { color: '#FF5A5F', fontFamily: fonts.PlusJakartaSansBold, fontSize: 14 },
  connectorID: { fontSize: 12, fontFamily: fonts.PlusJakartaSans, color: colors.secondaryText },
  connectorType: { fontSize: 14, fontFamily: fonts.PlusJakartaSansBold, color: colors.mainTextColor, marginBottom: 12 },
  batteryInfo: { marginBottom: 12 },
  batteryText: { fontSize: 12, fontFamily: fonts.PlusJakartaSans, color: colors.secondaryText, marginBottom: 4 },
  powerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  powerText: { fontSize: 14, fontFamily: fonts.PlusJakartaSansBold, color: colors.mainTextColor },
  priceText: { fontSize: 14, fontFamily: fonts.PlusJakartaSans, color: colors.mainTextColor },
  bookButton: { marginHorizontal: 24, marginBottom: 12 },
  checkButton: { marginHorizontal: 24, marginBottom: 12, borderColor: colors.primary, borderWidth: 1, backgroundColor: colors.background },
  reportText: { fontSize: 14, fontFamily: fonts.PlusJakartaSans, color: '#FF5A5F', textAlign: 'center', textDecorationLine: 'underline' },
});

export default ChargingStationScreen;
