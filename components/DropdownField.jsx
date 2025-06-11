import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Modal, FlatList } from 'react-native';
import colors from '../constants/color';
import fonts from '../constants/fonts';

const DropdownField = ({
  label,
  selectedValue,
  onValueChange,
  placeholder,
  options = [],
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setIsOpen(true)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.valueText,
            { color: selectedValue ? colors.mainTextColor : colors.secondaryText },
          ]}
        >
          {selectedValue || placeholder}
        </Text>

        <Image
          source={require('../assets/down-arrow.png')} // Ensure you have this asset
          style={styles.icon}
        />
      </TouchableOpacity>

      {/* Modal for dropdown */}
      <Modal visible={isOpen} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setIsOpen(false)}
          activeOpacity={1}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={options}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => {
                    onValueChange(item);
                    setIsOpen(false);
                  }}
                >
                  <Text style={styles.optionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.mainTextColor,
    marginBottom: 8,
  },
  dropdown: {
    height: 50,
    backgroundColor: colors.background,
    borderColor: colors.stroke,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  valueText: {
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSans,
  },
  icon: {
    position: 'absolute',
    right: 12,
    width: 16,
    height: 16,
    tintColor: colors.secondaryText,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingVertical: 10,
    maxHeight: '50%',
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  optionText: {
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.mainTextColor,
  },
});

export default DropdownField;
