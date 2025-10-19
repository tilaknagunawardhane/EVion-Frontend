import { FontAwesome } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../../constants/color';
import fonts from '../../constants/fonts';

const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.tabBarContainer}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          // ✅ Valid FontAwesome icon names
          const iconName = {
            bookings: 'calendar',
            Community: 'comment-o',
            Profile: 'user-o',
            StartCharging: 'plug',
            map: 'map-o',
          }[route.name];

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={onPress}
              style={styles.tabItem}
            >
              <FontAwesome
                name={iconName}
                size={22}
                color={isFocused ? (colors.primary || '#007bff') : (colors.secondaryText || '#888')}
              />
              <Text
                style={[
                  styles.tabLabel,
                  isFocused && styles.tabLabelFocused,
                ]}
              >
                {options.title || route.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default function TabLayout() {
  return (
    <Tabs
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="map"
        options={{
          title: 'Explore',
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="bookings"
        options={{
          title: 'Bookings',
        }}
      />

      <Tabs.Screen
        name="StartCharging"
        options={{
          title: 'Charge',
        }}
      />

      <Tabs.Screen
        name="Community"
        options={{
          title: 'Community',
        }}
      />

      <Tabs.Screen
        name="Profile"
        options={{
          title: 'Profile',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    backgroundColor: '#fff',
    paddingBottom: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    elevation: 10, // shadow for Android
    shadowColor: '#000', // shadow for iOS
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 10,
  },
  tabItem: {
    alignItems: 'center',
  },
  tabLabel: {
    fontFamily: fonts.PlusJakartaSans,
    fontSize: 12,
    color: colors.secondaryText || '#888',
    marginTop: 4,
  },
  tabLabelFocused: {
    color: colors.primary || '#007bff',
    fontWeight: '600',
  },
});
