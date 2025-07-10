import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import { useRouter } from 'expo-router';
import colors from '../../../constants/color';
import fonts from '../../../constants/fonts';
import InputField from "../../../components/InputField";

export default function ReportIssue() {
  const router = useRouter();

  const [categoryOpen, setCategoryOpen] = useState(false);
  const [category, setCategory] = useState(null);
  const [categories, setCategories] = useState([
    { label: 'Payment Issue', value: 'payment' },
    { label: 'Charging Error', value: 'charging' },
    { label: 'App Bug', value: 'bug' },
    { label: 'Other', value: 'other' },
  ]);

  const [description, setDescription] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report an Issue</Text>
      </View>

      <Text style={styles.label}>Issue Category*</Text>
      <DropDownPicker
        open={categoryOpen}
        value={category}
        items={categories}
        setOpen={setCategoryOpen}
        setValue={setCategory}
        setItems={setCategories}
        placeholder="Select the category"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
      />

      <Text style={styles.label}>Description*</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Add text here..."
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={6}
      />

      <TouchableOpacity style={styles.submitButton} >
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
    paddingTop: 50,
    fontFamily: fonts.PlusJakartaSans
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  dropdown: {
    borderColor: '#ccc',
    marginBottom: 24,
  },
  dropdownContainer: {
    borderColor: '#ccc',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    textAlignVertical: 'top',
    marginBottom: 24,
  },
  submitButton: {
    backgroundColor: '#00B894',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
