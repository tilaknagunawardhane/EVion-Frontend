import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import CustomButton from '../../components/CustomButton';
import {router} from 'expo-router';
import React from 'react';

export default function Tab() {
  return (
    <View style={styles.container}>
      <Text>Tab [Home]</Text>

      <CustomButton
        title="Go to Sample 1"
        onPress={() => router.push('/pages/sample1')}
        // style={{ backgroundColor: '#00e194' }}  
        // textStyle={{ fontSize: 18, color: '#fff' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
