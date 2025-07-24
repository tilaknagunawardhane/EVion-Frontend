import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ClearUserButton = () => {
  const removeUser = async () => {
    try {
      await AsyncStorage.removeItem('user');
      console.log('User removed from AsyncStorage');
    } catch (e) {
      console.log('Error removing user:', e);
    }
  };

  return (
    <TouchableOpacity onPress={removeUser}>
      <Text style={{ color: 'red' }}>Clear AsyncStorage User</Text>
    </TouchableOpacity>
  );
};

export default ClearUserButton;
