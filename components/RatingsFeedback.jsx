import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import colors from '../constants/color';
import fonts from '../constants/fonts';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const RatingsFeedback = ({
    feedbackOptions = [],
    selectedFeedback = [],
    onFeedbackPress = () => { },
    feedbackLabel = 'What went wrong?'
}) => (
    <View style={styles.feedbackSection}>
        
        <View style={{ height: 1, backgroundColor: colors.border, width: '100%' , marginTop: SCREEN_HEIGHT * 0.08, marginBottom: SCREEN_HEIGHT * 0.08, }} />
                <View style={{ width: 24 }} />
        
        <Text style={styles.feedbackTitle}>{feedbackLabel}</Text>
        <View style={styles.feedbackOptions}>
            {feedbackOptions.map((option, index) => (
                <TouchableOpacity
                    key={index}
                    style={[
                        styles.feedbackOption,
                        selectedFeedback.includes(option) && styles.feedbackOptionSelected,
                    ]}
                    onPress={() => onFeedbackPress(option)}
                >
                    <Text
                        style={[
                            styles.feedbackOptionText,
                            selectedFeedback.includes(option) && styles.feedbackOptionTextSelected,
                        ]}
                    >
                        {option}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    </View>
);

const styles = StyleSheet.create({
    feedbackSection: {
        width: '100%',
        alignItems: 'center',
    },
    feedbackTitle: {
    fontSize: SCREEN_WIDTH * 0.04,
        fontFamily: fonts.PlusJakartaSansMedium,
        color: colors.mainTextColor,
        marginBottom: 20,
    },
    feedbackOptions: {
        width: '100%',
        gap: 12,
    },
    feedbackOption: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        backgroundColor: colors.background,
    },
    feedbackOptionSelected: {
        borderColor: colors.primary,
        backgroundColor: colors.bgGreen,
    },
    feedbackOptionText: {
        fontSize: 14,
        fontFamily: fonts.PlusJakartaSans,
        color: colors.secondaryText,
        textAlign: 'center',
    },
    feedbackOptionTextSelected: {
        color: colors.primary,
        fontFamily: fonts.PlusJakartaSansMedium,
    },
});

export default RatingsFeedback;
