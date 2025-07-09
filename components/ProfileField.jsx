import React, { useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import colors from '../constants/color';
import fonts from '../constants/fonts';
import InputField from './InputField';

const ProfileField = React.memo(({
  label,
  value,
  field,
  isEditingField, // now only true/false per field
  editingValue,
  onEdit,
  onUpdate,
  onCancel,
  onValueChange,
  placeholder,
  multiline = false,
  keyboardType = 'default',
  onSpecialEdit,
}) => {
  const handleEditPress = useCallback(() => {
    if (onSpecialEdit) {
      onSpecialEdit();
    } else {
      onEdit(field, value);
    }
  }, [onSpecialEdit, onEdit, field, value]);

  if (isEditingField) {
    return (
      <View style={styles.container}>
        <InputField
          label={label}
          value={editingValue}
          onChangeText={onValueChange}
          placeholder={placeholder || value}
          multiline={multiline}
          keyboardType={keyboardType}
          autoFocus
        />
        <View style={styles.editingActions}>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.updateButton} onPress={onUpdate}>
            <Text style={styles.updateButtonText}>Update</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.fieldValueContainer}>
        <Text style={[
          styles.fieldValue,
          (value === 'Your home address' || value === 'Your work place address') && styles.placeholderText
        ]}>
          {value}
        </Text>
        <TouchableOpacity style={styles.editButton} onPress={handleEditPress}>
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.mainTextColor,
    marginBottom: 8,
  },
  fieldValueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.stroke,
  },
  fieldValue: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.mainTextColor,
    flex: 1,
  },
  placeholderText: {
    color: colors.secondaryText,
  },
  editButton: {
    padding: 4,
  },
  editText: {
    fontSize: 14,
    color: colors.secondaryText,
    fontFamily: fonts.PlusJakartaSans,
  },
  editingActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 8,
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.stroke,
    alignItems: 'center',
  },
  updateButton: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 8,
    backgroundColor: colors.primary,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.mainTextColor,
  },
  updateButtonText: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.background,
  },
});

export default ProfileField;
