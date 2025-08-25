import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  Modal,
  ActivityIndicator,
  RefreshControl
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import AppBar from "../../components/AppBar";
import FaultReportCard from "../../components/FaultReportCard";
import InputField from "../../components/InputField";
import CustomButton from "../../components/CustomButton";
import colors from "../../constants/color";
import fonts from "../../constants/fonts";
import { API_BASE_URL } from '@env';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import useUserData from '../../hooks/useUserData';
import * as SecureStore from 'expo-secure-store';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const FaultReport = () => {
  const { user, isLoading: isUserLoading } = useUserData();
  const [activeTab, setActiveTab] = useState("under-review");
  const [showReportModal, setShowReportModal] = useState(false);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const tabs = [
    { id: "under-review", label: "Under Review" },
    { id: "resolved", label: "Resolved" },
    { id: "rejected", label: "Rejected" }
  ];

  useEffect(() => {
    if (user?._id) {
      fetchReports();
    }
  }, [user, activeTab]);

  const fetchReports = async (loadMore = false) => {
    try {
      if (!loadMore) {
        setLoading(true);
        setPage(1);
      }

      const token = await SecureStore.getItemAsync('token');
      const response = await fetch(
        `${API_BASE_URL}/api/reports/get-evowner-reports/${user._id}?status=${activeTab}&page=${loadMore ? page + 1 : 1}&limit=10`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch reports');

      const data = await response.json();
      console.log(data);
      if (data.success) {
        if (loadMore) {
          setReports(prev => [...prev, ...data.data]);
          setPage(prev => prev + 1);
          console.log('Load more:', page + 1);
        } else {
          setReports(data.data);
          setPage(1);
        }
        setHasMore(data.pagination.currentPage < data.pagination.totalPages);
      }

    } catch (error) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: 'Failed to load reports'
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchReports();
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      fetchReports(true);
    }
  };

  const handleReportPress = (report) => {
    router.push({
      pathname: '/pages/FaultReportDetails',
      params: {
        reportId: report._id,
        type: report.type,
        title: report.title
      }
    });
  };

  const getReportDescription = (report) => {
    switch (report.type) {
      case 'station':
        return `Station: ${report.station_id?.station_name || 'Unknown station'}`;
      case 'charger':
        return `Charger: ${report.charger_name || report.charger_details?.charger_name || 'Unknown charger'} at ${report.station_id?.station_name || 'Unknown station'}`;
      case 'booking':
        return `Booking at ${report.booking_id?.charging_station_id?.station_name || 'Unknown station'}`;
      default:
        return report.description || 'No description available';
    }
  };

  const renderContent = () => {
    if (isUserLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading user data...</Text>
        </View>
      );
    }

    if (!user) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Please sign in to view your reports</Text>
          <CustomButton
            title="Go to Sign In"
            onPress={() => router.replace('/pages/SignInScreen')}
            type="primary"
            style={{ marginTop: 20 }}
          />
        </View>
      );
    }

    if (loading && reports.length === 0) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading reports...</Text>
        </View>
      );
    }

    if (reports.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            {activeTab === 'under-review' ? 'No reports under review' :
             activeTab === 'resolved' ? 'No resolved reports' :
             'No rejected reports'}
          </Text>
        </View>
      );
    }

    return (
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
          />
        }
        onScroll={({ nativeEvent }) => {
          if (isCloseToBottom(nativeEvent) && hasMore && !loading) {
            loadMore();
          }
        }}
        scrollEventThrottle={400}
      >
        {reports.map((report) => (
          <TouchableOpacity
            key={report._id}
            onPress={() => handleReportPress(report)}
            activeOpacity={0.7}
          >
            <FaultReportCard
              title={report.title}
              referenceNumber={report._id}
              description={getReportDescription(report)}
              timestamp={new Date(report.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
              status={getStatusText(report.status)}
            />
          </TouchableOpacity>
        ))}
        
        {loading && reports.length > 0 && (
          <View style={styles.loadingMore}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.loadingMoreText}>Loading more reports...</Text>
          </View>
        )}
      </ScrollView>
    );
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'under-review': return 'Processing';
      case 'resolved': return 'Resolved';
      case 'rejected': return 'Rejected';
      default: return 'Processing';
    }
  };

  const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  };

  return (
    <View style={styles.container}>
      <AppBar
        title="Fault Reports"
        onBackPress={() => router.push("/(tabs)")}
      />

      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.activeTab]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.id && styles.activeTabText,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {renderContent()}

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowReportModal(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Report Modal */}
      <Modal
        visible={showReportModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowReportModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Report Fault</Text>
            <TouchableOpacity
              onPress={() => setShowReportModal(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            <CustomButton
              title="Submit Report"
              onPress={() => {
                setShowReportModal(false);
                router.push('/pages/ReportFault');
              }}
              style={styles.submitButton}
            />
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 20,
    backgroundColor: colors.background,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
  },
  activeTabText: {
    color: colors.primary,
    fontFamily: fonts.PlusJakartaSansMedium,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
    marginTop: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
    textAlign: "center",
  },
  loadingMore: {
    padding: 20,
    alignItems: 'center',
  },
  loadingMoreText: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
    marginTop: 8,
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.background,
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 7,
  },
  fabText: {
    fontSize: 28,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.background,
    textAlignVertical: 'center',
    includeFontPadding: false,
    lineHeight: 30,
    marginTop: -6,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.stroke,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.stroke,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 18,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    textAlignVertical: 'center',
    includeFontPadding: false,
    lineHeight: 18,
    marginTop: -6,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  submitButton: {
    marginTop: 20,
    marginBottom: 40,
  },
});

export default FaultReport;