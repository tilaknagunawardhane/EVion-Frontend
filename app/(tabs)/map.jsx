import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { AppleMaps, GoogleMaps } from 'expo-maps';
// import * as ExpoMaps from 'expo-maps';

export default function MapScreen() {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    setErrorMsg('Permission to access location was denied');
                    return;
                }

                const loc = await Location.getCurrentPositionAsync({});
                console.log("📍Location:", loc.coords); // ✅ Add this
                setLocation(loc.coords);
            } catch (err) {
                setErrorMsg('Error fetching location. Please ensure GPS is enabled.');
            }
        })();
    }, []);


    if (errorMsg) {
        return (
            <View style={styles.centered}>
                <Text style={{ color: 'red' }}>❌ {errorMsg}</Text>
            </View>
        );
    }

    if (!location) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" />
                <Text>Getting your location...</Text>
            </View>
        );
    }
    // const defaultCoords = { latitude: 6.9271, longitude: 79.8612 };
    // const { latitude, longitude } = location || defaultCoords;
    // const { latitude, longitude } = location;

    const latitude = 6.9271;
const longitude = 79.8612;

    const mapProps = {
        style: styles.map,
        initialCamera: {
            centerCoordinate: { latitude, longitude },
            zoom: 15,
            pitch: 0,
            heading: 0,
            altitude: 0,
        },
        showsUserLocation: true,
        showsMyLocationButton: true,
        enableTraffic: false,
        enableBuildings: true,
    };


    if (Platform.OS === 'ios') {
        return <AppleMaps.View {...mapProps} />;
    }

    if (Platform.OS === 'android') {
        return <GoogleMaps.View {...mapProps} />;
    }

    return (
        <View style={styles.centered}>
            <Text>Maps are only supported on iOS and Android.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    map: {
        flex: 1,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
