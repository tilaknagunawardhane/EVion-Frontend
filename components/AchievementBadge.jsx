import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/color';
import fonts from '../constants/fonts';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const AchievementBadge = ({ 
  title, 
  description, 
  icon, 
  isUnlocked = false, 
  progress = 0, 
  type = 'default' 
}) => {
  const getBadgeColor = () => {
    switch (type) {
      case 'gold':
        return '#FFD700';
      case 'silver':
        return '#C0C0C0';
      case 'bronze':
        return '#CD7F32';
      case 'rare':
        return '#9B59B6';
      case 'legendary':
        return '#E74C3C';
      default:
        return colors.primary;
    }
  };

  const badgeColor = getBadgeColor();

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: isUnlocked ? colors.white : colors.lightestGray,
        borderColor: isUnlocked ? badgeColor : colors.stroke,
        opacity: isUnlocked ? 1 : 0.6
      }
    ]}>
      <View style={[
        styles.iconContainer,
        { backgroundColor: isUnlocked ? badgeColor : colors.lightGray }
      ]}>
        <Ionicons 
          name={icon} 
          size={20} 
          color={isUnlocked ? colors.white : colors.secondaryText} 
        />
      </View>
      
      <View style={styles.textContainer}>
        <Text style={[
          styles.title,
          { color: isUnlocked ? colors.mainTextColor : colors.secondaryText }
        ]}>
          {title}
        </Text>
        <Text style={[
          styles.description,
          { color: isUnlocked ? colors.secondaryText : colors.lightGray }
        ]}>
          {description}
        </Text>
        
        {!isUnlocked && progress > 0 && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBackground}>
              <View 
                style={[
                  styles.progressFill,
                  { 
                    width: `${Math.min(progress, 100)}%`,
                    backgroundColor: badgeColor 
                  }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>{Math.round(progress)}%</Text>
          </View>
        )}
      </View>
      
      {isUnlocked && (
        <View style={[styles.unlockedIndicator, { backgroundColor: badgeColor }]}>
          <Ionicons name="checkmark" size={12} color={colors.white} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    marginVertical: 4,
    borderWidth: 1.5,
    borderColor: colors.stroke,
    position: 'relative',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: SCREEN_WIDTH < 375 ? 14 : 15,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.mainTextColor,
    marginBottom: 2,
  },
  description: {
    fontSize: SCREEN_WIDTH < 375 ? 11 : 12,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
    lineHeight: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  progressBackground: {
    flex: 1,
    height: 4,
    backgroundColor: colors.stroke,
    borderRadius: 2,
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 10,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.secondaryText,
    minWidth: 30,
  },
  unlockedIndicator: {
    position: 'absolute',
    top: -3,
    right: -3,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AchievementBadge;