import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import colors from '../../../../constants/color';
import fonts from '../../../../constants/fonts';

const userAvatar = require('../../../../assets/Ptofile.png');

const ManageAccountScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Basic Info');

  const [fields, setFields] = useState({
    name: 'Vishwani Vilocha',
    email: 'vishwani200',
    contact: '+94 71 597 1236',
    homeAddress: 'Your home address',
    workPlace: 'Your work place address',
    password: '********',
    recoveryPhone: '+94 71 234 5678',
  });

  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState('');

  const handleEdit = (fieldKey) => {
    setEditingField(fieldKey);
    setTempValue(fields[fieldKey]);
  };

  const handleUpdate = (fieldKey) => {
    if (fieldKey === 'homeAddress') {
      navigation.navigate('pages/Profile/ManageAccount/Address'); 
      return;
    }
    setFields({ ...fields, [fieldKey]: tempValue });
    setEditingField(null);
  };
  

  const renderEditableField = (label, fieldKey) => (
    <View style={styles.fieldContainer} key={fieldKey}>
      <View style={styles.fieldHeader}>
        <Text style={styles.fieldLabel}>{label}</Text>
        {editingField !== fieldKey && (
          <TouchableOpacity
            onPress={() => handleEdit(fieldKey)}
            style={styles.editIconBtn}
          >
            <Ionicons name="pencil" size={14} color={colors.mainTextColor} />
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        )}
      </View>

      {editingField === fieldKey ? (
        <>
          <TextInput
            style={styles.input}
            value={tempValue}
            onChangeText={setTempValue}
            placeholder={label}
            secureTextEntry={fieldKey === 'password'}
          />
          <TouchableOpacity
            onPress={() => handleUpdate(fieldKey)}
            style={styles.updateButton}
          >
            <Text style={styles.updateButtonText}>Update</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.fieldValue}>{fields[fieldKey]}</Text>
      )}
    </View>
  );

  const renderTabContent = () => {
    if (activeTab === 'Basic Info') {
      return (
        <>
          <View style={styles.avatarContainer}>
            <Image source={userAvatar} style={styles.avatar} />
            <TouchableOpacity style={styles.editAvatar}>
              <Ionicons name="pencil" size={16} color={colors.white} />
            </TouchableOpacity>
          </View>

          {renderEditableField('Name', 'name')}
          {renderEditableField('Email Address', 'email')}
          {renderEditableField('Contact Number', 'contact')}
          {renderEditableField('Home Address', 'homeAddress')}
          {renderEditableField('Work Place', 'workPlace')}
        </>
      );
    }

    if (activeTab === 'Sign In Info') {
      return (
        <View style={{ marginTop: 24 }}>
          <TouchableOpacity
            style={styles.signinItem}
            onPress={() => navigation.navigate('pages/Profile/ManageAccount/UpdateEmailScreen', { currentEmail: fields.email })}
          >
            <View>
              <Text style={styles.signinLabel}>Email Address</Text>
              <Text style={styles.signinValue}>{fields.email}@gmail.com</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.secondaryText}
            />
          </TouchableOpacity>
        </View>
      );
    }

    if (activeTab === 'Security') {
      return (
        <View style={{ marginTop: 24 }}>
          <TouchableOpacity style={styles.signinItem}>
            <Text style={styles.signinLabel}>Password</Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.secondaryText}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.signinItem}>
            <Text style={styles.signinLabel}>Recovery Phone Number</Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.secondaryText}
            />
          </TouchableOpacity>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={24} color={colors.mainTextColor} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Account</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.tabs}>
        {['Basic Info', 'Sign In Info', 'Security'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabItem, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
            {activeTab === tab && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {renderTabContent()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 56,
    paddingBottom: 16,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
    marginHorizontal: 16,
  },
  tabItem: {
    marginRight: 24,
    paddingVertical: 8,
  },
  tabText: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
  },
  activeTabText: {
    color: colors.primary,
    fontFamily: fonts.PlusJakartaSansBold,
  },
  activeIndicator: {
    height: 2,
    backgroundColor: colors.primary,
    marginTop: 4,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 400,
  },
  avatarContainer: {
    alignSelf: 'center',
    position: 'relative',
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: colors.lightGray,
  },
  editAvatar: {
    position: 'absolute',
    bottom: 0,
    right: -4,
    backgroundColor: colors.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldContainer: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
    paddingBottom: 8,
  },
  fieldHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fieldLabel: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
  },
  editIconBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#CED4DA',
    borderRadius: 14,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  editText: {
    marginLeft: 4,
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.mainTextColor,
  },
  updateButton: {
    marginTop: 8,
    backgroundColor: '#E6FAF0',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  updateButtonText: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.primary,
  },
  fieldValue: {
    marginTop: 4,
    fontSize: 15,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
  },
  input: {
    marginTop: 4,
    fontSize: 15,
    fontFamily: fonts.PlusJakartaSans,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
    paddingVertical: 4,
    color: colors.mainTextColor,
  },
  signinItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
    paddingHorizontal: 4,
  },
  signinLabel: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
  },
  signinValue: {
    fontSize: 15,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
  },
});

export default ManageAccountScreen;
