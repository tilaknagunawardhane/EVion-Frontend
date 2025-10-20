import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar, 
  ScrollView,
  Dimensions
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { router } from 'expo-router';
import colors from '../../constants/color';
import fonts from '../../constants/fonts';
import RatingsFeedback from '../../components/RatingsFeedback';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// SVG Icons as components
const ChevronBackIcon = ({ size = 24, color = '#000' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M15 18L9 12L15 6" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

const StarOutlineIcon = ({ size = 24, color = '#000' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

const StarFilledIcon = ({ size = 24, color = '#000' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
      fill={color}
    />
  </Svg>
);

const Ratings1 = () => {
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedFeedback, setSelectedFeedback] = useState([]);

  const ratingLabels = {
    0: 'Please take a moment to rate',
    1: 'Very Poor',
    2: 'Poor',
    3: 'Average',
    4: 'Good',
    5: 'Excellent'
  };

  const feedbackOptionsMap = {
    1: [
      'Inaccurate route suggestions',
      'Too many unnecessary stops',
      'Suggested stations were full',
      "Couldn't complete the trip"
    ],
    2: [
      'Stops not well-placed',
      'Wrong distance or time estimates',
      'Suggested unavailable stations'
    ],
    3: [
      'Route worked but not ideal',
      'Fewer stops expected',
      'Availability not consistent'
    ],
    4: [
      'Some unnecessary stops',
      'Station availability could improve',
      'Suggestions mostly helpful'
    ],
    5: [
      'Smooth, stress-free trip',
      'Well-timed station suggestions',
      'Minimal stops',
      'Efficient route',
      'Stations available as planned'
    ]
  };

  const feedbackLables = {
    1: ['What went wrong?'],
    2: ['Issues you noticed'],
    3: ['What could be better?'],
    4: ['Almost perfect, but…'],
    5: ['What did you like?']
  };

  const handleStarPress = (rating) => {
    setSelectedRating(rating);
    setSelectedFeedback([]);
  };

  const handleBackPress = () => {
    router.push('/(tabs)/');
  };

  const handleFeedbackPress = (feedback) => {
    if (selectedFeedback.includes(feedback)) {
      setSelectedFeedback(selectedFeedback.filter(item => item !== feedback));
    } else {
      setSelectedFeedback([...selectedFeedback, feedback]);
    }
  };

  const handleSubmit = () => {
    router.push('/(tabs)/bookings')
    console.log('Rating:', selectedRating);
    console.log('Feedback:', selectedFeedback);
  };

  const renderStars = () => {
    return Array(5).fill(0).map((_, i) => {
      const ratingValue = i + 1;
      const isSelected = ratingValue <= selectedRating;
      return (
        <TouchableOpacity
          key={ratingValue}
          onPress={() => handleStarPress(ratingValue)}
          style={styles.starButton}
        >
          {isSelected ? (
            <StarFilledIcon 
              size={SCREEN_WIDTH * 0.08} 
              color={colors.primary}
            />
          ) : (
            <StarOutlineIcon 
              size={SCREEN_WIDTH * 0.08} 
              color={colors.secondaryText}
            />
          )}
        </TouchableOpacity>
      );
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <ChevronBackIcon 
            size={SCREEN_WIDTH * 0.06} 
            color={colors.mainTextColor}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>How was Your Experience?</Text>
        <View style={{ width: SCREEN_WIDTH * 0.02 }} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Content */}
        <View style={styles.content}>
          {/* Rating Label */}
          <Text style={styles.ratingLabel}>
            {selectedRating > 0 ? ratingLabels[selectedRating] : ratingLabels[0]}
          </Text>

          {/* Star Rating */}
          <View style={styles.starContainer}>
            {renderStars()}
          </View>

          {/* Feedback Section */}
          {selectedRating > 0 && (
            <RatingsFeedback
              feedbackOptions={feedbackOptionsMap[selectedRating] || []}
              selectedFeedback={selectedFeedback}
              onFeedbackPress={handleFeedbackPress}
              feedbackLabel={feedbackLables[selectedRating]?.[0] || 'What went wrong?'}
            />
          )}
        </View>
      </ScrollView>

      {/* Submit Button */}
      {selectedRating > 0 && (
        <View style={styles.submitContainer}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

// Responsive styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SCREEN_WIDTH * 0.04,
    paddingVertical: SCREEN_HEIGHT * 0.02,
    backgroundColor: colors.background,
  },
  backButton: {
    padding: SCREEN_WIDTH * 0.02,
  },
  headerTitle: {
    fontSize: SCREEN_WIDTH * 0.05,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.mainTextColor,
    textAlign: 'center',
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: SCREEN_HEIGHT * 0.1,
  },
  content: {
    paddingHorizontal: SCREEN_WIDTH * 0.06,
    paddingTop: SCREEN_HEIGHT * 0.03,
    alignItems: 'center',
    width: '100%',
  },
  ratingLabel: {
    fontSize: SCREEN_WIDTH * 0.04,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.mainTextColor,
    marginBottom: SCREEN_HEIGHT * 0.02,
    textAlign: 'center',
  },
  starContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: SCREEN_WIDTH * 0.8,
    maxWidth: 400,
  },
  starButton: {
    padding: SCREEN_WIDTH * 0.03,
  },
  submitContainer: {
    paddingHorizontal: SCREEN_WIDTH * 0.06,
    paddingBottom: SCREEN_HEIGHT * 0.04,
    paddingTop: SCREEN_HEIGHT * 0.02,
    backgroundColor: colors.background,
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: SCREEN_HEIGHT * 0.015,
    borderRadius: SCREEN_WIDTH * 0.03,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    fontSize: SCREEN_WIDTH * 0.04,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.background,
  },
});

export default Ratings1;