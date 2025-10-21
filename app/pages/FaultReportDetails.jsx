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
import Svg, { Path, Circle, Rect } from 'react-native-svg';

// SVG Icon Components
function CheckmarkCircleIcon({ size = 16, color = colors.primary }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2"/>
      <Path d="M8 12L11 15L16 9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );
}

function CloseCircleIcon({ size = 16, color = colors.danger }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2"/>
      <Path d="M15 9L9 15M9 9L15 15" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </Svg>
  );
}

function TimeIcon({ size = 16, color = colors.secondary }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2"/>
      <Path d="M12 6V12L16 14" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </Svg>
  );
}

function DocumentTextIcon({ size = 16, color = colors.secondaryText }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M14 2V8H20" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M16 13H8" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <Path d="M16 17H8" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <Path d="M10 9H9H8" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </Svg>
  );
}

function AlertCircleIcon({ size = 48, color = colors.danger }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2"/>
      <Path d="M12 8V12" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <Path d="M12 16H12.01" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </Svg>
  );
}

function PricetagIcon({ size = 20, color = colors.primary }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M20.59 13.41L13.42 20.58C13.2343 20.766 13.0137 20.9135 12.7709 21.0141C12.5281 21.1148 12.2678 21.1666 12.005 21.1666C11.7422 21.1666 11.4819 21.1148 11.2391 21.0141C10.9963 20.9135 10.7757 20.766 10.59 20.58L2 12V2H12L20.59 10.59C20.9625 10.9646 21.1716 11.4716 21.1716 12C21.1716 12.5284 20.9625 13.0354 20.59 13.41Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Circle cx="9" cy="9" r="1" fill={color}/>
    </Svg>
  );
}

function CalendarIcon({ size = 20, color = colors.primary }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke={color} strokeWidth="2"/>
      <Path d="M16 2V6" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <Path d="M8 2V6" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <Path d="M3 10H21" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </Svg>
  );
}

function CheckmarkDoneIcon({ size = 20, color = colors.primary }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M9 12L11 14L15 10M12 3C13.1819 3 14.3522 3.23279 15.4442 3.68508C16.5361 4.13738 17.5282 4.80031 18.364 5.63604C19.1997 6.47177 19.8626 7.46392 20.3149 8.55585C20.7672 9.64778 21 10.8181 21 12C21 13.1819 20.7672 14.3522 20.3149 15.4442C19.8626 16.5361 19.1997 17.5282 18.364 18.364C17.5282 19.1997 16.5361 19.8626 15.4442 20.3149C14.3522 20.7672 13.1819 21 12 21C10.8181 21 9.64778 20.7672 8.55585 20.3149C7.46392 19.8626 6.47177 19.1997 5.63604 18.364C4.80031 17.5282 4.13738 16.5361 3.68508 15.4442C3.23279 14.3522 3 13.1819 3 12C3 9.61305 3.94821 7.32387 5.63604 5.63604C7.32387 3.94821 9.61305 3 12 3Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );
}

function PersonIcon({ size = 20, color = colors.primary }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );
}

function BusinessIcon({ size = 20, color = colors.primary }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M9 21V13H15V21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M9 7H9.01" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <Path d="M15 7H15.01" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </Svg>
  );
}

function LocationIcon({ size = 20, color = colors.primary }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 21C15.5 17.4 19 14.1764 19 10.2C19 6.22355 15.7764 3 12 3C8.22355 3 5 6.22355 5 10.2C5 14.1764 8.5 17.4 12 21Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Circle cx="12" cy="10" r="3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );
}

function FlashIcon({ size = 20, color = colors.primary }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M13 2L4.093 12.688C3.749 13.106 3.577 13.315 3.567 13.492C3.558 13.647 3.625 13.797 3.747 13.896C3.888 14 4.143 14 4.652 14H12L11 22L19.907 11.312C20.251 10.894 20.423 10.685 20.433 10.508C20.442 10.353 20.375 10.203 20.253 10.104C20.112 10 19.857 10 19.348 10H12L13 2Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );
}

function BatteryChargingIcon({ size = 20, color = colors.primary }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M9 12L11 14L15 10M12 3C13.1819 3 14.3522 3.23279 15.4442 3.68508C16.5361 4.13738 17.5282 4.80031 18.364 5.63604C19.1997 6.47177 19.8626 7.46392 20.3149 8.55585C20.7672 9.64778 21 10.8181 21 12C21 13.1819 20.7672 14.3522 20.3149 15.4442C19.8626 16.5361 19.1997 17.5282 18.364 18.364C17.5282 19.1997 16.5361 19.8626 15.4442 20.3149C14.3522 20.7672 13.1819 21 12 21C10.8181 21 9.64778 20.7672 8.55585 20.3149C7.46392 19.8626 6.47177 19.1997 5.63604 18.364C4.80031 17.5282 4.13738 16.5361 3.68508 15.4442C3.23279 14.3522 3 13.1819 3 12C3 9.61305 3.94821 7.32387 5.63604 5.63604C7.32387 3.94821 9.61305 3 12 3Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );
}

function SpeedometerIcon({ size = 20, color = colors.primary }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2V4M12 20V22M4 12H2M6.314 6.314L4.9 4.9M17.686 6.314L19.1 4.9M6.314 17.69L4.9 19.104M17.686 17.69L19.1 19.104M22 12H20" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <Circle cx="12" cy="12" r="4" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </Svg>
  );
}

function ReceiptIcon({ size = 20, color = colors.primary }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 4C4 3.46957 4.21071 2.96086 4.58579 2.58579C4.96086 2.21071 5.46957 2 6 2H18C18.5304 2 19.0391 2.21071 19.4142 2.58579C19.7893 2.96086 20 3.46957 20 4V21L17.5 19.5L15 21L12.5 19.5L10 21L7.5 19.5L5 21V4Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M8 7H16" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <Path d="M8 11H16" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <Path d="M8 15H12" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </Svg>
  );
}

function CashIcon({ size = 20, color = colors.primary }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="2" y="6" width="20" height="12" rx="2" stroke={color} strokeWidth="2"/>
      <Circle cx="12" cy="12" r="2" stroke={color} strokeWidth="2"/>
      <Path d="M6 12H6.01M18 12H18.01" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </Svg>
  );
}

function CardIcon({ size = 20, color = colors.primary }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="2" y="5" width="20" height="14" rx="2" stroke={color} strokeWidth="2"/>
      <Path d="M2 10H22" stroke={color} strokeWidth="2"/>
    </Svg>
  );
}

function DocumentAttachIcon({ size = 20, color = colors.primary }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M14 2V8H20" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M10 16V10C10 9.46957 10.2107 8.96086 10.5858 8.58579C10.9609 8.21071 11.4696 8 12 8C12.5304 8 13.0391 8.21071 13.4142 8.58579C13.7893 8.96086 14 9.46957 14 10V16C14 17.1046 13.1046 18 12 18C10.8954 18 10 17.1046 10 16Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );
}

function OpenOutlineIcon({ size = 16, color = colors.secondaryText }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M18 13V19C18 19.5304 17.7893 20.0391 17.4142 20.4142C17.0391 20.7893 16.5304 21 16 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V8C3 7.46957 3.21071 6.96086 3.58579 6.58579C3.96086 6.21071 4.46957 6 5 6H11" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M15 3H21V9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M10 14L21 3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );
}

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
      case 'resolved': return CheckmarkCircleIcon;
      case 'rejected': return CloseCircleIcon;
      case 'under-review': return TimeIcon;
      default: return DocumentTextIcon;
    }
  };

  const renderDetailSection = (title, children) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  const renderInfoCard = (label, value, IconComponent = null) => (
    <View style={styles.infoCard}>
      {IconComponent && (
        <IconComponent 
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
          <AlertCircleIcon size={48} color={colors.danger} />
          <Text style={styles.errorText}>Report not found</Text>
          <Text style={styles.errorSubtext}>The requested report could not be loaded.</Text>
        </View>
      </View>
    );
  }

  const StatusIconComponent = getStatusIcon(report.status);

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
              <StatusIconComponent 
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
                {renderInfoCard('Report Type', capitalizeFirstLetter(type), DocumentTextIcon)}
                {renderInfoCard('Category', report.category, PricetagIcon)}
                {renderInfoCard('Created On', new Date(report.createdAt).toLocaleString(), CalendarIcon)}
                {renderInfoCard('Status', getStatusText(report.status), getStatusIcon(report.status))}
                
                {report.resolved_at && (
                  renderInfoCard('Resolved On', new Date(report.resolved_at).toLocaleString(), CheckmarkDoneIcon)
                )}
                
                {report.resolved_by && (
                  renderInfoCard('Resolved By', report.resolved_by?.name || 'Support Team', PersonIcon)
                )}
              </View>
            ))}

            {renderDetailSection('Description', (
              <View style={styles.descriptionContainer}>
                <DocumentTextIcon size={20} color={colors.primary} style={styles.descIcon} />
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
                  {renderInfoCard('Station Name', report.station_id.station_name, BusinessIcon)}
                  {renderInfoCard('Address', `${report.station_id.address}, ${report.station_id.city}`, LocationIcon)}
                </View>
              ))
            )}

            {report.charger_id && (
              renderDetailSection('Charger Details', (
                <View style={styles.infoGrid}>
                  {renderInfoCard('Charger Name', report.charger_details.charger_name, FlashIcon)}
                  {renderInfoCard('Power Type', report.charger_details.power_type, BatteryChargingIcon)}
                  {renderInfoCard('Max Output', report.charger_details.max_power_output ? `${report.charger_details.max_power_output} kW` : 'N/A', SpeedometerIcon)}
                </View>
              ))
            )}

            {report.booking_id && (
              renderDetailSection('Booking Details', (
                <View style={styles.infoGrid}>
                  {renderInfoCard('Booking ID', report.booking_id._id, ReceiptIcon)}
                  {renderInfoCard('Booking Date', new Date(report.booking_id.booking_date).toLocaleDateString(), CalendarIcon)}
                  {renderInfoCard('Status', capitalizeFirstLetter(report.booking_id.status), TimeIcon)}
                  {renderInfoCard('Cost', report.booking_id.cost ? `Rs ${report.booking_id.cost}` : 'N/A', CashIcon)}
                </View>
              ))
            )}

            {/* Resolution Details */}
            {report.status === 'resolved' && report.action && (
              renderDetailSection('Resolution Details', (
                <View style={styles.resolutionContainer}>
                  <CheckmarkDoneIcon size={20} color={colors.primary} style={styles.resolutionIcon} />
                  <Text style={styles.resolutionText}>{report.action}</Text>
                </View>
              ))
            )}

            {report.status === 'rejected' && report.rejected_reason && (
              renderDetailSection('Rejection Details', (
                <View style={styles.rejectionContainer}>
                  <CloseCircleIcon size={20} color={colors.danger} style={styles.rejectionIcon} />
                  <Text style={styles.rejectionText}>{report.rejected_reason}</Text>
                </View>
              ))
            )}

            {report.refund_amount && (
              renderDetailSection('Refund Information', (
                <View style={styles.refundContainer}>
                  <CardIcon size={20} color={colors.primary} style={styles.refundIcon} />
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
                      <DocumentAttachIcon size={20} color={colors.primary} />
                      <Text style={styles.attachmentText}>Attachment {index + 1}</Text>
                      <OpenOutlineIcon size={16} color={colors.secondaryText} />
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