import { View, Text, StyleSheet } from 'react-native';
import CustomButton from '../../components/CustomButton';
import colors from '../../constants/color';
import {router} from 'expo-router';



export default function Tab() {
  return (
    <View style={styles.container}>
      <Text>Tab [Settings]</Text>

      <CustomButton
        title="Add vehicle profile"
        type="primary"
        textStyle={{ color: colors.black }}
        onPress={() => router.push('/pages/addedvprofile')}
        />

        <CustomButton
        title="Station profile"
        type="primary"
        textStyle={{ color: colors.black }}
        onPress={() => router.push('/pages/StationProfile')}
        />

        <CustomButton
        title="Start Charging"
        type="primary"
        textStyle={{ color: colors.black }}
        onPress={() => router.push('/pages/StartCharging')}
        />

        <CustomButton
        title="Waiting Connection"
        type="primary"
        textStyle={{ color: colors.black }}
        onPress={() => router.push('/pages/WaitingConnection')}
        />
<CustomButton
        title="Waiting Connection"
        type="primary"
        textStyle={{ color: colors.black }}
        onPress={() => router.push('/pages/FullCharged')}
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
