import React from "react";
import { View, Text, StyleSheet } from "react-native";
import colors from "../constants/color";
import fonts from "../constants/fonts";

const FaultReportCard = ({
  title,
  referenceNumber,
  description,
  timestamp,
  status = "Processing",
}) => {
  const getStatusColor = () => {
    switch (status) {
      case "Processing":
        return colors.primary;
      case "Resolved":
        return colors.HighlightText;
      case "Rejected":
        return colors.danger;
      default:
        return colors.primary;
    }
  };

  const getStatusBackgroundColor = () => {
    switch (status) {
      case "Processing":
        return colors.bgGreen;
      case "Resolved":
        return "#FFF5E6";
      case "Rejected":
        return "#FFE6E6";
      default:
        return colors.bgGreen;
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusBackgroundColor() },
          ]}
        >
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            {status}
          </Text>
        </View>
      </View>

      <Text style={styles.reference}>
        Reference no.{" "}
        <Text style={styles.referenceNumber}>#{referenceNumber}</Text>
      </Text>

      <Text
        style={[
          styles.description,
          status === "Processing" && styles.processingDescription,
        ]}
      >
        {description}
      </Text>

      <Text style={styles.timestamp}>{timestamp}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.mainTextColor,
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontFamily: fonts.PlusJakartaSansMedium,
  },
  reference: {
    fontSize: 12,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
    marginBottom: 8,
  },
  referenceNumber: {
    color: colors.mainTextColor,
  },
  description: {
    fontSize: 13,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
    lineHeight: 18,
    marginBottom: 12,
  },
  processingDescription: {
    color: colors.mainTextColor,
  },
  timestamp: {
    fontSize: 11,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
    textAlign: "right",
  },
});

export default FaultReportCard;
