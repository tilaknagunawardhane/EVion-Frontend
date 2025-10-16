import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  BackHandler,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';

import colors from '../../../../constants/color';
import fonts from '../../../../constants/fonts';
import { API_BASE_URL } from '@env';

const PaymentWebView = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { paymentData, sandbox, amount } = route.params;
  
  const [loading, setLoading] = useState(true);
  const [webViewKey, setWebViewKey] = useState(0);

  // PayHere URLs
  const PAYHERE_BASE_URL = sandbox 
    ? 'https://sandbox.payhere.lk/pay/checkout' 
    : 'https://www.payhere.lk/pay/checkout';

  // Generate HTML form for auto-submission
  const generateAutoSubmitForm = () => {
    const formFields = Object.keys(paymentData)
      .map(key => `<input type="hidden" name="${key}" value="${paymentData[key]}" />`)
      .join('');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Redirecting to PayHere...</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              background: #f5f5f5;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            .loading {
              text-align: center;
            }
            .spinner {
              border: 4px solid #f3f3f3;
              border-top: 4px solid ${colors.primary};
              border-radius: 50%;
              width: 40px;
              height: 40px;
              animation: spin 1s linear infinite;
              margin: 0 auto 20px;
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          </style>
        </head>
        <body>
          <div class="loading">
            <div class="spinner"></div>
            <p>Redirecting to PayHere payment gateway...</p>
          </div>
          <form id="payhereForm" method="post" action="${PAYHERE_BASE_URL}">
            ${formFields}
          </form>
          <script>
            // Auto-submit form after short delay
            setTimeout(() => {
              document.getElementById('payhereForm').submit();
            }, 1000);
          </script>
        </body>
      </html>
    `;
  };

  // Handle navigation state changes in WebView
  const onNavigationStateChange = (navState) => {
    const { url, title } = navState;
    
    // Check for success URLs (PayHere return URLs)
    if (url && (url.includes('/payment/success') || url.includes('success'))) {
      handlePaymentSuccess();
      return;
    }
    
    // Check for cancel URLs
    if (url && (url.includes('/payment/cancel') || url.includes('cancel'))) {
      handlePaymentCancel();
      return;
    }

    // Check if payment is completed by looking at page title/content
    if (title?.toLowerCase().includes('success') || (url && url.includes('payment_id'))) {
      handlePaymentSuccess();
    }
  };

  // Handle payment success
  const handlePaymentSuccess = () => {
    Toast.show({
      type: ALERT_TYPE.SUCCESS,
      title: 'Payment Successful',
      textBody: `LKR ${amount} has been added to your wallet!`,
    });
    
    // Navigate back to wallet with refresh flag
    navigation.replace('Wallet', { refresh: true });
  };

  // Handle payment cancellation
  const handlePaymentCancel = () => {
    Toast.show({
      type: ALERT_TYPE.WARNING,
      title: 'Payment Cancelled',
      textBody: 'Your payment was cancelled. You can try again.',
    });
    navigation.goBack();
  };

  // Handle payment failure
  const handlePaymentFailure = () => {
    Toast.show({
      type: ALERT_TYPE.DANGER,
      title: 'Payment Failed',
      textBody: 'Payment failed. Please try again or use a different payment method.',
    });
    navigation.goBack();
  };

  // Handle WebView errors
  const onError = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    console.error('WebView error: ', nativeEvent);
    
    // Don't show error for navigation cancellations
    if (!nativeEvent.description?.includes('Navigation cancelled')) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Connection Error',
        textBody: 'Failed to load payment gateway. Please check your internet connection.',
      });
    }
  };

  // Handle back button press
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      Alert.alert(
        'Cancel Payment',
        'Are you sure you want to cancel this payment?',
        [
          {
            text: 'Continue Payment',
            style: 'cancel',
          },
          {
            text: 'Cancel Payment',
            onPress: () => {
              Toast.show({
                type: ALERT_TYPE.WARNING,
                title: 'Payment Cancelled',
                textBody: 'You cancelled the payment process.',
              });
              navigation.goBack();
            },
          },
        ]
      );
      return true;
    });

    return () => backHandler.remove();
  }, [navigation]);

  // Handle message from WebView (if needed for deeper integration)
  const onMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      if (data.type === 'payment_success') {
        handlePaymentSuccess();
      } else if (data.type === 'payment_failed') {
        handlePaymentFailure();
      } else if (data.type === 'payment_cancel') {
        handlePaymentCancel();
      }
    } catch (error) {
      console.log('Message from WebView:', event.nativeEvent.data);
    }
  };

  // Retry loading payment page
  const handleRetry = () => {
    setWebViewKey(prev => prev + 1);
    setLoading(true);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => {
            Alert.alert(
              'Cancel Payment',
              'Are you sure you want to cancel this payment?',
              [
                {
                  text: 'Continue Payment',
                  style: 'cancel',
                },
                {
                  text: 'Cancel Payment',
                  onPress: () => {
                    Toast.show({
                      type: ALERT_TYPE.WARNING,
                      title: 'Payment Cancelled',
                      textBody: 'You cancelled the payment process.',
                    });
                    navigation.goBack();
                  },
                },
              ]
            );
          }}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.mainTextColor} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>PayHere Payment</Text>
        <View style={styles.amountBadge}>
          <Text style={styles.amountText}>LKR {parseFloat(amount).toFixed(2)}</Text>
        </View>
      </View>

      {/* WebView Container */}
      <View style={styles.webViewContainer}>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading payment gateway...</Text>
          </View>
        )}

        <WebView
          key={webViewKey}
          source={{ html: generateAutoSubmitForm() }}
          style={styles.webView}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          onNavigationStateChange={onNavigationStateChange}
          onError={onError}
          onMessage={onMessage}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={true}
          mixedContentMode="always"
          thirdPartyCookiesEnabled={true}
          userAgent="Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36"
        />
      </View>

      {/* Footer Info */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          You are being redirected to PayHere's secure payment gateway.
        </Text>
        <Text style={[styles.footerNote, { color: sandbox ? colors.warning : colors.primary }]}>
          {sandbox ? '🔬 SANDBOX MODE - Use test cards only' : '🔒 Secure Payment'}
        </Text>
        
        {!loading && (
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryButtonText}>Reload Payment Page</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 56,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.stroke,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 12,
  },
  amountBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  amountText: {
    color: colors.white,
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansBold,
  },
  webViewContainer: {
    flex: 1,
    position: 'relative',
  },
  webView: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    zIndex: 10,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
  },
  footer: {
    padding: 16,
    backgroundColor: colors.lightestGray,
    borderTopWidth: 1,
    borderTopColor: colors.stroke,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
    textAlign: 'center',
    marginBottom: 8,
  },
  footerNote: {
    fontSize: 12,
    fontFamily: fonts.PlusJakartaSansMedium,
    textAlign: 'center',
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.white,
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansBold,
  },
});

export default PaymentWebView;