import { View, Text, StyleSheet } from 'react-native';
// import { Link } from 'expo-router';
import CustomButton from '../../components/CustomButton';
import {router} from 'expo-router';
import React from 'react';
import strings from '../../constants/strings';
import colors from '../../constants/color';
import ClearUserButton from '../../components/ClearUserButton';

export default function Tab() {
  return (
    <View style={styles.container}>
      <Text>Tab [Home]</Text>

      <CustomButton
        title="Signin"
        type="primary"
        onPress={() => router.push('/pages/SignInScreen.jsx')}
        // style={{ backgroundColor: '#00e194' }}  
        // textStyle={{ fontSize: 18, color: '#fff' }}
      />

      <ClearUserButton/>
      <CustomButton
        title={strings.sample1ButtonText}
        type="primary"
        textStyle={{ color: colors.black }}
        onPress={() => router.push('/pages/SignInScreen.jsx')}
        />

      <CustomButton
        title="Filters"
        type="primary"
        textStyle={{ color: colors.black }}
        onPress={() => router.push('/pages/Filters')}
        />
      <CustomButton
        title="Planning a Route"
        type="primary"
        textStyle={{ color: colors.black }}
        onPress={() => router.push('/pages/TripPlanner1')}
        />
      <CustomButton
        title="Route History"
        type="primary"
        textStyle={{ color: colors.black }}
        onPress={() => router.push('/pages/SavedTripsScreen')}
        />
      <CustomButton
        title="Battery Status"
        type="primary"
        textStyle={{ color: colors.black }}
        onPress={() => router.push('/pages/BatteryStatusModal')}
        />

      <CustomButton
        title="QuickCheck"
        type="primary"
        textStyle={{ color: colors.black }}
        onPress={() => router.push('/pages/QuickCheckModal')}
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
