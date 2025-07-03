import React from 'react';
import { View, FlatList, TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../../constants/color';
import fonts from '../../constants/fonts';

const SuggestionsDropdown = ({
  suggestions = [],
  onSelect,
  getDetails,
  style
}) => {
  if (!suggestions.length) return null;
  return (
    <View style={[styles.resultsContainer, style]}>
      <FlatList
        data={suggestions}
        keyExtractor={(item) => item.id || item.place_id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.resultItem}
            onPress={async () => {
              try {
                let details;
                if (item.isLocal) {
                  details = { lat: item.latitude, lng: item.longitude };
                  onSelect(details, item.description, true);
                } else {
                  details = await getDetails(item.place_id);
                  onSelect(details, item.description, false);
                }
              } catch (error) {
                console.error('Error fetching place details:', error);
                Alert.alert('Error fetching location details.');
              }
            }}
          >
            <Text style={{ fontFamily: fonts.PlusJakartaSans }}>
              {item.description}
              {item.isLocal ? ' (Station)' : ''}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  resultsContainer: {
    position: 'absolute',
    top: 140,
    left: 20,
    right: 20,
    maxHeight: 200,
    backgroundColor: colors.background, // Use a color from your constants
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    zIndex: 10,
    fontFamily: fonts.PlusJakartaSans, // Use font from your constants
  },
  resultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: colors.stroke, // Use a color from your constants
    
  },
});

export default SuggestionsDropdown;
