import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import colors from '../../../constants/color';
import fonts from '../../../constants/fonts';
import CustomButton from '../../../components/CustomButton';
import * as MailComposer from 'expo-mail-composer';
import useUserData from '../../../hooks/useUserData';


const { width } = Dimensions.get('window');

const ReceiptScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const data = route.params || {};

  // Helper: Convert ISO timestamp to human-readable format
const formatDateTime = (isoString) => {
  if (!isoString) return '–';
  try {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return isoString;
  }
};

const formatDuration = (minutesValue) => {
  if (!minutesValue && minutesValue !== 0) return '–';

  const totalSeconds = Math.round(minutesValue * 60);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  let result = '';
  if (hours > 0) result += `${hours} Hr `;
  if (minutes > 0) result += `${minutes} Min `;
  if (seconds > 0) result += `${seconds} Sec`;
  return result.trim();
};


  // Destructure values from params, fallback to existing hardcoded defaults if missing
  const sessionId = data.sessionId || 'EVCS–GS3–2–5462';
  const dateTime = data.startTime ? formatDateTime(data.startTime) : 'Jun 11, 2025 9:37 AM';
  const stationName = data.stationName || 'Genso Charging Station,\nSouthern Highway, Welipenna';
  const vehicle = data.vehicle || 'Hyundai Kona Electric (SUV)';
  const startTime = data.startTime ? formatDateTime(data.startTime) : '9:37 AM';
const endTime = data.endTime ? formatDateTime(data.endTime) : '10:00 AM';

  const duration = data.durationMinutes ? formatDuration(data.durationMinutes): '1 Hr 23 Mins';
  const energy = data.totalEnergy ? `${data.totalEnergy} kWh` : '69.17 kWh';
  const costPerKwh = data.costPerKwh ? `LKR ${data.costPerKwh}` : 'LKR 55.00';
  const subtotal = data.totalCost ? `${data.totalCost}` : 'LKR 3,806.35';
  const bookingFee = data.bookingFee || 'LKR 100.00';
  const noShow = data.noShow || '–';

  // Convert and calculate total
  const subtotalValue = parseFloat((data.totalCost || '0').replace(/[^\d.]/g, ''));
  const bookingFeeValue = parseFloat((data.bookingFee || '0').replace(/[^\d.]/g, ''));
  const totalCostValue = subtotalValue + bookingFeeValue;
  const total = `LKR ${totalCostValue.toFixed(2)}`;

  // Function to generate and download PDF
  const createAndDownloadPDF = async () => {
    try {
      // HTML content for the PDF
      const htmlContent = `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                padding: 20px;
                color: #333;
              }
              .header {
                text-align: center;
                background-color: #00A3AD;
                color: white;
                padding: 20px;
                border-radius: 10px;
              }
              .title {
                font-size: 18px;
                font-weight: bold;
              }
              .amount {
                font-size: 24px;
                font-weight: bold;
                margin-top: 10px;
              }
              .card {
                margin-top: 20px;
                padding: 20px;
                border: 1px solid #ddd;
                border-radius: 10px;
              }
              .row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
              }
              .label {
                font-size: 14px;
                color: #666;
              }
              .value {
                font-size: 14px;
                font-weight: bold;
                text-align: right;
              }
              .total-label {
                font-size: 16px;
                font-weight: bold;
              }
              .total-value {
                font-size: 16px;
                font-weight: bold;
                color: #00A3AD;
              }
              .divider {
                border-bottom: 1px solid #ddd;
                margin: 10px 0;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="title">Billing Summary</div>
              <div class="amount">${total}</div>
            </div>
            <div class="card">
              <div class="row">
                <span class="label">Session ID:</span>
                <span class="value">${sessionId}</span>
              </div>
              <div class="row">
                <span class="label">Date & Time of Session:</span>
                <span class="value">${dateTime}</span>
              </div>
              <div class="row">
                <span class="label">Charging Station:</span>
                <span class="value">${stationName}</span>
              </div>
              <div class="row">
                <span class="label">Vehicle:</span>
                <span class="value">${vehicle}</span>
              </div>
              <div class="divider"></div>
              <div class="row">
                <span class="label">Start Time & End Time:</span>
                <span class="value">${startTime} – ${endTime}</span>
              </div>
              <div class="row">
                <span class="label">Duration:</span>
                <span class="value">${duration}</span>
              </div>
              <div class="row">
                <span class="label">Energy Delivered (in kWh):</span>
                <span class="value">${energy}</span>
              </div>
              <div class="divider"></div>
              <div class="row">
                <span class="label">Cost per kWh:</span>
                <span class="value">${costPerKwh}</span>
              </div>
              <div class="row">
                <span class="label">Subtotal: Energy Cost:</span>
                <span class="value">${subtotal}</span>
              </div>
              <div class="row">
                <span class="label">Booking Fee:</span>
                <span class="value">${bookingFee}</span>
              </div>
              <div class="row">
                <span class="label">No-show penalties:</span>
                <span class="value">${noShow}</span>
              </div>
              <div class="divider"></div>
              <div class="row">
                <span class="total-label">Total:</span>
                <span class="total-value">${total}</span>
              </div>
            </div>
          </body>
        </html>
      `;

      // Generate PDF
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false,
      });

      // Check if sharing is available
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Save or Share Receipt',
          UTI: 'com.adobe.pdf',
        });
      } else {
        Alert.alert('Error', 'Sharing is not available on this device.');
      }

      // Optionally navigate to Ratings1 screen
      Alert.alert(
        'Download Complete',
        'Your billing summary has been downloaded successfully.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Ratings1'),
            style: 'default',
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error('Error generating PDF:', error);
      Alert.alert('Error', 'Failed to generate or share the PDF.');
    }
  };

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
        <Text style={styles.amount}>{total}</Text>
      </View>

      {/* White Card */}
      <View style={styles.card}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {[
            { label: 'Session ID:', value: sessionId },
            { label: 'Date & Time of Session:', value: dateTime },
            { label: 'Charging Station:', value: stationName },
            { label: 'Vehicle:', value: vehicle },
            { separator: true },
            { label: 'Start Time & End Time:', value: `${startTime} – ${endTime}` },
            { label: 'Duration:', value: duration },
            { label: 'Energy Delivered (in kWh):', value: energy },
            { separator: true },
            { label: 'Cost per kWh :', value: costPerKwh },
            { label: 'Subtotal: Energy Cost:', value: subtotal },
            { label: 'Booking Fee:', value: bookingFee },
            { label: 'No-show penalties:', value: noShow },
            { separator: true },
            { label: 'Total:', value: total, isTotal: true },
          ].map((item, index) =>
            item.separator ? (
              <View key={index} style={styles.divider} />
            ) : (
              <View key={index} style={styles.item}>
                <View style={styles.receiptRow}>
                  <Text style={[styles.label, item.isTotal && styles.totalLabel]}>
                    {item.label}
                  </Text>
                  <Text style={[styles.value, item.isTotal && styles.totalValue]}>
                    {item.value}
                  </Text>
                </View>
              </View>
            )
          )}
        </ScrollView>
      </View>
            {/* Buttons Row */}

      {/* Download Button */}
      <CustomButton
        title="Download PDF"
        type="primary"
        onPress={createAndDownloadPDF}
        style={styles.downloadButton}
        textStyle={styles.downloadText}
      />
      <CustomButton
        title="Done"
        type="primary"
        onPress={() => navigation.navigate('Ratings1')}
        style={styles.doneButton}
        textStyle={styles.doneText}
      />
    </View>
            
  );
};

export default ReceiptScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
    fontFamily: fonts.PlusJakartaSansMedium,
  },
  amount: {
    fontSize: 28,
    fontFamily: fonts.PlusJakartaSansBold,
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
    marginBottom: 40,
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
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.secondaryText,
    flex: 1,
  },
  value: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
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
    fontFamily: fonts.PlusJakartaSansMedium,
  },
  totalValue: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansBold,
  },
  downloadButton: {
    backgroundColor: colors.primary,
    marginHorizontal: 20,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  downloadText: {
    color: colors.white,
    fontFamily: fonts.PlusJakartaSansBold,
    fontSize: 14,
  },
  doneButton: {
    backgroundColor: colors.lightestGray,
    marginHorizontal: 20,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  doneText: {
    color: colors.black,
    fontFamily: fonts.PlusJakartaSansBold,
    fontSize: 14,
  },
});