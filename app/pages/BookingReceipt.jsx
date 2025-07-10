import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import colors from '../../constants/color';
import fonts from '../../constants/fonts';
import CustomButton from '../../components/CustomButton';
import { useRouter } from 'expo-router';


const BillingSummaryScreen = () => {
    const router = useRouter();
  
  const navigation = useNavigation();

  const handleDownload = () => {
    Alert.alert(
      'Download Complete',
      'Your billing summary has been downloaded successfully.',
      [
        {
          text: 'OK',
          onPress: () => router.push('/(tabs)'), // Navigate to home after alert
          style: 'default'
        }
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      {/* Top & Bottom Background Overlays */}
      <View style={styles.topBackground} />
      <View style={styles.bottomBackground} />

      {/* Top Header Section */}
      <View style={styles.headerSection}>
        <View style={styles.appBar}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.closeIconTouchable}
          >
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.appBarTitle}>Billing Summary</Text>
        </View>
        <Text style={styles.totalCost}>LKR 3,350.00</Text>
      </View>

      {/* Bottom White Section */}
      <View style={styles.bottomSection}>
        <View style={styles.summaryBox}>
          <TextRow label="Session ID:" value="EVCS-GS3–2–5462" />
          <TextRow label="Date" value="Jun 11, 2025" />
          <TextRow
            label="Charging Station:"
            value={"Genso Charging Station,\nSouthern Highway, Welipenna"}
            multiLine
          />
          <Separator />
          <TextRow label="Start Time & End Time:" value="9:37 AM – 10:00 AM" />
          <TextRow label="Duration:" value="1 Hr 23 Mins" />
          <TextRow label="Energy Delivered (in kWh):" value="48.00 kWh" />
          <Separator />
          <TextRow label="Cost per kWh :" value="LKR 55.00" />
          <TextRow label="Subtotal: Energy Cost:" value="LKR 3,350.00" />
          <TextRow label="Booking Fee" value="-" />
          <TextRow label="No-show penalties:" value="-" />
          <Separator />
          <TextRow label="Total:" value="LKR 3,350.00" bold />
        </View>

        <CustomButton
        title="Download"
        type="primary"
        onPress={handleDownload} // Updated to use the new handler
        style={styles.downloadButton}
        textStyle={styles.downloadText}
      />
      </View>
    </View>
  );
};

const TextRow = ({ label, value, bold = false, multiLine = false }) => (
  <View style={[styles.textRow, multiLine && { alignItems: 'flex-start' }]}>
    <Text style={[styles.label, bold && styles.boldText]}>{label}</Text>
    <Text
      style={[
        styles.value,
        bold && styles.boldText,
        multiLine && { textAlign: 'right', flex: 2 },
      ]}
    >
      {value}
    </Text>
  </View>
);

const Separator = () => (
  <View
    style={{
      height: 1,
      backgroundColor: colors.stroke,
      marginVertical: 10,
      marginTop: 16,
      marginBottom: 16,
    }}
  />
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: colors.primary,
    zIndex: -1,
  },
  bottomBackground: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.background,
    zIndex: -1,
  },
  headerSection: {
    backgroundColor: 'transparent',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
    alignItems: 'center',
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  appBarTitle: {
    color: colors.background,
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSansBold,
    textAlign: 'center',
    flex: 1,
  },
  closeIconTouchable: {
    position: 'absolute',
    left: 30,
    top: 0,
    padding: 0,
    zIndex: 2,
  },
  totalCost: {
    marginTop: 40,
    color: colors.background,
    fontSize: 28,
    fontFamily: fonts.PlusJakartaSansBold,
  },
  bottomSection: {
    flex: 1,
    backgroundColor: 'transparent',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    alignItems: 'center',
    paddingTop: 20,
  },
  summaryBox: {
    backgroundColor: colors.background,
    width: '90%',
    height: 528,
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 30,
  },
  textRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    color: colors.secondaryText,
    fontFamily: fonts.PlusJakartaSansMedium,
    fontSize: 14,
    flex: 1,
  },
  value: {
    color: colors.mainTextColor,
    fontFamily: fonts.PlusJakartaSansBold,
    fontSize: 14,
    textAlign: 'right',
    flex: 1,
  },
  boldText: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansBold,
  },
  downloadButton: {
    width: '90%',
  },
  downloadText: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansBold,
  },
});

export default BillingSummaryScreen;
