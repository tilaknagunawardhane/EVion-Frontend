import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";
import { router } from "expo-router";
import AppBar from "../../components/AppBar";
import FaultReportCard from "../../components/FaultReportCard";
import InputField from "../../components/InputField";
import CustomButton from "../../components/CustomButton";
import colors from "../../constants/color";
import fonts from "../../constants/fonts";

const FaultReport = () => {
  const [activeTab, setActiveTab] = useState("reported");
  const [showReportModal, setShowReportModal] = useState(false);
  const [stationId, setStationId] = useState("");
  const [chargerId, setChargerId] = useState("");
  const [connector, setConnector] = useState("");
  const [date, setDate] = useState("");

  const reportedByYouData = [
    {
      id: 1,
      title: "Charger occupied by another vehicle",
      referenceNumber: "EVR3456",
      description:
        "The booked charger is occupied by another vehicle, preventing me from starting my session.",
      timestamp: "01 Jul 2025, 09:53 AM",
      status: "Processing",
    },
  ];

  const resolvedByYouData = [
    {
      id: 1,
      title: "Charger occupied by another vehicle",
      referenceNumber: "EVR3456",
      description:
        "You received a compensation credit for the charger issue during your booking.",
      timestamp: "01 Jul 2025, 09:53 AM",
      status: "Resolved",
    },
    {
      id: 2,
      title: "Charger not working",
      referenceNumber: "EVR3456",
      description:
        "You received a compensation credit for the charger issue during your booking.",
      timestamp: "01 Jul 2025, 09:53 AM",
      status: "Resolved",
    },
    {
      id: 3,
      title: "Charger occupied by another vehicle",
      referenceNumber: "EVR3456",
      description:
        "Your report related concerns. False reports may result in action.",
      timestamp: "01 Jul 2025, 09:53 AM",
      status: "Rejected",
    },
  ];

  const handleSubmitReport = () => {
    // Handle report submission logic here
    setShowReportModal(false);
    // Navigate to home page
    router.push("/(tabs)");
  };

  const renderContent = () => {
    const data =
      activeTab === "reported" ? reportedByYouData : resolvedByYouData;

    if (data.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No fault reports found</Text>
        </View>
      );
    }

    return (
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>
          {activeTab === "reported" ? "Processing" : "Resolved"}
        </Text>
        {data.map((item) => (
          <FaultReportCard
            key={item.id}
            title={item.title}
            referenceNumber={item.referenceNumber}
            description={item.description}
            timestamp={item.timestamp}
            status={item.status}
          />
        ))}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <AppBar
        title="Fault Reports"
        onBackPress={() => router.push("/(tabs)")}
      />

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "reported" && styles.activeTab]}
          onPress={() => setActiveTab("reported")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "reported" && styles.activeTabText,
            ]}
          >
            Reported by you
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "resolved" && styles.activeTab]}
          onPress={() => setActiveTab("resolved")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "resolved" && styles.activeTabText,
            ]}
          >
            Resolved by you
          </Text>
        </TouchableOpacity>
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
            <InputField
              label="Station Id"
              value={stationId}
              onChangeText={setStationId}
              placeholder="Enter station ID"
            />

            <InputField
              label="Charger Id"
              value={chargerId}
              onChangeText={setChargerId}
              placeholder="Enter charger ID"
            />

            <InputField
              label="Connector"
              value={connector}
              onChangeText={setConnector}
              placeholder="Enter connector"
            />

            <InputField
              label="Date"
              value={date}
              onChangeText={setDate}
              placeholder="Enter date"
            />

            <CustomButton
              title="Submit Report"
              onPress={handleSubmitReport}
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
  sectionTitle: {
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.mainTextColor,
    marginHorizontal: 16,
    marginBottom: 12,
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
    textAlignVertical: 'center', // Add this
    includeFontPadding: false,   // Add this to remove extra padding
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
    textAlignVertical: 'center', // Add this
    includeFontPadding: false,   // Add this to remove extra padding
    lineHeight: 18,              // Match lineHeight with fontSize
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
