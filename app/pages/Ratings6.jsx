import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import colors from '../../constants/color';
import fonts from '../../constants/fonts';

const Ratings6 = () => {
  const [selectedRating, setSelectedRating] = useState(5);
  const [selectedFeedback, setSelectedFeedback] = useState([]);

  const ratingLabels = {
    1: 'Very Poor',
    2: 'Poor',
    3: 'Average',
    4: 'Good',
    5: 'Excellent'
  };

  const feedbackOptions = [
    'Smooth, stress-free trip',
    'Well-timed station suggestions',
    'Minimal stops',
    'Efficient route',
    'Stations available as planned'
  ];

  const handleStarPress = (rating) => {
    // Only allow selection of the fifth star (Excellent)
    if (rating === 5) {
      setSelectedRating(rating);
    }
  };

  const handleBackPress = () => {
    router.push('/pages/Ratings5');
  };

  const handleFeedbackPress = (feedback) => {
    if (selectedFeedback.includes(feedback)) {
      setSelectedFeedback(selectedFeedback.filter(item => item !== feedback));
    } else {
      setSelectedFeedback([...selectedFeedback, feedback]);
    }
  };

  const handleSubmit = () => {
    // Handle submit logic here
    console.log('Rating:', selectedRating);
    console.log('Feedback:', selectedFeedback);
    // You can add navigation or API call here
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const isClickable = i === 5; // Only fifth star is clickable
      const isSelected = i <= 5; // All 5 stars should be colored
      
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => handleStarPress(i)}
          style={[styles.starButton, !isClickable && styles.disabledStar]}
          disabled={!isClickable}
        >
          <Ionicons
            name={isSelected ? "star" : "star-outline"}
            size={40}
            color={isSelected ? colors.primary : colors.secondaryText}
            style={!isClickable && styles.disabledStarIcon}
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.mainTextColor} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>How was Your Experience?</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Content */}
        <View style={styles.content}>
          {/* Rating Label */}
          <Text style={styles.ratingLabel}>{ratingLabels[selectedRating]}</Text>
          
          {/* Star Rating */}
          <View style={styles.starContainer}>
            {renderStars()}
          </View>

          {/* Feedback Section - Only show for Excellent rating */}
          {selectedRating === 5 && (
            <View style={styles.feedbackSection}>
              <Text style={styles.feedbackTitle}>What did you like?</Text>
              
              {/* Feedback Options */}
              <View style={styles.feedbackOptions}>
                {feedbackOptions.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.feedbackOption,
                      selectedFeedback.includes(option) && styles.feedbackOptionSelected
                    ]}
                    onPress={() => handleFeedbackPress(option)}
                  >
                    <Text
                      style={[
                        styles.feedbackOptionText,
                        selectedFeedback.includes(option) && styles.feedbackOptionTextSelected
                      ]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.submitContainer}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
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
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 20,
    alignItems: 'center',
  },
  ratingLabel: {
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.mainTextColor,
    marginBottom: 20,
  },
  starContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80%',
    maxWidth: 300,
    marginBottom: 50,
  },
  starButton: {
    padding: 8,
  },
  disabledStar: {
    opacity: 0.5,
  },
  disabledStarIcon: {
    opacity: 0.3,
  },
  feedbackSection: {
    width: '100%',
    alignItems: 'center',
  },
  feedbackTitle: {
    fontSize: 16,
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
  submitContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 16,
    backgroundColor: colors.background,
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: '#ffffff',
  },
});

export default Ratings6;