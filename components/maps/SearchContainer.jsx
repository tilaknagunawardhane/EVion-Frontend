import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../../constants/color';
import fonts from '../../constants/fonts';

const SearchContainer = ({
  searchQuery,
  setSearchQuery,
  fetchSuggestions,
  handleSearch
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
      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <MaterialIcons name="search" size={24} color="#fff" />
      </TouchableOpacity>
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
  searchButton: {
    position: 'absolute',
    right: -50,
    top: 5,
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 20,
    elevation: 3,
  },
});

export default SearchContainer;
