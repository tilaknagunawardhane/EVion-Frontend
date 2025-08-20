import React, { useState } from 'react';
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
import useUserData from '../../hooks/useUserData';
import * as SecureStore from 'expo-secure-store';

import AppBar from '../../components/AppBar';
import CustomButton from '../../components/CustomButton';
import DropdownField from '../../components/DropdownField';
import InputField from '../../components/InputField';
import colors from '../../constants/color';
import fonts from '../../constants/fonts';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const ReportIssueScreen = () => {
    const { user, isLoading: isUserLoading } = useUserData();

    const router = useRouter();
    const params = useLocalSearchParams();
    const { stationId, station_name, station_address, station_city } = params;

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [description, setDescription] = useState('');
    const [attachments, setAttachments] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const issueCategories = [
        { id: 'station-1', label: 'Station Access Problems' },
        { id: 'station-2', label: 'Parking Area Issues' },
        { id: 'station-3', label: 'Lighting Problems' },
        { id: 'station-4', label: 'Safety Concerns' },
        { id: 'station-5', label: 'Payment System Failure' },
        { id: 'station-6', label: 'Network Connectivity Issues' },
        { id: 'station-7', label: 'Station Hygiene Problems' },
        { id: 'station-8', label: 'Facility Damage' },
        { id: 'station-9', label: 'Security Issues' },
        { id: 'station-10', label: 'Other Station Issues' }
    ];

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


    const pickSingleImage = async () => {
        try {
            // Request permissions
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission required', 'Please allow access to your photos to attach images.');
                return;
            }

            // Launch image picker for single image with editing
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaType.Images,
                allowsEditing: true, // Enable editing for single image
                aspect: [4, 3],
                quality: 0.8,
                allowsMultipleSelection: false, // Single selection
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

        // Send only the category label (string) instead of the whole object
        const response = await fetch(`${API_BASE_URL}/api/reports/submit-report`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: user._id,
                stationId,
                category: selectedCategory.label, // Send only the label string
                description,
                attachments: attachments.map(att => att.uri), // Send only the URIs as strings
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to submit report');
        }

        const data = await response.json();
        Toast.show({
            type: ALERT_TYPE.SUCCESS,
            title: 'Success',
            textBody: 'Issue reported successfully!',
        });
        router.back();

    } catch (error) {
        console.error('Error submitting report:', error);
        Toast.show({
            type: ALERT_TYPE.DANGER,
            title: 'Error',
            textBody: error.message || 'Failed to submit report',
        });
    } finally {
        setIsSubmitting(false);
    }
};

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
                <Text style={styles.loadingText}>Please sign in to add a vehicle</Text>
                <CustomButton
                    title="Go to Sign In"
                    onPress={() => router.replace('/pages/SignInScreen')}
                    type="primary"
                    style={{ marginTop: 20 }}
                />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <AppBar title="Report an Issue" showBackButton />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Charging Station Info */}
                <View style={styles.stationCard}>
                    <View style={styles.stationHeader}>
                        <Image
                            source={require('../../assets/charging-station.png')}
                            style={styles.stationIcon}
                        />
                        <View style={styles.stationInfo}>
                            <Text style={styles.stationName}>{station_name}</Text>
                            <Text style={styles.stationAddress}>{station_address}, {station_city}</Text>
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
                    options={issueCategories}
                    displayProperty="label"
                    style={styles.dropdown}
                />

                {/* Description Input */}
                <InputField
                    label="Description"
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Add text here..."
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

                    {/* Attachment Button */}
                    <TouchableOpacity
                        style={styles.attachmentButton}
                        onPress={Platform.OS === 'ios' ? pickSingleImage : pickImage}
                    >
                        <Image
                            source={require('../../assets/Attached.png')}
                            style={styles.attachmentIcon}
                        />
                        <Text style={styles.attachmentButtonText}>
                            {Platform.OS === 'ios' ? 'Add Photo' : 'Add Photos'}
                        </Text>
                    </TouchableOpacity>

                    {/* Attachments Preview */}
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
                                            source={require('../../assets/Closeaffordance.png')}
                                            style={styles.removeIcon}
                                        />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Attachment limit info */}
                    {attachments.length > 0 && (
                        <Text style={styles.attachmentInfo}>
                            {attachments.length} of 5 photos selected
                        </Text>
                    )}
                </View>

                {/* Submit Button */}
                <CustomButton
                    title={isSubmitting ? "Submitting..." : "Submit"}
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
    stationCard: {
        backgroundColor: colors.background,
        borderRadius: 12,
        padding: SCREEN_WIDTH * 0.04,
        marginBottom: SCREEN_HEIGHT * 0.02,
    },
    stationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    stationIcon: {
        width: SCREEN_WIDTH * 0.1,
        height: SCREEN_WIDTH * 0.1,
        marginRight: SCREEN_WIDTH * 0.04,
    },
    stationInfo: {
        flex: 1,
    },
    stationName: {
        fontSize: SCREEN_WIDTH * 0.045,
        fontFamily: fonts.PlusJakartaSansBold,
        color: colors.mainTextColor,
        marginBottom: 4,
    },
    stationAddress: {
        fontSize: SCREEN_WIDTH * 0.035,
        fontFamily: fonts.PlusJakartaSans,
        color: colors.secondaryText,
        lineHeight: 20,
    },
    divider: {
        height: 1,
        backgroundColor: colors.stroke,
        marginVertical: SCREEN_HEIGHT * 0.005,
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
});

export default ReportIssueScreen;