// FaultReportDetails.jsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  useWindowDimensions
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import AppBar from '../../components/AppBar';
import colors from '../../constants/color';
import fonts from '../../constants/fonts';
import { API_BASE_URL } from '@env';
import * as SecureStore from 'expo-secure-store';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import useUserData from '../../hooks/useUserData';
import { Ionicons } from '@expo/vector-icons';

const FaultReportDetails = () => {
  const params = useLocalSearchParams();
  const { reportId, type, title } = params;
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, isLoading: isUserLoading } = useUserData();
  const { width } = useWindowDimensions();
  
  const isLargeScreen = width > 768;

  useEffect(() => {
    if (user?._id && reportId && type) {
      fetchReportDetails();
    }
  }, [reportId, type, user]);

  const fetchReportDetails = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      
      const response = await fetch(
        `${API_BASE_URL}/api/reports/get-evowner-report-details/${user._id}/${type}/${reportId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch report details');
      }

      if (data.success) {
        setReport(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch report details');
      }
    } catch (error) {
      console.error('Error fetching report details:', error);
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: error.message || 'Failed to load report details'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved': return colors.primary;
      case 'rejected': return colors.danger;
      case 'under-review': return colors.secondary;
      default: return colors.secondaryText;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'resolved': return 'checkmark-circle';
      case 'rejected': return 'close-circle';
      case 'under-review': return 'time';
      default: return 'document-text';
    }
  };

  const renderDetailSection = (title, children) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  const renderInfoCard = (label, value, icon = null) => (
    <View style={styles.infoCard}>
      {icon && (
        <Ionicons 
          name={icon} 
          size={20} 
          color={colors.primary} 
          style={styles.infoIcon} 
        />
      )}
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue} numberOfLines={2}>{value || 'N/A'}</Text>
      </View>
    </View>
  );

  if (loading || isUserLoading) {
    return (
      <View style={styles.container}>
        <AppBar title="Report Details" onBackPress={() => router.back()} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading report details...</Text>
        </View>
      </View>
    );
  }

  if (!report) {
    return (
      <View style={styles.container}>
        <AppBar title="Report Details" onBackPress={() => router.back()} />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color={colors.danger} />
          <Text style={styles.errorText}>Report not found</Text>
          <Text style={styles.errorSubtext}>The requested report could not be loaded.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppBar onBackPress={() => router.back()} />
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>{report.category || 'Fault Report'}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(report.status) + '20' }]}>
              <Ionicons 
                name={getStatusIcon(report.status)} 
                size={16} 
                color={getStatusColor(report.status)} 
              />
              <Text style={[styles.statusText, { color: getStatusColor(report.status) }]}>
                {getStatusText(report.status)}
              </Text>
            </View>
          </View>
          <Text style={styles.reportId}>ID: {report._id}</Text>
        </View>

        {/* Main Content Grid */}
        <View style={[styles.grid, isLargeScreen && styles.gridLarge]}>
          {/* Left Column - Report Details */}
          <View style={styles.column}>
            {renderDetailSection('Report Information', (
              <View style={styles.infoGrid}>
                {renderInfoCard('Report Type', capitalizeFirstLetter(type), 'document-text')}
                {renderInfoCard('Category', report.category, 'pricetag')}
                {renderInfoCard('Created On', new Date(report.createdAt).toLocaleString(), 'calendar')}
                {renderInfoCard('Status', getStatusText(report.status), getStatusIcon(report.status))}
                
                {report.resolved_at && (
                  renderInfoCard('Resolved On', new Date(report.resolved_at).toLocaleString(), 'checkmark-done')
                )}
                
                {report.resolved_by && (
                  renderInfoCard('Resolved By', report.resolved_by?.name || 'Support Team', 'person')
                )}
              </View>
            ))}

            {renderDetailSection('Description', (
              <View style={styles.descriptionContainer}>
                <Ionicons name="document-text" size={20} color={colors.primary} style={styles.descIcon} />
                <Text style={styles.description}>{report.description}</Text>
              </View>
            ))}
          </View>

          {/* Right Column - Additional Details */}
          <View style={styles.column}>
            {/* Station/Charger/Booking Specific Details */}
            {report.station_id && (
              renderDetailSection('Station Details', (
                <View style={styles.infoGrid}>
                  {renderInfoCard('Station Name', report.station_id.station_name, 'business')}
                  {renderInfoCard('Address', `${report.station_id.address}, ${report.station_id.city}`, 'location')}
                  {/* {report.station_id.district && (
                    renderInfoCard('District', report.station_id.district, 'map')
                  )} */}
                </View>
              ))
            )}

            {report.charger_id && (
              renderDetailSection('Charger Details', (
                <View style={styles.infoGrid}>
                  {renderInfoCard('Charger Name', report.charger_details.charger_name, 'flash')}
                  {renderInfoCard('Power Type', report.charger_details.power_type, 'battery-charging')}
                  {renderInfoCard('Max Output', report.charger_details.max_power_output ? `${report.charger_details.max_power_output} kW` : 'N/A', 'speedometer')}
                </View>
              ))
            )}

            {report.booking_id && (
              renderDetailSection('Booking Details', (
                <View style={styles.infoGrid}>
                  {renderInfoCard('Booking ID', report.booking_id._id, 'receipt')}
                  {renderInfoCard('Booking Date', new Date(report.booking_id.booking_date).toLocaleDateString(), 'calendar')}
                  {renderInfoCard('Status', capitalizeFirstLetter(report.booking_id.status), 'time')}
                  {renderInfoCard('Cost', report.booking_id.cost ? `Rs ${report.booking_id.cost}` : 'N/A', 'cash')}
                </View>
              ))
            )}

            {/* Resolution Details */}
            {report.status === 'resolved' && report.action && (
              renderDetailSection('Resolution Details', (
                <View style={styles.resolutionContainer}>
                  <Ionicons name="checkmark-done" size={20} color={colors.primary} style={styles.resolutionIcon} />
                  <Text style={styles.resolutionText}>{report.action}</Text>
                </View>
              ))
            )}

            {report.status === 'rejected' && report.rejected_reason && (
              renderDetailSection('Rejection Details', (
                <View style={styles.rejectionContainer}>
                  <Ionicons name="close-circle" size={20} color={colors.danger} style={styles.rejectionIcon} />
                  <Text style={styles.rejectionText}>{report.rejected_reason}</Text>
                </View>
              ))
            )}

            {report.refund_amount && (
              renderDetailSection('Refund Information', (
                <View style={styles.refundContainer}>
                  <Ionicons name="card" size={20} color={colors.primary} style={styles.refundIcon} />
                  <Text style={styles.refundText}>Refund Amount:  Rs {report.refund_amount}</Text>
                  <Text style={styles.refundSubtext}>Processed on {new Date(report.resolved_at).toLocaleDateString()}</Text>
                </View>
              ))
            )}

            {/* Attachments */}
            {report.attachments && report.attachments.length > 0 && (
              renderDetailSection('Attachments', (
                <View style={styles.attachmentsContainer}>
                  {report.attachments.map((attachment, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => Linking.openURL(attachment)}
                      style={styles.attachmentButton}
                    >
                      <Ionicons name="document-attach" size={20} color={colors.primary} />
                      <Text style={styles.attachmentText}>Attachment {index + 1}</Text>
                      <Ionicons name="open-outline" size={16} color={colors.secondaryText} />
                    </TouchableOpacity>
                  ))}
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const getStatusText = (status) => {
  switch (status) {
    case 'under-review': return 'Under Review';
    case 'resolved': return 'Resolved';
    case 'rejected': return 'Rejected';
    default: return capitalizeFirstLetter(status);
  }
};

const capitalizeFirstLetter = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.secondaryText,
    fontFamily: fonts.PlusJakartaSans,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: colors.danger,
    fontFamily: fonts.PlusJakartaSansBold,
    marginTop: 16,
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: colors.secondaryText,
    fontFamily: fonts.PlusJakartaSans,
    textAlign: 'center',
  },
  header: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.stroke,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  title: {
    fontSize: 20,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  statusText: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
  },
  reportId: {
    fontSize: 12,
    color: colors.secondaryText,
    fontFamily: fonts.PlusJakartaSans,
  },
  grid: {
    gap: 20,
  },
  gridLarge: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  column: {
    flex: 1,
    gap: 20,
    minWidth: 300,
  },
  section: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.stroke,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    marginBottom: 16,
  },
  infoGrid: {
    gap: 12,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.stroke,
  },
  infoIcon: {
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.secondaryText,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.mainTextColor,
  },
  descriptionContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  descIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  description: {
    flex: 1,
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.mainTextColor,
    lineHeight: 20,
  },
  resolutionContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.primary + '10',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  resolutionIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  resolutionText: {
    flex: 1,
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.mainTextColor,
    lineHeight: 20,
  },
  rejectionContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.danger + '10',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.danger,
  },
  rejectionIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  rejectionText: {
    flex: 1,
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.mainTextColor,
    lineHeight: 20,
  },
  refundContainer: {
    backgroundColor: colors.primary + '10',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  refundIcon: {
    marginBottom: 8,
  },
  refundText: {
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.primary,
    marginBottom: 4,
  },
  refundSubtext: {
    fontSize: 12,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
  },
  attachmentsContainer: {
    gap: 8,
  },
  attachmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.stroke,
    gap: 8,
  },
  attachmentText: {
    flex: 1,
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.mainTextColor,
  },
});

export default FaultReportDetails;