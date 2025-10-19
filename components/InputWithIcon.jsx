import React, { useState, useCallback, useEffect } from 'react';
import { View, TextInput, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import axios from 'axios';
import colors from '../constants/color';
import fonts from '../constants/fonts';
import { GOOGLE_MAPS_API_KEY } from '@env';

const InputWithIcon = ({
  icon,
  placeholder,
  value,
  onChangeText,
  onPlaceSelect,
  enableAutocomplete = false,
  ...props
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  // Debounce function
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
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json`,
        {
          params: {
            input: input,
            key: GOOGLE_MAPS_API_KEY,
            components: 'country:lk', 
          }
        }
      );

      if (response.data.status === 'OK') {
        setSuggestions(response.data.predictions.slice(0, 5) || []); // Limit to 5
        setShowSuggestions(true);
      } else {
        console.log('Places API error:', response.data.status);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error('Places API error:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, []);

  // Debounced version
  const debouncedFetchPlaces = useCallback(debounce(fetchPlaceSuggestions, 500), [fetchPlaceSuggestions]);

  useEffect(() => {
    debouncedFetchPlaces(value);
  }, [value, debouncedFetchPlaces]);

  const handlePlaceSuggestionPress = (place) => {
    const description = place.description;
    console.log('Tapped suggestion:', place); // Debug log

    closeSuggestions();
    setSuggestions([]);

    onChangeText?.(description);
    onPlaceSelect?.(description);
    // setShowSuggestions(false);
    // setSuggestions([]);
  };

  const closeSuggestions = () => setShowSuggestions(false);

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Image source={icon} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={value}
          onChangeText={(text) => {
            onChangeText?.(text);
            if (enableAutocomplete) {
              setShowSuggestions(text.trim().length >= 2);
            }
          }}
          onFocus={() => enableAutocomplete && value.trim().length >= 2 && setShowSuggestions(true)}
          // onBlur={() => {
          //   // Delay to allow onPress to fire first
          //   setTimeout(() => closeSuggestions(), 200);
          // }}
          onSubmitEditing={closeSuggestions}
          blurOnSubmit={false}
          {...props}
        />
      </View>

      {enableAutocomplete && showSuggestions && suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          {suggestions.map((item) => (
            <TouchableOpacity
              key={item.place_id}
              style={styles.suggestionItem}
              onPressIn={() => handlePlaceSuggestionPress(item)}
              activeOpacity={0.7}
            >
              <Text style={styles.suggestionText} numberOfLines={1}>
                {item.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 55,
    backgroundColor: colors.background,
    marginVertical: 4,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 8,
    resizeMode: 'contain',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.mainTextColor,
    fontFamily: fonts.PlusJakartaSansRegular,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    maxHeight: 200,
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  suggestionItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.primary,
  },
  suggestionText: {
    fontSize: 14,
    color: colors.mainTextColor,
    fontFamily: fonts.PlusJakartaSansRegular,
  },
});

export default InputWithIcon;