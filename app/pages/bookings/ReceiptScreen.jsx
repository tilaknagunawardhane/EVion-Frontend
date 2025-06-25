import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../../../constants/color';
import fonts from '../../../constants/fonts';

const { width } = Dimensions.get('window');

const ReceiptScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Green Top Oval */}
      <View style={styles.greenOval}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="close" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Billing Summary</Text>
          <View style={{ width: 24 }} />
        </View>
        <Text style={styles.amount}>LKR 3,918.48</Text>
      </View>

      {/* White Card */}
      <View style={styles.card}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {[
            { label: 'Session ID:', value: 'EVCS–GS3–2–5462' },
            { label: 'Date & Time of Session:', value: 'Jun 11, 2025 9:37 AM' },
            {
              label: 'Charging Station:',
              value: 'Genso Charging Station,\nSouthern Highway, Welipenna',
            },
            { label: 'Vehicle:', value: 'Hyundai Kona Electric (SUV)' },
            { separator: true },
            { label: 'Start Time & End Time:', value: '9:37 AM – 10:00 AM' },
            { label: 'Duration:', value: '1 Hr 23 Mins' },
            { label: 'Energy Delivered (in kWh):', value: '69.17 kWh' },
            { separator: true },
            { label: 'Cost per kWh :', value: 'LKR 55.00' },
            { label: 'Subtotal: Energy Cost:', value: 'LKR 3,804.35' },
            { label: 'Booking Fee:', value: 'LKR 114.13' },
            { label: 'No-show penalties:', value: '–' },
            { separator: true },
            { label: 'Total:', value: 'LKR 3,918.48', isTotal: true },
          ].map((item, index) =>
            item.separator ? (
              <View key={index} style={styles.divider} />
            ) : (
              <View key={index} style={styles.item}>
                <View style={styles.receiptRow}>
                  <Text
                    style={[
                      styles.label,
                      item.isTotal && styles.totalLabel,
                    ]}
                  >
                    {item.label}
                  </Text>
                  <Text
                    style={[
                      styles.value,
                      item.isTotal && styles.totalValue,
                    ]}
                  >
                    {item.value}
                  </Text>
                </View>
              </View>
            )
          )}
        </ScrollView>
      </View>

      {/* Download Button */}
      <TouchableOpacity style={styles.downloadButton}>
        <Text style={styles.downloadText}>Download</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ReceiptScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  greenOval: {
    backgroundColor: colors.primary,
    height: 180,
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: colors.white,
    fontSize: 16,
    fontFamily: fonts.medium,
  },
  amount: {
    fontSize: 28,
    fontFamily: fonts.bold,
    color: colors.white,
    marginTop: 15,
  },
  card: {
    backgroundColor: colors.white,
    marginHorizontal: 20,
    marginTop: -40,
    borderRadius: 12,
    padding: 20,
    flex: 1,
    elevation: 3,
  },
  item: {
    marginBottom: 12,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
  },
  label: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.grayText,
    flex: 1,
  },
  value: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: colors.text,
    textAlign: 'right',
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: colors.lightGray,
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 14,
    fontFamily: fonts.medium,
  },
  totalValue: {
    fontSize: 14,
    fontFamily: fonts.bold,
  },
  downloadButton: {
    backgroundColor: colors.primary,
    marginHorizontal: 20,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  downloadText: {
    color: colors.white,
    fontFamily: fonts.bold,
    fontSize: 16,
  },
});
