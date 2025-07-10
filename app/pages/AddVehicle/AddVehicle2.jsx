import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import AppBar from '../../../components/AppBar';
import CustomButton from '../../../components/CustomButton';
import PlugBox from '../../../components/PlugBox';
import colors from '../../../constants/color';
import fonts from '../../../constants/fonts';
import { useLocalSearchParams } from 'expo-router';
import { API_BASE_URL } from '@env';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';

const AddPlugTypeScreen = () => {
  const params = useLocalSearchParams();
  const [selectedPlugs, setSelectedPlugs] = useState([]);
  const [plugTypes, setPlugTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    vehicleMakeId = '',
    vehicleMake = '',
    vehicleModelId = '',
    vehicleModel = '',
    manufactureYear = '',
    colorId = '',
    color = '',
    vehicleType = ''
  } = params;

  useEffect(() => {
    const fetchPlugTypes = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/vehicles/connectors`);
        const data = await response.json();
        
        if (data.success) {
          // Map the data to include full image URLs
          const plugsWithImages = data.data.map(plug => ({
            id: plug._id,
            label: plug.type_name,
            current_type: plug.current_type,
            image: plug.image 
              ? { uri: `${API_BASE_URL}${plug.image}` }
              : require('../../../assets/type1.png')
          }));
          setPlugTypes(plugsWithImages);
        } else {
          setError('Failed to load plug types');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlugTypes();
  }, []);

  const togglePlugSelection = (id) => {
    setSelectedPlugs((prev) =>
      prev.includes(id) ? prev.filter((plugId) => plugId !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    if (selectedPlugs.length > 0) {
      router.push({
        pathname: '/pages/AddVehicle/AddVehicle3',
        params: {
          ...params,
          selectedPlugIds: JSON.stringify(selectedPlugs)
        }
      });
    } else {
      Alert.alert('Select Plug Type', 'Please select at least one plug type before proceeding.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <CustomButton 
          title="Retry" 
          onPress={() => {
            setLoading(true);
            setError(null);
            fetchPlugTypes();
          }} 
          type="secondary" 
        />
      </View>
    );
  }

  // Group plugs by current_type
  const acPlugs = plugTypes.filter(plug => plug.current_type === 'AC');
  const dcPlugs = plugTypes.filter(plug => plug.current_type === 'DC');
  const teslaPlugs = plugTypes.filter(plug => plug.label.includes('Tesla'));

  return (
    <View style={styles.container}>
      <AppBar />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.mainContent}>
          <Text style={styles.title}>Add Your EV</Text>
          <Text style={styles.subtitle}>Please select supported plug type</Text>

          <View style={styles.progressBar}>
            <View style={styles.inactiveDot} />
            <View style={styles.activeDot} />
            <View style={styles.inactiveDot} />
            <View style={styles.inactiveDot} />
          </View>

          <Text style={styles.sectionTitle}>Plug Types</Text>

          {acPlugs.length > 0 && (
            <>
              <Text style={styles.sectionSubtitle}>AC Plugs</Text>
              <View style={styles.grid}>
                {acPlugs.map((plug) => (
                  <PlugBox
                    key={plug.id}
                    plug={plug}
                    isSelected={selectedPlugs.includes(plug.id)}
                    onPress={() => togglePlugSelection(plug.id)}
                  />
                ))}
              </View>
            </>
          )}

          {dcPlugs.length > 0 && (
            <>
              <Text style={styles.sectionSubtitle}>DC Fast Charging Plugs</Text>
              <View style={styles.grid}>
                {dcPlugs.map((plug) => (
                  <PlugBox
                    key={plug.id}
                    plug={plug}
                    isSelected={selectedPlugs.includes(plug.id)}
                    onPress={() => togglePlugSelection(plug.id)}
                  />
                ))}
              </View>
            </>
          )}

          {teslaPlugs.length > 0 && (
            <>
              <Text style={styles.sectionSubtitle}>Tesla</Text>
              <View style={styles.grid}>
                {teslaPlugs.map((plug) => (
                  <PlugBox
                    key={plug.id}
                    plug={plug}
                    isSelected={selectedPlugs.includes(plug.id)}
                    onPress={() => togglePlugSelection(plug.id)}
                  />
                ))}
              </View>
            </>
          )}

          <CustomButton title="Next" onPress={handleNext} type="primary" />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    paddingBottom: 24,
  },
  mainContent: {
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: colors.secondaryText,
    fontFamily: fonts.PlusJakartaSans,
    marginBottom: 20,
  },
  progressBar: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  activeDot: {
    width: 34,
    height: 6,
    borderRadius: 8,
    backgroundColor: colors.primary,
    marginRight: 6,
  },
  inactiveDot: {
    width: 6,
    height: 6,
    borderRadius: 8,
    backgroundColor: colors.stroke,
    marginRight: 6,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    marginTop: 16,
    marginBottom: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: colors.error,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default AddPlugTypeScreen;