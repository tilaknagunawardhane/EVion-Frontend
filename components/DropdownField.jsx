import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  FlatList,
  Dimensions,
  UIManager,
  findNodeHandle
} from 'react-native';
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
  const [dropdownTop, setDropdownTop] = useState(0);
  const dropdownRef = useRef(null);

  const openDropdown = () => {
    const handle = findNodeHandle(dropdownRef.current);
    UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {
      setDropdownTop(pageY + height - 20);
      setIsOpen(true);
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        ref={dropdownRef}
        style={styles.dropdown}
        onPress={openDropdown}
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
          source={require('../assets/down-arrow.png')}
          style={styles.icon}
        />
      </TouchableOpacity>

      {/* Modal rendered absolutely below dropdown */}
      <Modal visible={isOpen} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setIsOpen(false)}
          activeOpacity={1}
        >
          <View style={[styles.dropdownModal, { top: dropdownTop }]}>
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
              style={{ maxHeight: 250 }} // You can adjust this height as needed
              scrollEnabled={true}
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
  },
  dropdownModal: {
    position: 'absolute',
    left: 24, // match your padding
    right: 24,
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingVertical: 10,
    elevation: 5,
    maxHeight: '30%',
    shadowColor: colors.mainTextColor,
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  optionText: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.mainTextColor,
  },
});


export default DropdownField;