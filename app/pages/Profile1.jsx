import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar, 
  ScrollView,
  ActivityIndicator,
  Alert,
   TextInput, // Added this import
  Image // Added this import
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import colors from '../../constants/color';
import fonts from '../../constants/fonts';

// Mock API service (replace with your actual API calls)
const ProfileService = {
  getProfile: async () => {
    // Replace with actual API call
    return {
      name: 'Vishwam Vilochana',
      email: 'vishwam2002@gmail.com',
      phone: '+94 71 597 1236',
      homeAddress: 'Your home address',
      workAddress: 'Your work place address',
      avatar: null
    };
  },
  updateProfile: async (data) => {
    // Replace with actual API call
    console.log('Updating profile with:', data);
    return { success: true };
  },
  changePassword: async (currentPassword, newPassword) => {
    // Replace with actual API call
    return { success: true };
  }
};

const ProfileScreen = () => {
  const [activeTab, setActiveTab] = useState('Basic Info');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState('');

  const tabs = ['Basic Info', 'Signin Info', 'Security'];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const profileData = await ProfileService.getProfile();
      setProfile(profileData);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch profile data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackPress = () => {
    router.back();
  };

  const handleTabPress = (tab) => {
    setActiveTab(tab);
    setEditingField(null);
  };

  const startEditing = (field) => {
    setEditingField(field);
    setTempValue(profile[field] || '');
  };

  const cancelEditing = () => {
    setEditingField(null);
  };

  const saveChanges = async () => {
    try {
      if (!tempValue.trim()) {
        Alert.alert('Error', 'Field cannot be empty');
        return;
      }

      const updatedProfile = { ...profile, [editingField]: tempValue };
      const result = await ProfileService.updateProfile(updatedProfile);
      
      if (result.success) {
        setProfile(updatedProfile);
        setEditingField(null);
      } else {
        throw new Error('Update failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
      console.error(error);
    }
  };

  const renderEditControls = (field) => {
    if (editingField === field) {
      return (
        <View style={styles.editControls}>
          <TouchableOpacity onPress={cancelEditing}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={saveChanges}>
            <Text style={styles.saveButton}>Save</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <TouchableOpacity 
        style={styles.editButton}
        onPress={() => startEditing(field)}
      >
        <Ionicons name="pencil" size={16} color={colors.secondaryText} />
        <Text style={styles.editText}>Edit</Text>
      </TouchableOpacity>
    );
  };

  const renderBasicInfo = () => {
    if (!profile) return null;

    return (
      <View style={styles.contentContainer}>
        {/* Profile Avatar */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            {profile.avatar ? (
              <Image source={{ uri: profile.avatar }} style={styles.avatarImage} />
            ) : (
              <Ionicons name="person" size={30} color={colors.secondaryText} />
            )}
          </View>
          <TouchableOpacity style={styles.editIconContainer}>
            <Ionicons name="pencil" size={12} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Profile Fields */}
        <View style={styles.fieldsContainer}>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Name</Text>
            <View style={styles.fieldContent}>
              {editingField === 'name' ? (
                <TextInput
                  style={styles.input}
                  value={tempValue}
                  onChangeText={setTempValue}
                  autoFocus
                />
              ) : (
                <Text style={styles.fieldValue}>{profile.name}</Text>
              )}
              {renderEditControls('name')}
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Email Address</Text>
            <View style={styles.fieldContent}>
              <Text style={styles.fieldValue}>{profile.email}</Text>
              <TouchableOpacity style={styles.editButton} disabled>
                <Text style={styles.editTextDisabled}>Verified</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Contact Number</Text>
            <View style={styles.fieldContent}>
              {editingField === 'phone' ? (
                <TextInput
                  style={styles.input}
                  value={tempValue}
                  onChangeText={setTempValue}
                  keyboardType="phone-pad"
                  autoFocus
                />
              ) : (
                <Text style={styles.fieldValue}>{profile.phone}</Text>
              )}
              {renderEditControls('phone')}
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Home Address</Text>
            <View style={styles.fieldContent}>
              {editingField === 'homeAddress' ? (
                <TextInput
                  style={styles.input}
                  value={tempValue}
                  onChangeText={setTempValue}
                  autoFocus
                  multiline
                />
              ) : (
                <Text style={styles.fieldValue}>{profile.homeAddress}</Text>
              )}
              {renderEditControls('homeAddress')}
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Work Place</Text>
            <View style={styles.fieldContent}>
              {editingField === 'workAddress' ? (
                <TextInput
                  style={styles.input}
                  value={tempValue}
                  onChangeText={setTempValue}
                  autoFocus
                  multiline
                />
              ) : (
                <Text style={styles.fieldValue}>{profile.workAddress}</Text>
              )}
              {renderEditControls('workAddress')}
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderSigninInfo = () => (
    <View style={styles.contentContainer}>
      <TouchableOpacity 
        style={styles.listItem}
        onPress={() => router.push('/profile/change-email')}
      >
        <Text style={styles.listItemText}>Email Address</Text>
        <View style={styles.listItemRight}>
          <Text style={styles.listItemValue}>{profile?.email || ''}</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.secondaryText} />
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderSecurity = () => (
    <View style={styles.contentContainer}>
      <TouchableOpacity 
        style={styles.listItem}
        onPress={() => router.push('/profile/change-password')}
      >
        <Text style={styles.listItemText}>Change Password</Text>
        <Ionicons name="chevron-forward" size={20} color={colors.secondaryText} />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.listItem}
        onPress={() => router.push('/profile/recovery-phone')}
      >
        <Text style={styles.listItemText}>Recovery Phone Number</Text>
        <Ionicons name="chevron-forward" size={20} color={colors.secondaryText} />
      </TouchableOpacity>
    </View>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }

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

  const handleActivityPress = () => {
    console.log('Navigating to Activity page...');
    try {
      // Try a simpler approach - use the path structure as Expo Router expects
      router.push('/pages/Profile/Activity/');
    } catch (error) {
      console.error('Navigation error:', error);
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

        {/* Activity Button - Add this section */}
        <TouchableOpacity 
          style={styles.menuItem} 
          onPress={handleActivityPress}
          activeOpacity={0.7}
        >
          <View style={styles.menuItemContent}>
            <Ionicons name="time-outline" size={20} color={colors.primary} />
            <Text style={styles.menuItemText}>Activity</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.secondaryText} />
          </View>
        </TouchableOpacity>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 50,
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
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
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
  input: {
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.mainTextColor,
    flex: 1,
    padding: 0,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 4,
  },
  editControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  saveButton: {
    color: colors.primary,
    fontFamily: fonts.PlusJakartaSansMedium,
    fontSize: 14,
  },
  cancelButton: {
    color: colors.secondaryText,
    fontFamily: fonts.PlusJakartaSansMedium,
    fontSize: 14,
  },
  editText: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
  },
  editTextDisabled: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.success,
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
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.stroke,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.mainTextColor,
  },
});

export default ProfileScreen;