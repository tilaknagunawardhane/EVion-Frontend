import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import colors from '../../../constants/color';
import fonts from '../../../constants/fonts';
import AppBar from '../../../components/AppBar';

const PrivacyPolicyScreen = () => {
  return (
    <View style={styles.container}>
      <AppBar title="Privacy Policy" showBackButton />

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.listContainer}>
          <Text style={styles.listItem}>1. Introduction</Text>
          <Text style={styles.listItem}>2. Overview</Text>
          <Text style={styles.listItem}>3. Data Collection</Text>
          <Text style={styles.listItem}>4. Choice and transparency</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Introduction</Text>
          <Text style={styles.sectionText}>
            At Evion, we value your trust and are dedicated to protecting your
            personal information. This Privacy Notice explains how we handle
            your data when you use our services, ensuring transparency and
            compliance with data protection regulations. Our goal is to create a
            secure environment where you can confidently manage your pet’s
            needs.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Overview</Text>
          <Text style={styles.sectionText}>
            This Privacy Notice outlines the data practices of Evion, including
            what information we collect, how we use it, and the choices
            available to you. By using our app, you consent to the practices
            described here. The information we collect helps us provide
            personalized services like charging station suggestions, route
            suggestions, bookings reminders, and vehicle care tips while
            ensuring a smooth app experience.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Data Collection and uses</Text>
          <Text style={styles.sectionText}>
            We collect and process the following types of data:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>
              • <Text style={styles.bold}>Personal Information:</Text> This includes your name, contact details, and vehicle information like name, make, model, type, battery data.
            </Text>
            <Text style={styles.bulletItem}>
              • <Text style={styles.bold}>Usage Data:</Text> Information about your interactions with the app, such as activities logged, pages visited, and features used.
            </Text>
            <Text style={styles.bulletItem}>
              • <Text style={styles.bold}>Device Information:</Text> Technical data, including your device type, operating system, app version, and IP address, to enhance app performance and resolve technical issues.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Choice and Transparency</Text>
          <Text style={styles.sectionText}>
            We believe in giving you control over your personal information. You
            can:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Access and Update: Review and update your personal data through the app.</Text>
            <Text style={styles.bulletItem}>• Manage Preferences: Enable or disable features such as notifications and location tracking.</Text>
            <Text style={styles.bulletItem}>• Delete Your Data: Request the removal of your personal information by contacting us at evionsupport@gmail.com.</Text>
          </View>
          <Text style={styles.sectionText}>
            We strive to provide clear explanations about how your data is used and ensure that any changes to our privacy practices are communicated to you promptly.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  contentContainer: {
    padding: 16,
    paddingBottom: 120,
  },
  listContainer: {
    marginBottom: 16,
  },
  listItem: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.mainTextColor,
    marginBottom: 6,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    marginBottom: 6,
  },
  sectionText: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.mainTextColor,
    lineHeight: 20,
  },
  bulletList: {
    marginTop: 6,
    paddingLeft: 12,
  },
  bulletItem: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.mainTextColor,
    marginBottom: 6,
    lineHeight: 20,
  },
  bold: {
    fontFamily: fonts.PlusJakartaSansBold,
  },
});

export default PrivacyPolicyScreen;
