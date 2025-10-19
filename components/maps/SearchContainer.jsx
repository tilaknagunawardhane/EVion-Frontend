import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import { GOOGLE_MAPS_API_KEY } from '@env';
import colors from '../../constants/color';

export default function SearchContainer({
  searchQuery,
  setSearchQuery,
  onSearch,
  chargingStations = [],
  onStationSelect,
}) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [placeSuggestions, setPlaceSuggestions] = useState([]);

  // Debounce function to limit API calls
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  // Fetch Google Places suggestions
  const fetchPlaceSuggestions = useCallback(async (input) => {
    if (!input || input.trim().length < 2) {
      setPlaceSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json`,
        {
          params: {
            input: input,
            key: GOOGLE_MAPS_API_KEY,
            components: 'country:lk', // Restrict to Sri Lanka
            // types: '(cities)', // Focus on cities and places
          }
        }
      );

      if (response.data.status === 'OK') {
        setPlaceSuggestions(response.data.predictions || []);
      } else {
        console.log('Places API error:', response.data.status);
        setPlaceSuggestions([]);
      }
    } catch (error) {
      console.error('Places API error:', error);
      setPlaceSuggestions([]);
    }
  }, []);

  // Debounced version of fetchPlaceSuggestions
  const debouncedFetchPlaces = useCallback(debounce(fetchPlaceSuggestions, 500), [fetchPlaceSuggestions]);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      // Filter charging stations
      const filteredStations = chargingStations
        .filter(station =>
          station.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          station.town?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          station.address?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 3); // Limit to 3 station suggestions
      
      setSuggestions(filteredStations);
      
      // Fetch place suggestions
      debouncedFetchPlaces(searchQuery);
      
      // Show suggestions if we have any
      setShowSuggestions(filteredStations.length > 0 || searchQuery.trim().length >= 2);
    } else {
      setSuggestions([]);
      setPlaceSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, chargingStations, debouncedFetchPlaces]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionPress = (station) => {
    setSearchQuery(station.title);
    setShowSuggestions(false);
    onStationSelect(station);
  };

  const handlePlaceSuggestionPress = (place) => {
    setSearchQuery(place.description);
    setShowSuggestions(false);
    onSearch(place.description);
  };

  const handleClear = () => {
    setSearchQuery('');
    setSuggestions([]);
    setPlaceSuggestions([]);
    setShowSuggestions(false);
  };

  const renderStationSuggestion = ({ item }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => handleSuggestionPress(item)}
    >
      <MaterialIcons 
        name="ev-station" 
        size={20} 
        color={colors.primary} 
        style={styles.suggestionIcon}
      />
      <View style={styles.suggestionContent}>
        <Text style={styles.suggestionTitle}>{item.title}</Text>
        <Text style={styles.suggestionAddress}>{item.town || item.address}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderPlaceSuggestion = ({ item }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => handlePlaceSuggestionPress(item)}
    >
      <MaterialIcons 
        name="place" 
        size={20} 
        color={colors.gray} 
        style={styles.suggestionIcon}
      />
      <View style={styles.suggestionContent}>
        <Text style={styles.suggestionTitle}>{item.structured_formatting?.main_text || item.description}</Text>
        <Text style={styles.suggestionAddress}>{item.structured_formatting?.secondary_text || ''}</Text>
      </View>
    </TouchableOpacity>
  );

  // Combine suggestions with stations first, then places
  const combinedSuggestions = [
    ...suggestions.map(station => ({ ...station, type: 'station' })),
    ...placeSuggestions.slice(0, 5).map(place => ({ ...place, type: 'place' }))
  ];

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <View style={styles.searchBox}>
        <MaterialIcons 
          name="search" 
          size={24} 
          color={colors.gray} 
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for charging stations or places..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <MaterialIcons name="clear" size={20} color={colors.gray} />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
          <MaterialIcons name="search" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Suggestions List */}
      {showSuggestions && combinedSuggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={combinedSuggestions}
            renderItem={({ item }) => {
              if (item.type === 'station') {
                return renderStationSuggestion({ item });
              } else {
                return renderPlaceSuggestion({ item });
              }
            }}
            keyExtractor={(item) => item.type === 'station' ? `station-${item.id}` : `place-${item.place_id}`}
            style={styles.suggestionsList}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 16,
    right: 16,
    zIndex: 1000,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.black,
  },
  clearButton: {
    padding: 4,
    marginRight: 8,
  },
  searchButton: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 8,
  },
  suggestionsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    maxHeight: 250,
  },
  suggestionsList: {
    maxHeight: 250,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  suggestionIcon: {
    marginRight: 12,
  },
  suggestionContent: {
    flex: 1,
  },
  suggestionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.black,
    marginBottom: 4,
  },
  suggestionAddress: {
    fontSize: 14,
    color: colors.gray,
  },
});