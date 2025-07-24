import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
} from 'react-native';
import colors from '../constants/color';
import fonts from '../constants/fonts';

const CustomModal = ({
  visible,
  onClose,
  title,
  subtitle,
  children,
  showHeader = true,
  fullScreen = true,
  scrollable = false,
  footerContent,
}) => {
  const ModalContent = () => (
    <View style={styles.container}>
      {showHeader && (
        <TouchableOpacity onPress={onClose}>
          <View style={styles.header}>
            <View style={styles.backButton}>
              <Text style={styles.backButtonText}>‹</Text>
            </View>
            {title && <Text style={styles.title}>{title}</Text>}

          </View>
        </TouchableOpacity>


      )}

      {subtitle && (
        <Text style={styles.subtitle}>{subtitle}</Text>
      )}

      <View style={styles.content}>
        {scrollable ? (
          <ScrollView showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>
        ) : (
          children
        )}
      </View>

      {footerContent && (
        <View style={styles.footer}>
          {footerContent}
        </View>
      )}
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle={fullScreen ? "fullScreen" : "pageSheet"}
      onRequestClose={onClose}
    >
      <ModalContent />
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    marginRight: 15,
  },
  backButtonText: {
    fontSize: 30,
    color: colors.mainTextColor,
    fontFamily: fonts.PlusJakartaSans,
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
    paddingHorizontal: 20,
    marginBottom: 20,
    lineHeight: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
});

export default CustomModal;
