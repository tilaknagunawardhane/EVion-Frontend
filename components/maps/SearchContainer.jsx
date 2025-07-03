import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../../constants/color';
import fonts from '../../constants/fonts';

const SearchContainer = ({
  searchQuery,
  setSearchQuery,
  fetchSuggestions,
}) => {
  return (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search an area..."
        value={searchQuery}
        onChangeText={(text) => {
          setSearchQuery(text);
          fetchSuggestions(text);
        }}
        placeholderTextColor={colors.secondaryText}
      />
      <View style={styles.iconContainer}>
        <MaterialIcons name="search" size={24} color={colors.secondaryText} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    position: 'absolute',
    top: 80,
    left: 20,
    right: 80,
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
    zIndex: 10,
    height: 48,
    color: colors.secondaryText,
  },
  searchInput: { flex: 1, paddingVertical: 8, fontFamily: fonts.PlusJakartaSans, color: colors.mainTextColor },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: 40,
  },
});

export default SearchContainer;
