import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import colors from '../../../constants/color';
import fonts from '../../../constants/fonts';
import AchievementBadge from '../../../components/AchievementBadge';
import { 
  achievements, 
  achievementCategories, 
  getAchievementsByCategory,
  getAchievementProgress 
} from '../../../constants/achievements';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const AchievementsScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const handleBackPress = () => {
    router.back();
  };

  const getFilteredAchievements = () => {
    if (selectedCategory === 'all') {
      return achievements;
    }
    return getAchievementsByCategory(selectedCategory);
  };

  const getCategoryName = (category) => {
    switch (category) {
      case achievementCategories.CHARGING:
        return 'Charging';
      case achievementCategories.EXPLORATION:
        return 'Exploration';
      case achievementCategories.COMMUNITY:
        return 'Community';
      case achievementCategories.ENVIRONMENTAL:
        return 'Environmental';
      case achievementCategories.MILESTONES:
        return 'Milestones';
      default:
        return 'All';
    }
  };

  const categories = [
    'all',
    achievementCategories.CHARGING,
    achievementCategories.EXPLORATION,
    achievementCategories.ENVIRONMENTAL,
    achievementCategories.COMMUNITY,
    achievementCategories.MILESTONES,
  ];

  const progress = getAchievementProgress();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" backgroundColor={colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleBackPress}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={colors.mainTextColor} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Achievements</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Progress Overview */}
      <View style={styles.overviewCard}>
        <Text style={styles.overviewTitle}>Your Progress</Text>
        <Text style={styles.overviewStats}>
          {progress.unlocked} of {progress.total} achievements unlocked
        </Text>
        <View style={styles.overviewProgressBar}>
          <View 
            style={[
              styles.overviewProgressFill, 
              { width: `${progress.percentage}%` }
            ]} 
          />
        </View>
        <Text style={styles.overviewPercentage}>{progress.percentage}% Complete</Text>
      </View>

      {/* Category Filter */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScroll}
        style={styles.categoryContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.categoryButtonActive
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[
              styles.categoryText,
              selectedCategory === category && styles.categoryTextActive
            ]}>
              {getCategoryName(category)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Achievements List */}
      <ScrollView 
        style={styles.achievementsList}
        showsVerticalScrollIndicator={false}
      >
        {getFilteredAchievements().map((achievement) => (
          <AchievementBadge
            key={achievement.id}
            title={achievement.title}
            description={achievement.description}
            icon={achievement.icon}
            isUnlocked={achievement.isUnlocked}
            progress={achievement.progress}
            type={achievement.type}
          />
        ))}
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
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.stroke,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.mainTextColor,
    textAlign: 'center',
    flex: 1,
  },
  headerSpacer: {
    width: 34, // Match the back button width
  },
  overviewCard: {
    backgroundColor: colors.white,
    margin: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.stroke,
    alignItems: 'center',
  },
  overviewTitle: {
    fontSize: 18,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.mainTextColor,
    marginBottom: 8,
  },
  overviewStats: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
    marginBottom: 16,
  },
  overviewProgressBar: {
    width: '100%',
    height: 8,
    backgroundColor: colors.stroke,
    borderRadius: 4,
    marginBottom: 8,
  },
  overviewProgressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  overviewPercentage: {
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.primary,
  },
  categoryContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  categoryScroll: {
    paddingRight: 20,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.stroke,
  },
  categoryButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.secondaryText,
  },
  categoryTextActive: {
    color: colors.white,
  },
  achievementsList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});

export default AchievementsScreen;