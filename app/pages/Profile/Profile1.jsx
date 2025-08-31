import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import colors from '../../../constants/color';
import fonts from '../../../constants/fonts';
import CustomButton from '../../../components/CustomButton';
import InputField from '../../../components/InputField';
import ProfileField from '../../../components/ProfileField';
import OTPInput from '../../../components/OTPInput';
import CustomModal from '../../../components/CustomModal';

// Move ProfileFieldComponent outside Profile1 for memoization and to avoid remounts
const ProfileFieldComponent = React.memo(({
  label,
  value,
  field,
  showEdit = true,
  isEditingField,
  editingValue,
  onEdit,
  onUpdate,
  onCancel,
  onValueChange,
  placeholder,
  multiline,
  keyboardType,
  onSpecialEdit,
}) => (
  <ProfileField
    label={label}
    value={value}
    field={field}
    showEdit={showEdit}
    isEditingField={isEditingField}
    editingValue={editingValue}
    onEdit={onEdit}
    onUpdate={onUpdate}
    onCancel={onCancel}
    onValueChange={onValueChange}
    placeholder={placeholder}
    multiline={multiline}
    keyboardType={keyboardType}
    onSpecialEdit={onSpecialEdit}
  />
));

const Profile1 = () => {
  const params = useLocalSearchParams();
  useEffect(() => {
    if (params.homeAddress) {
      setUserInfo(prev => ({
        ...prev,
        homeAddress: params.homeAddress
      }));
    }
  }, [params.homeAddress]);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Basic Info');
  const [isEditing, setIsEditing] = useState(null);
  const [editingValues, setEditingValues] = useState({});
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Signin Info states
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Security states
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showRecoveryPhoneModal, setShowRecoveryPhoneModal] = useState(false);
  const [recoveryPhone, setRecoveryPhone] = useState('+94');
  const [focusedPasswordField, setFocusedPasswordField] = useState(null);

  const [userInfo, setUserInfo] = useState({
    name: 'Vishwani Vilochana',
    email: 'vishwani2002@gmail.com',
    contactNumber: '+94 71 597 1236',
    homeAddress: 'Your home address',
    workPlace: 'Your work place address',
  });

  const [addressForm, setAddressForm] = useState({
    suite: '25',
    street: 'Neelamahara Road',
    city: 'Maharagama',
    district: 'Colombo',
  });

  const [emailValue, setEmailValue] = useState('');

  const tabs = ['Basic Info', 'Signin Info', 'Security'];

  const handleEdit = useCallback((field, value) => {
    setIsEditing(field);
    setEditingValues(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleUpdate = useCallback(() => {
    if (isEditing) {
      setUserInfo(prev => ({
        ...prev,
        [isEditing]: editingValues[isEditing]
      }));
      setIsEditing(null);
      setEditingValues(prev => ({ ...prev, [isEditing]: '' }));
    }
  }, [isEditing, editingValues]);

  const handleCancel = useCallback(() => {
    setIsEditing(null);
  }, []);

  const handleAddressUpdate = () => {
    const fullAddress = `${addressForm.suite}, ${addressForm.street}, ${addressForm.city}, ${addressForm.district}`;
    setUserInfo(prev => ({
      ...prev,
      homeAddress: fullAddress
    }));
    setShowAddressModal(false);
  };

  const handleProfilePictureChange = () => {
    setShowProfileModal(true);
  };

  // Signin Info handlers
  const handleEmailEdit = () => {
    setEmailValue(userInfo.email);
    setShowEmailModal(true);
  };

  const handleEmailUpdate = () => {
    setShowEmailModal(false);
    setShowVerifyModal(true);
  };

  const handleOtpChange = (newOtpValue) => {
    // This handler is no longer needed as OTPInput manages its own state
  };

  const handleVerifyOtp = () => {
    // This handler is no longer needed as OTPInput manages its own state
  };

  const handleResendCode = () => {
    // Mock resend functionality
    Alert.alert('Code Resent', 'A new verification code has been sent to your email.');
  };

  // Security handlers
  const handlePasswordUpdate = () => {
    // This handler is no longer needed as PasswordModal manages its own state
  };

  const isPasswordValid = () => {
    // This function is no longer needed as PasswordModal manages its own state
    return true; // Placeholder, as PasswordModal handles its own validation
  };

  const handleRecoveryPhoneUpdate = () => {
    // This handler is no longer needed as RecoveryPhoneModal manages its own state
  };

  const isRecoveryPhoneValid = () => {
    // This function is no longer needed as RecoveryPhoneModal manages its own state
    return true; // Placeholder, as RecoveryPhoneModal handles its own validation
  };

  const ProfilePictureModal = () => (
    <Modal
      visible={showProfileModal}
      transparent={true}
      animationType="fade"
    >
      <View style={styles.profileModalOverlay}>
        <View style={styles.profileModalContainer}>
          <Text style={styles.profileModalTitle}>Change Profile Picture</Text>
          <TouchableOpacity style={styles.profileModalOption} onPress={() => setShowProfileModal(false)}>
            <Text style={styles.profileModalOptionText}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileModalOption} onPress={() => setShowProfileModal(false)}>
            <Text style={styles.profileModalOptionText}>Choose from Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileModalCancel} onPress={() => setShowProfileModal(false)}>
            <Text style={styles.profileModalCancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  // Refactor EmailModal to receive value and setter as props
  const EmailModal = ({ value, onChange }) => {
    return (
      <CustomModal
        visible={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        title="Email"
        subtitle="You'll use this email to get sign in and get notifications"
        footerContent={
          <CustomButton
            title="Update"
            onPress={() => {
              setShowEmailModal(false);
              setShowVerifyModal(true);
            }}
          />
        }
      >
      
        <InputField
          label="Email Address"
          value={value}
          onChangeText={onChange}
          keyboardType="email-address"
          required
        />
        <Text style={styles.emailNote}>
          A verification code will be sent to this email
        </Text>
      </CustomModal>
    );
  };

  // Refactor VerifyEmailModal to use local state
  const VerifyEmailModal = () => {
    const [otpValue, setOtpValue] = useState(['', '', '', '', '', '']);
    const [focusedOtpIndex, setFocusedOtpIndex] = useState(null);
    return (
      
      <CustomModal
        visible={showVerifyModal}
        onClose={() => setShowVerifyModal(false)}
        title="Verify Email"
        subtitle={`We've sent a 6-digit OTP to ${userInfo.email}`}
        footerContent={
          <View>
          
            <CustomButton
              title="Continue"
              onPress={() => {
                const otp = otpValue.join('');
                if (otp === '352935') { // Mock verification
                  setShowVerifyModal(false);
                  setShowSuccessModal(true);
                  setTimeout(() => {
                    setShowSuccessModal(false);
                    setUserInfo(prev => ({ ...prev, email: userInfo.email }));
                  }, 3000);
                }
              }}
            />
            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>Don't you receive any code? </Text>
              <TouchableOpacity onPress={() => Alert.alert('Code Resent', 'A new verification code has been sent to your email.') }>
                <Text style={styles.resendLink}>Resend Code</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
      >
        <View style={styles.otpContainer}>
          <Text style={styles.otpLabel}>OTP</Text>
          <OTPInput
            length={6}
            value={otpValue}
            onChange={setOtpValue}
            focusedIndex={focusedOtpIndex}
            onFocus={setFocusedOtpIndex}
            onBlur={() => setFocusedOtpIndex(null)}
          />
        </View>
      </CustomModal>
    );
  };

  const SuccessModal = () => (
    <CustomModal
      visible={showSuccessModal}
      onClose={() => setShowSuccessModal(false)}
      title="Verify Email"
      subtitle="We've sent a 6-digit OTP to vishwani2002@gmail.com"
      footerContent={
        <View>
          <CustomButton
            title="Continue"
            onPress={() => setShowSuccessModal(false)}
          />
          <View style={styles.successContainer}>
            <Text style={styles.successText}>✓ Verification successful!</Text>
          </View>
        </View>
      }
    >
      <View style={styles.otpContainer}>
        <Text style={styles.otpLabel}>OTP</Text>
        <OTPInput
          length={6}
          value={['3', '5', '2', '9', '3', '5']}
          onChange={() => { }}
          editable={false}
        />
      </View>
    </CustomModal>
  );

  // Refactor PasswordModal to use local state
  const PasswordModal = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [focusedPasswordField, setFocusedPasswordField] = useState(null);
    const isPasswordValid = () => {
      return newPassword.length >= 8 && newPassword === confirmPassword && newPassword !== '' && confirmPassword !== '';
    };
    return (
      <CustomModal
        visible={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="Password"
        subtitle="Your password must be at least 8 characters long"
        footerContent={
          <CustomButton
            title="Update"
            onPress={() => {
              if (newPassword.length < 8) {
                Alert.alert('Error', 'Password must be at least 8 characters long');
                return;
              }
              if (newPassword !== confirmPassword) {
                Alert.alert('Error', 'Passwords do not match');
                return;
              }
              setShowPasswordModal(false);
              Alert.alert('Success', 'Password updated successfully');
            }}
            backgroundColor={isPasswordValid() ? colors.primary : colors.gray}
            disabled={!isPasswordValid()}
            textStyle={{
              color: isPasswordValid() ? colors.white : colors.darkGray,
              fontSize: 16,
              fontWeight: 'bold',
            }}
          />
        }
      >
        <InputField
          label="New Password"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry={true}
          showPasswordToggle={true}
          showPassword={showNewPassword}
          setShowPassword={setShowNewPassword}
          onFocus={() => setFocusedPasswordField('newPassword')}
          onBlur={() => setFocusedPasswordField(null)}
          required
        />
        <InputField
          label="Confirm New Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={true}
          showPasswordToggle={true}
          showPassword={showConfirmPassword}
          setShowPassword={setShowConfirmPassword}
          onFocus={() => setFocusedPasswordField('confirmPassword')}
          onBlur={() => setFocusedPasswordField(null)}
          required
        />
      </CustomModal>
    );
  };

  // Refactor RecoveryPhoneModal to use local state
  const RecoveryPhoneModal = () => {
    const isRecoveryPhoneValid = () => {
      const cleanPhone = recoveryPhone.replace(/\s/g, '');
      return cleanPhone.length >= 12 && cleanPhone.startsWith('+94');
    };
    const handlePhoneChange = (text) => {
      // Allow only numbers and a single leading '+'
      if (text === '' || text === '+') {
        setRecoveryPhone(text);
        return;
      }
      // If starts with +, keep it, else just numbers
      let formatted = text;
      if (text.startsWith('+')) {
        formatted = '+' + text.slice(1).replace(/[^0-9]/g, '');
      } else {
        formatted = text.replace(/[^0-9]/g, '');
      }
      setRecoveryPhone(formatted);
    };
    return (
      <Modal
        visible={showRecoveryPhoneModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowRecoveryPhoneModal(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.05)' }}>
          <View style={{ width: '100%', maxWidth: 400, backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 24, paddingTop: 40, paddingBottom: 32, alignSelf: 'center' }}>
            <TouchableOpacity style={{ alignSelf: 'flex-start', marginBottom: 16 }} onPress={() => setShowRecoveryPhoneModal(false)}>
              <Text style={{ fontSize: 24, color: colors.mainTextColor }}>‹</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 24, fontWeight: '700', color: colors.mainTextColor, marginBottom: 6 }}>Recovery Phone</Text>
            <Text style={{ fontSize: 15, color: colors.secondaryText, marginBottom: 32 }}>You'll use this number to recover your account</Text>
            <View style={{ width: '100%', marginBottom: 18 }}>
              <Text style={{ fontSize: 15, color: colors.mainTextColor, marginBottom: 8 }}>Phone Number*</Text>
              <View style={{ borderWidth: 1, borderColor: isRecoveryPhoneValid() ? colors.primary : colors.secondaryText, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, backgroundColor: '#FAFAFA' }}>
                <TextInput
                  value={recoveryPhone}
                  onChangeText={handlePhoneChange}
                  placeholder="+94"
                  keyboardType="phone-pad"
                  style={{ fontSize: 17, color: colors.mainTextColor, minWidth: 220, fontWeight: '500' }}
                  maxLength={15}
                  placeholderTextColor={colors.secondaryText}
                />
              </View>
            </View>
            <Text style={{ fontSize: 14, color: colors.secondaryText, marginBottom: 28, alignSelf: 'flex-start' }}>A verification code will be sent to this email</Text>
            <TouchableOpacity
              style={{ width: '100%', backgroundColor: isRecoveryPhoneValid() ? colors.primary : '#E0E0E0', paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginTop: 8 }}
              onPress={isRecoveryPhoneValid() ? () => {
                setShowRecoveryPhoneModal(false);
                Alert.alert('Success', 'Recovery phone number updated successfully');
              } : null}
              disabled={!isRecoveryPhoneValid()}
            >
              <Text style={{ color: isRecoveryPhoneValid() ? colors.background : colors.secondaryText, fontSize: 16, fontWeight: '600' }}>Update</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  const AddressModal = () => (
    <CustomModal
      visible={showAddressModal}
      onClose={() => setShowAddressModal(false)}
      title="Complete your address"
      subtitle="Setup your address below"
      scrollable={true}
      footerContent={
        <CustomButton
          title="Done"
          onPress={handleAddressUpdate}
        />
      }
    >
      <InputField
        label="Suit/Apartment (Optional)"
        value={addressForm.suite}
        onChangeText={(text) => setAddressForm(prev => ({ ...prev, suite: text }))}
        placeholder="25"
        
      />

      <InputField
        label="Street Name"
        value={addressForm.street}
        onChangeText={(text) => setAddressForm(prev => ({ ...prev, street: text }))}
        placeholder="Neelamahara Road"
        required
        
      />

      <InputField
        label="City"
        value={addressForm.city}
        onChangeText={(text) => setAddressForm(prev => ({ ...prev, city: text }))}
        placeholder="Maharagama"
        required
      />

      <InputField
        label="District"
        value={addressForm.district}
        onChangeText={(text) => setAddressForm(prev => ({ ...prev, district: text }))}
        placeholder="Colombo"
        required
      />

      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <View style={styles.mapBackground}>
            <View style={styles.roadLine} />
            <View style={styles.roadLine2} />
            <View style={styles.roadLine3} />
            <View style={styles.locationPin}>
              <View style={styles.pinDot} />
            </View>
            <Text style={styles.locationLabel}>Maharagama</Text>
          </View>
          <View style={styles.mapOverlay}>
            <TouchableOpacity style={styles.mapButton}>
              <Text style={styles.mapButtonIcon}>📍</Text>
              <Text style={styles.mapButtonText}>Update location on map</Text>
            </TouchableOpacity>
            <Text style={styles.mapSubtext}>or Manually update the address</Text>
          </View>
        </View>
      </View>
    </CustomModal>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View >
        <TouchableOpacity onPress={() => router.push('/')} style={styles.header}>
          <View style={styles.backButton} onPress={() => router.push('/')}>
            <Text style={styles.backButtonText}>‹</Text>
          </View>
          <Text style={styles.headerTitle}>Manage Account</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              activeTab === tab && styles.activeTab,
            ]}
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
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'Basic Info' && (
          <>
            {/* Profile Picture */}
            <View style={styles.profileSection}>
              <View style={styles.profileImageContainer}>
                <View style={styles.profileImage}>
                  <Text style={styles.profileImageText}>👤</Text>
                </View>
                <TouchableOpacity style={styles.editProfileButton} onPress={handleProfilePictureChange}>
                  <Text style={styles.editProfileButtonText}>✏️</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Profile Fields */}
            <View style={styles.fieldsContainer}>
              <ProfileFieldComponent
                label="Name"
                value={userInfo.name}
                field="name"
                isEditingField={isEditing === 'name'}
                editingValue={editingValues['name'] || ''}
                onEdit={handleEdit}
                onUpdate={handleUpdate}
                onCancel={handleCancel}
                onValueChange={val => setEditingValues(prev => ({ ...prev, ['name']: val }))}
                placeholder={userInfo.name}
                multiline={false}
                keyboardType="default"
              />

              <ProfileFieldComponent
                label="Email Address"
                value={userInfo.email}
                field="email"
                isEditingField={isEditing === 'email'}
                editingValue={editingValues['email'] || ''}
                onEdit={handleEdit}
                onUpdate={handleUpdate}
                onCancel={handleCancel}
                onValueChange={val => setEditingValues(prev => ({ ...prev, ['email']: val }))}
                placeholder={userInfo.email}
                multiline={false}
                keyboardType="email-address"
              />

              <ProfileFieldComponent
                label="Contact Number"
                value={userInfo.contactNumber}
                field="contactNumber"
                isEditingField={isEditing === 'contactNumber'}
                editingValue={editingValues['contactNumber'] || ''}
                onEdit={handleEdit}
                onUpdate={handleUpdate}
                onCancel={handleCancel}
                onValueChange={val => setEditingValues(prev => ({ ...prev, ['contactNumber']: val }))}
                placeholder={userInfo.contactNumber}
                multiline={false}
                keyboardType="phone-pad"
              />

              <ProfileFieldComponent
                label="Home Address"
                value={userInfo.homeAddress}
                field="homeAddress"
                isEditingField={isEditing === 'homeAddress'}
                editingValue={editingValues['homeAddress'] || ''}
                onEdit={handleEdit}
                onUpdate={handleUpdate}
                onCancel={handleCancel}
                onValueChange={val => setEditingValues(prev => ({ ...prev, ['homeAddress']: val }))}
                placeholder={userInfo.homeAddress}
                multiline={true}
                keyboardType="default"
                // Connect to Address.jsx on edit button
                onSpecialEdit={() => router.push('/pages/Profile/ManageAccount/Address')}
              />

              <ProfileFieldComponent
                label="Work Place"
                value={userInfo.workPlace}
                field="workPlace"
                isEditingField={isEditing === 'workPlace'}
                editingValue={editingValues['workPlace'] || ''}
                onEdit={handleEdit}
                onUpdate={handleUpdate}
                onCancel={handleCancel}
                onValueChange={val => setEditingValues(prev => ({ ...prev, ['workPlace']: val }))}
                placeholder={userInfo.workPlace}
                multiline={true}
                keyboardType="default"
              />
            </View>
          </>
        )}

        {activeTab === 'Signin Info' && (
          <View style={styles.signinInfoContainer}>
            <TouchableOpacity onPress={() => router.push('/pages/Profile/ManageAccount/UpdateEmailScreen')}>
              <View style={styles.signinInfoItem}>
                <Text style={styles.signinInfoLabel}>Email Address</Text>
                <View style={styles.signinInfoRow}>
                  <Text style={styles.signinInfoValue}>{userInfo.email}</Text>
                  <TouchableOpacity onPress={() => router.push('/pages/Profile/ManageAccount/UpdateEmailScreen')}>
                    <Text style={styles.signinInfoArrow}>›</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {activeTab === 'Security' && (
          <View style={styles.securityContainer}>
            <TouchableOpacity onPress={() => router.push('/pages/ResetPW')}>
              <View style={styles.securityItem}>
                <Text style={styles.securityLabel}>Password</Text>
                <Text style={styles.securityArrow}>›</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.securityDivider} />

            <TouchableOpacity onPress={() => router.push('/pages/Profile/ManageAccount/RecoveryPhone')}>
              <View style={styles.securityItem}>
                <Text style={styles.securityLabel}>Recovery Phone Number</Text>
                <Text style={styles.securityArrow}>›</Text>
              </View>
            </TouchableOpacity>

          </View>
        )}
      </ScrollView>

      <AddressModal />
      <ProfilePictureModal />
      <EmailModal value={emailValue} onChange={setEmailValue} />
      <VerifyEmailModal />
      <SuccessModal />
      <PasswordModal />
      <RecoveryPhoneModal />
    </View>
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
    textAlign: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: colors.background,
  },
  backButton: {
    marginRight: 15,
  },
  backButtonText: {
    fontSize: 30,
    color: colors.mainTextColor,
    fontFamily: fonts.PlusJakartaSans,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.mainTextColor,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 20,
  },
  activeTab: {
    borderBottomWidth: 2,
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
    paddingHorizontal: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.stroke,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImageText: {
    fontSize: 30,
    color: colors.secondaryText,
  },
  editProfileButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editProfileButtonText: {
    color: colors.background,
    fontSize: 14,
  },
  fieldsContainer: {
    flex: 1,
  },
  // Modal styles
  otpContainer: {
    marginBottom: 40,
  },
  otpLabel: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.mainTextColor,
    marginBottom: 16,
  },
  emailNote: {
    fontSize: 12,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.mainTextColor,
    marginTop: 8,
  },
  phoneNote: {
    fontSize: 12,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.mainTextColor,
    marginTop: 8,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 10,
  },
  resendText: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.mainTextColor,
  },
  resendLink: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.primary,
  },
  successContainer: {
    backgroundColor: colors.bgGreen,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  successText: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.primary,
  },
  updatePhoneButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  updatePhoneButtonText: {
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSansBold,
    textAlign: 'center',
  },
  mapContainer: {
    marginVertical: 20,
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    position: 'relative',
    overflow: 'hidden',
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 8,
  },
  mapButtonIcon: {
    marginRight: 8,
    fontSize: 12,
  },
  mapButtonText: {
    color: colors.background,
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
  },
  mapSubtext: {
    fontSize: 12,
    color: colors.secondaryText,
    fontFamily: fonts.PlusJakartaSans,
  },
  mapBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.bgGreen,
  },
  roadLine: {
    position: 'absolute',
    top: 30,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: colors.background,
  },
  roadLine2: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    height: 1,
    backgroundColor: colors.background,
  },
  roadLine3: {
    position: 'absolute',
    top: 90,
    left: 10,
    right: 30,
    height: 1,
    backgroundColor: colors.background,
  },
  locationPin: {
    position: 'absolute',
    top: 25,
    left: 60,
    width: 12,
    height: 12,
    backgroundColor: colors.primary,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinDot: {
    width: 6,
    height: 6,
    backgroundColor: colors.background,
    borderRadius: 3,
  },
  locationLabel: {
    position: 'absolute',
    top: 40,
    left: 45,
    fontSize: 9,
    color: colors.mainTextColor,
    fontFamily: fonts.PlusJakartaSans,
    backgroundColor: colors.background,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 2,
  },
  mapOverlay: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1,
  },
  // Profile picture modal styles
  profileModalOverlay: {
    flex: 1,
    backgroundColor: colors.mainTextColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileModalContainer: {
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 20,
    margin: 20,
    width: '80%',
  },
  profileModalTitle: {
    fontSize: 18,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.mainTextColor,
    textAlign: 'center',
    marginBottom: 20,
  },
  profileModalOption: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.stroke,
  },
  profileModalOptionText: {
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.mainTextColor,
    textAlign: 'center',
  },
  profileModalCancel: {
    paddingVertical: 15,
    marginTop: 10,
  },
  profileModalCancelText: {
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.primary,
    textAlign: 'center',
  },
  // Signin Info styles
  signinInfoContainer: {
    paddingTop: 20,
  },
  signinInfoItem: {
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.stroke,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  signinInfoLabel: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.mainTextColor,
    marginBottom: 4,
  },
  signinInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  signinInfoValue: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.mainTextColor,
  },
  signinInfoArrow: {
    fontSize: 20,
    color: colors.mainTextColor,
    fontFamily: fonts.PlusJakartaSans,
  },
  // Security styles
  securityContainer: {
    paddingTop: 20,
    backgroundColor: colors.background,
  },
  securityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 0,
  },
  securityLabel: {
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
  },
  securityArrow: {
    fontSize: 20,
    color: colors.mainTextColor,
    fontFamily: fonts.PlusJakartaSans,
  },
  securityDivider: {
    height: 1,
    backgroundColor: colors.stroke,
    marginHorizontal: 0,
  },

});

export default Profile1;
