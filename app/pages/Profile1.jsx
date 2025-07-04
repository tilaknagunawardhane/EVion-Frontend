import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import colors from '../../constants/color';
import fonts from '../../constants/fonts';
import CustomButton from '../../components/CustomButton';

const Profile1 = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Basic Info');
  const [isEditing, setIsEditing] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  
  // Signin Info states
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [emailValue, setEmailValue] = useState('');
  const [otpValue, setOtpValue] = useState('');
  const [otpDigits, setOtpDigits] = useState(['3', '5', '2', '9', '3', '5']);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(true);
  const [focusedOtpIndex, setFocusedOtpIndex] = useState(null);
  
  const [userInfo, setUserInfo] = useState({
    name: 'Vishwani Vilochana',
    email: 'vishwani2002@gmail.com',
    contactNumber: '+94 71 597 1236',
    homeAddress: 'Your home address',
    workPlace: 'Your work place address',
  });

  const [editingValue, setEditingValue] = useState('');
  const [addressForm, setAddressForm] = useState({
    suite: '25',
    street: 'Neelamahara Road',
    city: 'Maharagama',
    district: 'Colombo',
  });

  const tabs = ['Basic Info', 'Signin Info', 'Security'];

  const handleEdit = (field, value) => {
    setIsEditing(field);
    setEditingValue(value);
  };

  const handleUpdate = () => {
    if (isEditing) {
      setUserInfo(prev => ({
        ...prev,
        [isEditing]: editingValue
      }));
      setIsEditing(null);
      setEditingValue('');
    }
  };

  const handleCancel = () => {
    setIsEditing(null);
    setEditingValue('');
  };

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

  const handleOtpDigitChange = (value, index) => {
    const newOtpDigits = [...otpDigits];
    newOtpDigits[index] = value;
    setOtpDigits(newOtpDigits);
    
    // Auto focus next input
    if (value && index < 5) {
      // Focus next input (you'd need refs in a real implementation)
    }
  };

  const handleVerifyOtp = () => {
    const otp = otpDigits.join('');
    if (otp === '352935') { // Mock verification
      setShowVerifyModal(false);
      setShowSuccessModal(true);
      // Update email after success
      setTimeout(() => {
        setShowSuccessModal(false);
        setUserInfo(prev => ({ ...prev, email: emailValue }));
        setOtpDigits(['', '', '', '', '', '']);
      }, 3000);
    }
  };

  const handleResendCode = () => {
    // Mock resend functionality
    Alert.alert('Code Resent', 'A new verification code has been sent to your email.');
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

const EmailModal = () => (
    <Modal
        visible={showEmailModal}
        animationType="slide"
        presentationStyle="pageSheet"
    >
        <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setShowEmailModal(false)}>
                    <Text style={styles.backButton}>‹</Text>
                </TouchableOpacity>
            </View>
            
            <View style={styles.emailModalContent}>
                <Text style={styles.modalTitle}>Email</Text>
                <Text style={styles.emailSubtitle}>
                    You'll use this email to get sign in and get notifications
                </Text>
                
                <View style={styles.emailInputContainer}>
                    <Text style={styles.emailLabel}>Email Address*</Text>
                    <TextInput
                        style={styles.emailInput}
                        value={emailValue}
                        onChangeText={setEmailValue}
                        placeholder="vishwani2002@gmail.com"
                        placeholderTextColor={colors.secondaryText}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>
                
                <Text style={styles.emailNote}>
                    A verification code will be sent to this email
                </Text>
                
                <View style={styles.emailModalFooter}>
                    <CustomButton
                        title="Update"
                        onPress={handleEmailUpdate}
                        style={styles.updateEmailButton}
                    />
                </View>
            </View>
        </View>
    </Modal>
);

  const VerifyEmailModal = () => (
    <Modal
      visible={showVerifyModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowVerifyModal(false)}>
            <Text style={styles.backButton}>‹</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.verifyModalContent}>
          <Text style={styles.modalTitle}>Verify Email</Text>
          <Text style={styles.verifySubtitle}>
            We've sent a 6-digit OTP to{'\n'}vishwani2002@gmail.com
          </Text>
          
          <View style={styles.otpContainer}>
            <Text style={styles.otpLabel}>OTP</Text>
            <View style={styles.otpInputsContainer}>
              {otpDigits.map((digit, index) => (
                <TextInput
                  key={index}
                  style={[
                    styles.otpInput,
                    digit && styles.otpInputFilled,
                    focusedOtpIndex === index && styles.otpInputFocused
                  ]}
                  value={digit}
                  onChangeText={(value) => handleOtpDigitChange(value, index)}
                  onFocus={() => setFocusedOtpIndex(index)}
                  onBlur={() => setFocusedOtpIndex(null)}
                  maxLength={1}
                  keyboardType="numeric"
                />
              ))}
            </View>
          </View>
          
          <CustomButton
            title="Continue"
            onPress={handleVerifyOtp}
            style={styles.continueButton}
          />
        </View>
        
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Don't you receive any code? </Text>
          <TouchableOpacity onPress={handleResendCode}>
            <Text style={styles.resendLink}>Resend Code</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const SuccessModal = () => (
    <Modal
      visible={showSuccessModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowSuccessModal(false)}>
            <Text style={styles.backButton}>‹</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.verifyModalContent}>
          <Text style={styles.modalTitle}>Verify Email</Text>
          <Text style={styles.verifySubtitle}>
            We've sent a 6-digit OTP to{'\n'}vishwani2002@gmail.com
          </Text>
          
          <View style={styles.otpContainer}>
            <Text style={styles.otpLabel}>OTP</Text>
            <View style={styles.otpInputsContainer}>
              {otpDigits.map((digit, index) => (
                <TextInput
                  key={index}
                  style={[
                    styles.otpInput,
                    styles.otpInputFilled
                  ]}
                  value={digit}
                  editable={false}
                  maxLength={1}
                />
              ))}
            </View>
          </View>
          
          <CustomButton
            title="Continue"
            onPress={() => setShowSuccessModal(false)}
            style={styles.continueButton}
          />
        </View>
        
        <View style={styles.successContainer}>
          <Text style={styles.successText}>✓ Verification successful!</Text>
        </View>
      </View>
    </Modal>
  );

  const ProfileField = ({ label, value, field, showEdit = true }) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {isEditing === field ? (
        <View style={styles.editingContainer}>
          <TextInput
            style={styles.editInput}
            value={editingValue}
            onChangeText={setEditingValue}
            autoFocus
            multiline={field === 'homeAddress' || field === 'workPlace'}
          />
          <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
            <Text style={styles.updateButtonText}>Update</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <View style={styles.fieldValueContainer}>
            <Text style={[styles.fieldValue, field === 'homeAddress' && styles.placeholderText]}>
              {value}
            </Text>
            {showEdit && (
              <TouchableOpacity 
                style={styles.editIcon} 
                onPress={() => {
                  if (field === 'homeAddress') {
                    setShowAddressModal(true);
                  } else {
                    handleEdit(field, value);
                  }
                }}
              >
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
            )}
          </View>

        </View>
      )}
    </View>
  );

  const AddressModal = () => (
    <Modal
      visible={showAddressModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowAddressModal(false)}>
            <Text style={styles.backButton}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Complete your address</Text>
        </View>
        
        <Text style={styles.modalSubtitle}>Setup your address below</Text>
        
        <ScrollView style={styles.modalContent}>
          <View style={styles.addressInputContainer}>
            <Text style={styles.addressLabel}>Suit/Apartment(Optional)</Text>
            <TextInput
              style={styles.addressInput}
              value={addressForm.suite}
              onChangeText={(text) => setAddressForm(prev => ({ ...prev, suite: text }))}
              placeholder="25"
            />
          </View>
          
          <View style={styles.addressInputContainer}>
            <Text style={styles.addressLabel}>Street Name*</Text>
            <TextInput
              style={styles.addressInput}
              value={addressForm.street}
              onChangeText={(text) => setAddressForm(prev => ({ ...prev, street: text }))}
              placeholder="Neelamahara Road"
            />
          </View>
          
          <View style={styles.addressInputContainer}>
            <Text style={styles.addressLabel}>City*</Text>
            <TextInput
              style={styles.addressInput}
              value={addressForm.city}
              onChangeText={(text) => setAddressForm(prev => ({ ...prev, city: text }))}
              placeholder="Maharagama"
            />
          </View>
          
          <View style={styles.addressInputContainer}>
            <Text style={styles.addressLabel}>District*</Text>
            <View style={styles.dropdownContainer}>
              <TextInput
                style={styles.addressInput}
                value={addressForm.district}
                onChangeText={(text) => setAddressForm(prev => ({ ...prev, district: text }))}
                placeholder="Colombo"
              />
              <Text style={styles.dropdownArrow}>▼</Text>
            </View>
          </View>
          
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
        </ScrollView>
        
        <View style={styles.modalFooter}>
          <CustomButton
            title="Done"
            onPress={handleAddressUpdate}
            style={styles.doneButton}
          />
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Account</Text>
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
              <ProfileField
                label="Name"
                value={userInfo.name}
                field="name"
              />
              
              <ProfileField
                label="Email Address"
                value={userInfo.email}
                field="email"
              />
              
              <ProfileField
                label="Contact Number"
                value={userInfo.contactNumber}
                field="contactNumber"
              />
              
              <ProfileField
                label="Home Address"
                value={userInfo.homeAddress}
                field="homeAddress"
              />
              
              <ProfileField
                label="Work Place"
                value={userInfo.workPlace}
                field="workPlace"
              />
            </View>
          </>
        )}

        {activeTab === 'Signin Info' && (
          <View style={styles.signinInfoContainer}>
            <View style={styles.signinInfoItem}>
              <Text style={styles.signinInfoLabel}>Email Address</Text>
              <View style={styles.signinInfoRow}>
                <Text style={styles.signinInfoValue}>{userInfo.email}</Text>
                <TouchableOpacity onPress={handleEmailEdit}>
                  <Text style={styles.signinInfoArrow}>›</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {activeTab === 'Security' && (
          <View style={styles.securityContainer}>
            <Text style={styles.securityPlaceholder}>Security settings will be implemented here</Text>
          </View>
        )}
      </ScrollView>

      <AddressModal />
      <ProfilePictureModal />
      <EmailModal />
      <VerifyEmailModal />
      <SuccessModal />
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
    color:colors.background,
    fontSize: 14,
  },
  fieldsContainer: {
    flex: 1,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.mainTextColor,
    marginBottom: 8,
  },
  fieldValueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.stroke,
  },
  fieldValue: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.mainTextColor,
    flex: 1,
  },
  placeholderText: {
    color: colors.secondaryText,
  },
  editIcon: {
    padding: 4,
  },
  editText: {
    fontSize: 14,
    color: colors.secondaryText,
    fontFamily: fonts.PlusJakartaSans,
  },
  editingContainer: {
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.stroke,
    overflow: 'hidden',
  },
  editInput: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.mainTextColor,
    borderBottomWidth: 1,
    borderBottomColor: colors.stroke,
  },
  updateButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    alignItems: 'center',
  },
  updateButtonText: {
    color: colors.background,
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    marginLeft: 0,
    textAlign: 'left',
  },
  modalSubtitle: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  addressInputContainer: {
    marginBottom: 20,
  },
  addressLabel: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.mainTextColor,
    marginBottom: 8,
  },
  addressInput: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.mainTextColor,
  },
  dropdownContainer: {
    position: 'relative',
  },
  dropdownArrow: {
    position: 'absolute',
    right: 16,
    top: 12,
    color: colors.secondaryText,
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
  modalFooter: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  doneButton: {
    backgroundColor: colors.primary,
  },
  // Inline map styles for home address
  inlineMapContainer: {
    marginTop: 10,
  },
  inlineMapPlaceholder: {
    height: 120,
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    position: 'relative',
    overflow: 'hidden',
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
    backgroundColor:colors.background,
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
  inlineMapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginBottom: 4,
  },
  inlineMapButtonIcon: {
    marginRight: 6,
    fontSize: 12,
  },
  inlineMapButtonText: {
    color:colors.background,
    fontSize: 12,
    fontFamily: fonts.PlusJakartaSansMedium,
  },
  inlineMapSubtext: {
    fontSize: 11,
    color: colors.secondaryText,
    fontFamily: fonts.PlusJakartaSans,
  },
  // Profile picture modal styles
  profileModalOverlay: {
    flex: 1,
    backgroundColor: colors.mainTextColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileModalContainer: {
    backgroundColor:colors.background,
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
  // Email Modal styles
  emailModalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  emailSubtitle: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
    marginBottom: 30,
    lineHeight: 20,
  },
  emailInputContainer: {
    marginBottom: 20,
  },
  emailLabel: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.mainTextColor,
    marginBottom: 8,
  },
  emailInput: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.stroke,
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
  },
  emailNote: {
    fontSize: 12,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.mainTextColor,
    marginBottom: 40,
    marginTop: 8,
  },
  emailModalFooter: {
    paddingBottom: 40,
  },
  updateEmailButton: {
    backgroundColor: colors.primary,
  },
  // Verify Email Modal styles
  verifyModalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  verifySubtitle: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
    marginBottom: 40,
    lineHeight: 20,
    textAlign: 'left',
  },
  otpContainer: {
    marginBottom: 40,
  },
  otpLabel: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.mainTextColor,
    marginBottom: 16,
  },
  otpInputsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  otpInput: {
    width: 45,
    height: 45,
    borderWidth: 1,
    borderColor: colors.stroke,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 18,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.mainTextColor,
    backgroundColor: colors.background,
  },
  otpInputFilled: {
    borderColor: colors.primary,
    backgroundColor: colors.bgGreen,
  },
  otpInputFocused: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  continueButton: {
    backgroundColor: colors.primary,
    marginBottom: 40,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: colors.background,
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
    position: 'absolute',
    bottom: 0,
    left: 20,
    right: 20,
    marginBottom: 20,
  },
  successText: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.primary,
  },
  successModalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  // Security styles
  securityContainer: {
    paddingTop: 20,
    alignItems: 'center',
  },
  securityPlaceholder: {
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
  },

});

export default Profile1;
