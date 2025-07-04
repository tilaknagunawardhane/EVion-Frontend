import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import colors from '../../constants/color';
import fonts from '../../constants/fonts';

const Profile1 = () => {
  const [activeTab, setActiveTab] = useState('Basic Info');

  const tabs = ['Basic Info', 'Signin Info', 'Security'];

  const handleBackPress = () => {
    router.back();
  };

  const handleTabPress = (tab) => {
    setActiveTab(tab);
  };

  const renderBasicInfo = () => (
    <View style={styles.contentContainer}>
      {/* Profile Avatar */}
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={30} color={colors.secondaryText} />
        </View>
        <View style={styles.editIconContainer}>
          <Ionicons name="pencil" size={12} color="#ffffff" />
        </View>
      </View>

      {/* Profile Fields */}
      <View style={styles.fieldsContainer}>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Name</Text>
          <View style={styles.fieldContent}>
            <Text style={styles.fieldValue}>Vishwam Vilochana</Text>
            <TouchableOpacity style={styles.editButton}>
              <Ionicons name="pencil" size={16} color={colors.secondaryText} />
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Email Address</Text>
          <View style={styles.fieldContent}>
            <Text style={styles.fieldValue}>vishwam2002@gmail.com</Text>
            <TouchableOpacity style={styles.editButton}>
              <Ionicons name="pencil" size={16} color={colors.secondaryText} />
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Contact Number</Text>
          <View style={styles.fieldContent}>
            <Text style={styles.fieldValue}>+94 71 597 1236</Text>
            <TouchableOpacity style={styles.editButton}>
              <Ionicons name="pencil" size={16} color={colors.secondaryText} />
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Home Address</Text>
          <View style={styles.fieldContent}>
            <Text style={styles.fieldValue}>Your home address</Text>
            <TouchableOpacity style={styles.editButton}>
              <Ionicons name="pencil" size={16} color={colors.secondaryText} />
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Work Place</Text>
          <View style={styles.fieldContent}>
            <Text style={styles.fieldValue}>Your work place address</Text>
            <TouchableOpacity style={styles.editButton}>
              <Ionicons name="pencil" size={16} color={colors.secondaryText} />
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  const renderSigninInfo = () => (
    <View style={styles.contentContainer}>
      <TouchableOpacity style={styles.listItem}>
        <Text style={styles.listItemText}>Email Address</Text>
        <View style={styles.listItemRight}>
          <Text style={styles.listItemValue}>vishwam2002@gmail.com</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.secondaryText} />
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderSecurity = () => (
    <View style={styles.contentContainer}>
      <TouchableOpacity style={styles.listItem}>
        <Text style={styles.listItemText}>Password</Text>
        <Ionicons name="chevron-forward" size={20} color={colors.secondaryText} />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.listItem}>
        <Text style={styles.listItemText}>Recovery Phone Number</Text>
        <Ionicons name="chevron-forward" size={20} color={colors.secondaryText} />
      </TouchableOpacity>
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'Basic Info':
        return renderBasicInfo();
      case 'Signin Info':
        return renderSigninInfo();
      case 'Security':
        return renderSecurity();
      default:
        return renderBasicInfo();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.mainTextColor} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Account</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              activeTab === tab && styles.activeTab
            ]}
            onPress={() => handleTabPress(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText
              ]}
            >
              {tab}
            </Text>
            {activeTab === tab && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.background,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.mainTextColor,
    textAlign: 'center',
    flex: 1,
  },
  placeholder: {
    width: 40,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    position: 'relative',
  },
  activeTab: {
    // Active tab styling handled by indicator
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
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: colors.primary,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 40,
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.stroke,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: '35%',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fieldsContainer: {
    gap: 24,
  },
  field: {
    gap: 8,
  },
  fieldLabel: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.mainTextColor,
  },
  fieldContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.stroke,
  },
  fieldValue: {
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.mainTextColor,
    flex: 1,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  editText: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.stroke,
  },
  listItemText: {
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.mainTextColor,
  },
  listItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  listItemValue: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
  },
});

export default Profile1;