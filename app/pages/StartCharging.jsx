import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import colors from '../../constants/color';
import fonts from '../../constants/fonts';
import BarcodeScanner from '../../components/BarcodeScanner';

const StartChargingScreen = () => {
    const router = useRouter();
    const [isCameraActive, setIsCameraActive] = useState(false);

    // Handler for QR scan result
    const handleBarCodeScanned = (data) => {
        setIsCameraActive(false); // Hide camera after scan
        alert(`QR Code Scanned: ${data}`);
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.push('/(tabs)')}>
                    <Ionicons name="close" size={24} color={colors.mainTextColor} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Start Charging</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* Instruction */}
            <Text style={[styles.subtitle, { marginTop: 1        }]}>
                Scan the QR code on the charger{'\n'}to start charging
            </Text>

            {/* QR Scan Box centered */}
            <View style={styles.centerContent}>
                <TouchableOpacity
                    style={styles.qrBox}
                    activeOpacity={0.8}
                    onPress={() => setIsCameraActive(true)}
                    disabled={isCameraActive}
                >
                    {isCameraActive ? (
                        <BarcodeScanner
                            style={styles.barcodeScanner}
                            onBarCodeScanned={handleBarCodeScanned}
                        />
                    ) : (
                        <Text style={{ color: colors.secondaryText, fontFamily: fonts.PlusJakartaSans }}>
                            Tap to open camera
                        </Text>
                    )}
                    {/* Green corners */}
                    <View style={[styles.corner, styles.topLeft]} />
                    <View style={[styles.corner, styles.topRight]} />
                    <View style={[styles.corner, styles.bottomLeft]} />
                    <View style={[styles.corner, styles.bottomRight]} />
                </TouchableOpacity>
                <Text style={[styles.footerText, { marginTop:190    }]}>Point camera to QR</Text>
            </View>
        </View>
    );
};

const cornerSize = 32;
const cornerThickness = 3;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: 60,
        paddingHorizontal: 24,
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerTitle: {
        fontSize: 16,
        fontFamily: fonts.PlusJakartaSansBold,
        color: colors.mainTextColor,
    },
    subtitle: {
        fontSize: 14,
        textAlign: 'center',
        color: colors.secondaryText,
        marginTop: 24,
        fontFamily: fonts.PlusJakartaSans,
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    qrBox: {
        width:250,
        height:250,
        borderRadius: 16,
        backgroundColor: '#E9F7F4',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: colors.primary,
        overflow: 'hidden',
        alignSelf: 'center', // Add this line to center horizontally
        marginTop:250,
        marginBottom: 0,
    },
    barcodeScanner: {
        width: 200,
        height: 200,
        borderRadius: 8,
    },
    footerText: {
        marginTop: 24,
        fontSize: 14,
        color: colors.secondaryText,
        fontFamily: fonts.PlusJakartaSans,
    },
    corner: {
        position: 'absolute',
        width: cornerSize,
        height: cornerSize,
        borderColor: colors.primary,
        borderRadius: 8,
    },
    topLeft: {
        top: 0,
        left: 0,
        borderTopWidth: cornerThickness,
        borderLeftWidth: cornerThickness,
    },
    topRight: {
        top: 0,
        right: 0,
        borderTopWidth: cornerThickness,
        borderRightWidth: cornerThickness,
    },
    bottomLeft: {
        bottom: 0,
        left: 0,
        borderBottomWidth: cornerThickness,
        borderLeftWidth: cornerThickness,
    },
    bottomRight: {
        bottom: 0,
        right: 0,
        borderBottomWidth: cornerThickness,
        borderRightWidth: cornerThickness,
    },
});

export default StartChargingScreen;
