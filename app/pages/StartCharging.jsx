import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import colors from '../../constants/color';
import fonts from '../../constants/fonts';
import BarcodeScanner from '../../components/BarcodeScanner';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const StartChargingScreen = () => {
    const router = useRouter();
    const [isCameraActive, setIsCameraActive] = useState(false);

    const handleBarCodeScanned = (data) => {
        setIsCameraActive(false);
        alert(`QR Code Scanned: ${data}`);
        router.push('/pages/WaitingConnection'); // Navigate to WaitingConnection page
    };

    return (
        <View style={styles.container}>
            {/* Header Group */}
            <View style={styles.headerGroup}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.push('/(tabs)')}>
                        <Ionicons name="close" size={24} color={colors.mainTextColor} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Start Charging</Text>
                    <View style={{ width: 24 }} />
                </View>

                <Text style={styles.subtitle}>
                    Scan the QR code on the charger{'\n'}to start charging
                </Text>
            </View>

            {/* Centered QR Box */}
            <View style={styles.qrContainer}>
                <TouchableOpacity
                    style={styles.qrBox}
                    activeOpacity={0.7}
                    onPress={() => setIsCameraActive(true)}
                    disabled={isCameraActive}
                >
                    {isCameraActive ? (
                        <BarcodeScanner
                            style={StyleSheet.absoluteFill}
                            onScanned={handleBarCodeScanned}
                        />
                    ) : (
                        <>
                            {/* <Ionicons name="scan" size={48} color={colors.primary} /> */}
                            <Text style={styles.tapText}>Tap to open camera</Text>
                        </>
                    )}
                    
                    {/* Green corners */}
                    <View style={[styles.corner, styles.topLeft]} />
                    <View style={[styles.corner, styles.topRight]} />
                    <View style={[styles.corner, styles.bottomLeft]} />
                    <View style={[styles.corner, styles.bottomRight]} />
                </TouchableOpacity>
            </View>

            {/* Footer */}
            <Text style={styles.footerText}>Point camera to QR</Text>
        </View>
    );
};

const cornerSize = SCREEN_WIDTH * 0.090;
const cornerThickness = 2;
const inset = 26;
const qrBoxSize = SCREEN_WIDTH * 0.75;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: 24,
        
    },
    headerGroup: {
        paddingTop: 60,
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: fonts.PlusJakartaSansBold,
        color: colors.mainTextColor,
    },
    subtitle: {
        fontSize: 14,
        textAlign: 'center',
        color: colors.secondaryText,
        fontFamily: fonts.PlusJakartaSans,
        marginBottom: 0,
    },
    qrContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    qrBox: {
        width: qrBoxSize,
        height: qrBoxSize,
        borderRadius: 16,
        backgroundColor: '#E9F7F4',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: colors.primary,
        overflow: 'hidden',
        position: 'relative',
    },
    tapText: {
        color: colors.secondaryText,
        fontFamily: fonts.PlusJakartaSans,
        textAlign: 'center',
        paddingHorizontal: 20,
        // marginTop: 16,
    },
    footerText: {
        textAlign: 'center',
        fontSize: 14,
        color: colors.secondaryText,
        fontFamily: fonts.PlusJakartaSans,
        marginBottom: 40,
    },
    corner: {
        position: 'absolute',
        width: cornerSize,
        height: cornerSize,
        borderColor: colors.primary,
        borderRadius: 8,
    },
    topLeft: {
        top: inset,
        left: inset,
        borderTopWidth: cornerThickness,
        borderLeftWidth: cornerThickness,
    },
    topRight: {
        top: inset,
        right: inset,
        borderTopWidth: cornerThickness,
        borderRightWidth: cornerThickness,
    },
    bottomLeft: {
        bottom: inset,
        left: inset,
        borderBottomWidth: cornerThickness,
        borderLeftWidth: cornerThickness,
    },
    bottomRight: {
        bottom: inset,
        right: inset,
        borderBottomWidth: cornerThickness,
        borderRightWidth: cornerThickness,
    },
});

export default StartChargingScreen;