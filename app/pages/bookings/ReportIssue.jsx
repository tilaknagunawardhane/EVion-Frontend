import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    Image,
    Alert,
    Platform,
    ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { API_BASE_URL } from '@env';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import useUserData from '../../../hooks/useUserData';
import * as SecureStore from 'expo-secure-store';

import AppBar from '../../../components/AppBar';
import CustomButton from '../../../components/CustomButton';
import DropdownField from '../../../components/DropdownField';
import InputField from '../../../components/InputField';
import colors from '../../../constants/color';
import fonts from '../../../constants/fonts';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const BookingReportScreen = () => {
    const { user, isLoading: isUserLoading } = useUserData();
    const router = useRouter();
    const params = useLocalSearchParams();
    const { bookingId } = params;

    const [bookingData, setBookingData] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [description, setDescription] = useState('');
    const [attachments, setAttachments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const bookingIssueCategories = [
        { id: 'booking-1', label: 'Payment Issues' },
        { id: 'booking-2', label: 'Booking Not Registered' },
        { id: 'booking-3', label: 'Wrong Time Slots' },
        { id: 'booking-4', label: 'Charger Not Available' },
        { id: 'booking-5', label: 'Overcharging' },
        { id: 'booking-6', label: 'Booking Cancellation Problems' },
        { id: 'booking-7', label: 'Refund Issues' },
        { id: 'booking-8', label: 'Technical Glitches' },
        { id: 'booking-9', label: 'Customer Service Issues' },
        { id: 'booking-10', label: 'Other Booking Issues' }
    ];

    const fetchBookingDetails = async () => {
        try {
            setIsLoading(true);
            const token = await SecureStore.getItemAsync('accessToken');
            
            if (!token) {
                throw new Error('Not authenticated');
            }

            const response = await fetch(`${API_BASE_URL}/api/reports/booking-details/${bookingId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();

            if (!response.ok) {
                Toast.show({
                    type: ALERT_TYPE.ERROR,
                    title: 'Error',
                    textBody: result.message || 'Failed to fetch booking details'
                });
                return;
            }

            setBookingData(result.data);
        } catch (error) {
            console.error('Fetch error:', error);
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Error',
                textBody: error.message,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const pickImage = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission required', 'Please allow access to your photos.');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 0.8,
                allowsMultipleSelection: false,
            });

            if (!result.canceled) {
                const newAttachment = {
                    uri: result.assets[0].uri,
                    fileName: result.assets[0].fileName || `attachment_${Date.now()}.jpg`,
                    type: result.assets[0].type || 'image',
                };
                setAttachments(prev => [...prev, newAttachment]);
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Error', 'Failed to select image. Please try again.');
        }
    };

    const removeAttachment = (index) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (!selectedCategory) {
            alert('Please select an issue category');
            return;
        }

        if (!description.trim()) {
            alert('Please provide a description');
            return;
        }

        setIsSubmitting(true);

        try {
            const token = await SecureStore.getItemAsync('accessToken');
            if (!token) {
                throw new Error('Not authenticated');
            }
            if (!user?._id) {
                throw new Error('User ID not found');
            }

            const response = await fetch(`${API_BASE_URL}/api/reports/submit-booking-report`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: user._id,
                    bookingId,
                    category: selectedCategory.label,
                    description,
                    attachments: attachments.map(att => att.uri),
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to submit booking report');
            }

            const data = await response.json();
            Toast.show({
                type: ALERT_TYPE.SUCCESS,
                title: 'Success',
                textBody: 'Booking issue reported successfully!',
            });
            router.back();

        } catch (error) {
            console.error('Error submitting booking report:', error);
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Error',
                textBody: error.message || 'Failed to submit booking report',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (bookingId) {
            fetchBookingDetails();
        }
    }, [bookingId]);

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Loading booking details...</Text>
            </View>
        );
    }

    if (!bookingData) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Booking not found</Text>
                <CustomButton
                    title="Go Back"
                    onPress={() => router.back()}
                />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <AppBar title="Report Booking Issue" showBackButton />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* User Information */}
                <View style={styles.infoCard}>
                    <Text style={styles.sectionTitle}>User Information</Text>
                    <View style={styles.infoRow}>
                        <Image source={require('../../../assets/avatar.png')} style={styles.infoIcon} />
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Name</Text>
                            <Text style={styles.infoValue}>{bookingData.user_id?.name || 'N/A'}</Text>
                        </View>
                    </View>
                    <View style={styles.infoRow}>
                        <Image source={require('../../../assets/Massages.png')} style={styles.infoIcon} />
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Email</Text>
                            <Text style={styles.infoValue}>{bookingData.user_id?.email || 'N/A'}</Text>
                        </View>
                    </View>
                </View>

                {/* Vehicle Information */}
                <View style={styles.infoCard}>
                    <Text style={styles.sectionTitle}>Vehicle Information</Text>
                    <View style={styles.infoRow}>
                        <Image source={require('../../../assets/car.png')} style={styles.infoIcon} />
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Vehicle</Text>
                            <Text style={styles.infoValue}>
                                {bookingData.vehicle_id?.make || 'Unknown'} {bookingData.vehicle_id?.model || 'Vehicle'}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.infoRow}>
                        <Image source={require('../../../assets/battery.png')} style={styles.infoIcon} />
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Battery Capacity</Text>
                            <Text style={styles.infoValue}>
                                {bookingData.vehicle_id?.battery_capacity ? `${bookingData.vehicle_id.battery_capacity}kWh` : 'N/A'}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Station Information */}
                <View style={styles.infoCard}>
                    <Text style={styles.sectionTitle}>Station Information</Text>
                    <View style={styles.infoRow}>
                        <Image source={require('../../../assets/stop.png')} style={styles.infoIcon} />
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Station Name</Text>
                            <Text style={styles.infoValue}>{bookingData.station_id?.station_name || 'N/A'}</Text>
                        </View>
                    </View>
                    <View style={styles.infoRow}>
                        <Image source={require('../../../assets/location.png')} style={styles.infoIcon} />
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Address</Text>
                            <Text style={styles.infoValue}>
                                {bookingData.station_id?.address || 'N/A'}, {bookingData.station_id?.city || 'N/A'}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Charger & Connector Information */}
                <View style={styles.infoCard}>
                    <Text style={styles.sectionTitle}>Charging Details</Text>
                    <View style={styles.infoRow}>
                        {/* <Image source={require('../../assets/charger.png')} style={styles.infoIcon} /> */}
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Charger</Text>
                            <Text style={styles.infoValue}>
                                {bookingData.charger_id?.charger_name || 'N/A'} ({bookingData.charger_id?.power_type || 'N/A'})
                            </Text>
                        </View>
                    </View>
                    <View style={styles.infoRow}>
                        {/* <Image source={require('../../assets/connector.png')} style={styles.infoIcon} /> */}
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Connector Type</Text>
                            <Text style={styles.infoValue}>{bookingData.connector_id?.type_name || 'N/A'} </Text>
                        </View>
                    </View>
                </View>

                {/* Booking Details */}
                <View style={styles.infoCard}>
                    <Text style={styles.sectionTitle}>Booking Details</Text>
                    <View style={styles.infoRow}>
                        {/* <Image source={require('../../assets/calendar.png')} style={styles.infoIcon} /> */}
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Booking Date</Text>
                            <Text style={styles.infoValue}>
                                {new Date(bookingData.booking_date).toLocaleDateString()}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.infoRow}>
                        <Image source={require('../../../assets/clock-icon.png')} style={styles.infoIcon} />
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Time Slot</Text>
                            <Text style={styles.infoValue}>
                                {new Date(bookingData.start_time).toLocaleTimeString()} - {new Date(bookingData.end_time).toLocaleTimeString()}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.infoRow}>
                        {/* <Image source={require('../../assets/status.png')} style={styles.infoIcon} /> */}
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Status</Text>
                            <Text style={[styles.infoValue, 
                                bookingData.status === 'completed' ? styles.statusCompleted : 
                                bookingData.status === 'confirmed' ? styles.statusConfirmed : styles.statusCancelled
                            ]}>
                                {bookingData.status}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.infoRow}>
                        {/* <Image source={require('../../assets/money.png')} style={styles.infoIcon} /> */}
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Total Cost</Text>
                            <Text style={styles.infoValue}>LKR {bookingData.cost || '0.00'}</Text>
                        </View>
                    </View>
                </View>

                {/* Divider */}
                <View style={styles.divider} />

                {/* Issue Category Dropdown */}
                <DropdownField
                    label="Issue Category"
                    selectedValue={selectedCategory}
                    onValueChange={setSelectedCategory}
                    placeholder="Select the category"
                    options={bookingIssueCategories}
                    displayProperty="label"
                    style={styles.dropdown}
                />

                {/* Description Input */}
                <InputField
                    label="Description"
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Describe the issue with your booking..."
                    placeholderTextColor={colors.secondaryText}
                    multiline={true}
                    numberOfLines={4}
                    style={styles.descriptionInput}
                    inputStyle={styles.descriptionTextInput}
                    containerStyle={styles.descriptionContainer}
                    required={true}
                />

                {/* Attachment Section */}
                <View style={styles.attachmentContainer}>
                    <Text style={styles.attachmentLabel}>Attachments (Optional)</Text>

                    <TouchableOpacity
                        style={styles.attachmentButton}
                        onPress={pickImage}
                    >
                        <Image
                            source={require('../../../assets/Attached.png')}
                            style={styles.attachmentIcon}
                        />
                        <Text style={styles.attachmentButtonText}>Add Photos</Text>
                    </TouchableOpacity>

                    {attachments.length > 0 && (
                        <View style={styles.attachmentsList}>
                            {attachments.map((attachment, index) => (
                                <View key={index} style={styles.attachmentItem}>
                                    <Image
                                        source={{ uri: attachment.uri }}
                                        style={styles.attachmentImage}
                                    />
                                    <TouchableOpacity
                                        style={styles.removeButton}
                                        onPress={() => removeAttachment(index)}
                                    >
                                        <Image
                                            source={require('../../../assets/Closeaffordance.png')}
                                            style={styles.removeIcon}
                                        />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    )}

                    {attachments.length > 0 && (
                        <Text style={styles.attachmentInfo}>
                            {attachments.length} of 5 photos selected
                        </Text>
                    )}
                </View>

                {/* Submit Button */}
                <CustomButton
                    title={isSubmitting ? "Submitting..." : "Submit Report"}
                    onPress={handleSubmit}
                    type="primary"
                    style={styles.submitButton}
                    disabled={isSubmitting}
                />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: SCREEN_WIDTH * 0.06,
        paddingBottom: SCREEN_HEIGHT * 0.05,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    loadingText: {
        marginTop: 16,
        fontFamily: fonts.PlusJakartaSans,
        color: colors.mainTextColor,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        fontFamily: fonts.PlusJakartaSans,
        color: colors.secondaryText,
        marginBottom: 20,
    },
    infoCard: {
        backgroundColor: colors.background,
        borderRadius: 12,
        padding: SCREEN_WIDTH * 0.04,
        marginBottom: SCREEN_HEIGHT * 0.02,
        borderWidth: 1,
        borderColor: colors.stroke,
    },
    sectionTitle: {
        fontSize: SCREEN_WIDTH * 0.04,
        fontFamily: fonts.PlusJakartaSansBold,
        color: colors.mainTextColor,
        marginBottom: SCREEN_HEIGHT * 0.015,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SCREEN_HEIGHT * 0.015,
    },
    infoIcon: {
        width: SCREEN_WIDTH * 0.06,
        height: SCREEN_WIDTH * 0.06,
        tintColor: colors.secondaryText,
        marginRight: SCREEN_WIDTH * 0.03,
    },
    infoContent: {
        flex: 1,
    },
    infoLabel: {
        fontSize: SCREEN_WIDTH * 0.035,
        fontFamily: fonts.PlusJakartaSansMedium,
        color: colors.secondaryText,
        marginBottom: 2,
    },
    infoValue: {
        fontSize: SCREEN_WIDTH * 0.04,
        fontFamily: fonts.PlusJakartaSans,
        color: colors.mainTextColor,
    },
    statusCompleted: {
        color: colors.success,
    },
    statusConfirmed: {
        color: colors.primary,
    },
    statusCancelled: {
        color: colors.danger,
    },
    divider: {
        height: 1,
        backgroundColor: colors.stroke,
        marginVertical: SCREEN_HEIGHT * 0.02,
    },
    dropdown: {
        marginBottom: SCREEN_HEIGHT * 0.03,
    },
    descriptionContainer: {
        marginBottom: SCREEN_HEIGHT * 0.04,
    },
    descriptionInput: {
        minHeight: SCREEN_HEIGHT * 0.15,
    },
    descriptionTextInput: {
        textAlignVertical: 'top',
        minHeight: SCREEN_HEIGHT * 0.12,
        paddingTop: SCREEN_WIDTH * 0.04,
    },
    attachmentContainer: {
        marginBottom: SCREEN_HEIGHT * 0.04,
    },
    attachmentLabel: {
        fontSize: SCREEN_WIDTH * 0.04,
        fontFamily: fonts.PlusJakartaSansMedium,
        color: colors.mainTextColor,
        marginBottom: SCREEN_HEIGHT * 0.015,
    },
    attachmentButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.stroke,
        borderStyle: 'dashed',
        borderRadius: 8,
        padding: SCREEN_WIDTH * 0.04,
        marginBottom: SCREEN_HEIGHT * 0.02,
    },
    attachmentIcon: {
        width: SCREEN_WIDTH * 0.06,
        height: SCREEN_WIDTH * 0.06,
        tintColor: colors.secondaryText,
        marginRight: SCREEN_WIDTH * 0.03,
    },
    attachmentButtonText: {
        fontSize: SCREEN_WIDTH * 0.04,
        fontFamily: fonts.PlusJakartaSans,
        color: colors.secondaryText,
    },
    attachmentsList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SCREEN_WIDTH * 0.03,
        marginBottom: SCREEN_HEIGHT * 0.02,
    },
    attachmentItem: {
        position: 'relative',
        width: SCREEN_WIDTH * 0.25,
        height: SCREEN_WIDTH * 0.25,
        borderRadius: 8,
        overflow: 'hidden',
    },
    attachmentImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    removeButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderRadius: 12,
        padding: 4,
    },
    removeIcon: {
        width: SCREEN_WIDTH * 0.04,
        height: SCREEN_WIDTH * 0.04,
        tintColor: colors.background,
    },
    attachmentInfo: {
        fontSize: SCREEN_WIDTH * 0.035,
        fontFamily: fonts.PlusJakartaSans,
        color: colors.secondaryText,
        textAlign: 'center',
    },
    submitButton: {
        marginTop: SCREEN_HEIGHT * 0.02,
    },
});

export default BookingReportScreen;