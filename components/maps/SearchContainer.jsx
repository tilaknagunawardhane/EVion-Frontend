import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../../constants/color';
import fonts from '../../constants/fonts';

const SearchContainer = ({
  searchQuery,
  setSearchQuery,
  fetchSuggestions,
  onFilterPress,
  hideFilterButton = false,
  placeholder = 'Search an area...'
}) => {
  return (
    <View style={styles.container}>
      {/* Search Container */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder={placeholder}
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
            fetchSuggestions && fetchSuggestions(text);
          }}
          placeholderTextColor={colors.secondaryText}
        />
        <View style={styles.iconContainer}>
          <MaterialIcons name="search" size={24} color={colors.secondaryText} />
        </View>
      </View>

      {/* Separate Filter Button */}
      {!hideFilterButton && (
        <TouchableOpacity 
          style={styles.filterButton} 
          onPress={onFilterPress}
          activeOpacity={0.7}
        >
          <MaterialIcons name="filter-list" size={24} color={colors.background} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 80,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  searchContainer: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingHorizontal: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    marginRight: 10, // Space between search and filter button
  },
  searchInput: { 
    flex: 1, 
    paddingVertical: 8, 
    fontFamily: fonts.PlusJakartaSans, 
    color: colors.mainTextColor 
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: 40,
  },
  filterButton: {
    backgroundColor: colors.primary,
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
});

export default SearchContainer;