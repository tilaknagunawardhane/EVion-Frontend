// Achievement definitions for EVion app
export const achievementCategories = {
  CHARGING: 'charging',
  EXPLORATION: 'exploration', 
  COMMUNITY: 'community',
  ENVIRONMENTAL: 'environmental',
  MILESTONES: 'milestones'
};

export const achievementTypes = {
  DEFAULT: 'default',
  BRONZE: 'bronze',
  SILVER: 'silver', 
  GOLD: 'gold',
  RARE: 'rare',
  LEGENDARY: 'legendary'
};

export const achievements = [
  // Charging Achievements
  {
    id: 'first_charge',
    title: 'First Charge',
    description: 'Complete your first charging session',
    icon: 'flash',
    category: achievementCategories.CHARGING,
    type: achievementTypes.BRONZE,
    requirement: 1,
    isUnlocked: true,
  },
  {
    id: 'charging_veteran',
    title: 'Charging Veteran',
    description: 'Complete 10 charging sessions',
    icon: 'battery-charging',
    category: achievementCategories.CHARGING,
    type: achievementTypes.SILVER,
    requirement: 10,
    isUnlocked: true,
    progress: 100,
  },
  {
    id: 'power_user',
    title: 'Power User',
    description: 'Complete 50 charging sessions',
    icon: 'flash',
    category: achievementCategories.CHARGING,
    type: achievementTypes.GOLD,
    requirement: 50,
    isUnlocked: false,
    progress: 76,
  },
  
  // Exploration Achievements
  {
    id: 'explorer',
    title: 'Explorer',
    description: 'Visit 5 different charging stations',
    icon: 'map',
    category: achievementCategories.EXPLORATION,
    type: achievementTypes.BRONZE,
    requirement: 5,
    isUnlocked: true,
  },
  {
    id: 'station_hopper',
    title: 'Station Hopper',
    description: 'Visit 15 different charging stations',
    icon: 'location',
    category: achievementCategories.EXPLORATION,
    type: achievementTypes.SILVER,
    requirement: 15,
    isUnlocked: false,
    progress: 60,
  },
  {
    id: 'road_warrior',
    title: 'Road Warrior',
    description: 'Travel 1000km using EV charging',
    icon: 'car-sport',
    category: achievementCategories.EXPLORATION,
    type: achievementTypes.GOLD,
    requirement: 1000,
    isUnlocked: false,
    progress: 45,
  },
  
  // Environmental Achievements
  {
    id: 'eco_warrior',
    title: 'Eco Warrior',
    description: 'Save 100kg of CO2 emissions',
    icon: 'leaf',
    category: achievementCategories.ENVIRONMENTAL,
    type: achievementTypes.RARE,
    requirement: 100,
    isUnlocked: true,
  },
  {
    id: 'green_champion',
    title: 'Green Champion',
    description: 'Use renewable energy for 20 charges',
    icon: 'sunny',
    category: achievementCategories.ENVIRONMENTAL,
    type: achievementTypes.GOLD,
    requirement: 20,
    isUnlocked: false,
    progress: 35,
  },
  
  // Community Achievements
  {
    id: 'social_charger',
    title: 'Social Charger',
    description: 'Share 5 station reviews',
    icon: 'people',
    category: achievementCategories.COMMUNITY,
    type: achievementTypes.BRONZE,
    requirement: 5,
    isUnlocked: true,
  },
  {
    id: 'helpful_member',
    title: 'Helpful Member',
    description: 'Help 10 community members',
    icon: 'heart',
    category: achievementCategories.COMMUNITY,
    type: achievementTypes.SILVER,
    requirement: 10,
    isUnlocked: false,
    progress: 20,
  },
  
  // Milestone Achievements
  {
    id: 'early_adopter',
    title: 'Early Adopter',
    description: 'One of the first 1000 users',
    icon: 'star',
    category: achievementCategories.MILESTONES,
    type: achievementTypes.LEGENDARY,
    requirement: 1,
    isUnlocked: true,
  },
  {
    id: 'night_owl',
    title: 'Night Owl',
    description: 'Charge between 10PM - 6AM',
    icon: 'moon',
    category: achievementCategories.MILESTONES,
    type: achievementTypes.RARE,
    requirement: 5,
    isUnlocked: false,
    progress: 80,
  },
  {
    id: 'weekend_warrior',
    title: 'Weekend Warrior',
    description: 'Complete 10 weekend charges',
    icon: 'calendar',
    category: achievementCategories.MILESTONES,
    type: achievementTypes.SILVER,
    requirement: 10,
    isUnlocked: false,
    progress: 90,
  },
  {
    id: 'speed_demon',
    title: 'Speed Demon',
    description: 'Use fast charging 25 times',
    icon: 'flash',
    category: achievementCategories.CHARGING,
    type: achievementTypes.RARE,
    requirement: 25,
    isUnlocked: false,
    progress: 64,
  },
  {
    id: 'loyalty_member',
    title: 'Loyalty Member',
    description: 'Use EVion for 6 months',
    icon: 'trophy',
    category: achievementCategories.MILESTONES,
    type: achievementTypes.GOLD,
    requirement: 6,
    isUnlocked: true,
  },
  {
    id: 'connector_master',
    title: 'Connector Master',
    description: 'Use all connector types',
    icon: 'options',
    category: achievementCategories.EXPLORATION,
    type: achievementTypes.RARE,
    requirement: 4,
    isUnlocked: false,
    progress: 75,
  },
];

// Helper functions
export const getUnlockedAchievements = () => {
  return achievements.filter(achievement => achievement.isUnlocked);
};

export const getAchievementsByCategory = (category) => {
  return achievements.filter(achievement => achievement.category === category);
};

export const getAchievementProgress = () => {
  const total = achievements.length;
  const unlocked = getUnlockedAchievements().length;
  return {
    total,
    unlocked,
    percentage: Math.round((unlocked / total) * 100)
  };
};