import FontAwesome from '@expo/vector-icons/FontAwesome';
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

          const iconName = {
            'bookings': 'calendar-plus-o',
            'Community': 'commenting-o',
            'Profile': 'user-o',
            'StartCharging': 'plug',
            'map': 'map-o'
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
                size={20} 
                color={isFocused ? colors.primary : colors.secondaryText} 
              />
              <Text style={[
                styles.tabLabel,
                isFocused && styles.tabLabelFocused
              ]}>
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
          tabBarIcon: ({ color }) => <FontAwesome size={20} name="map-o" color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="bookings"
        options={{
          title: 'Bookings',
          tabBarIcon: ({ color }) => <FontAwesome size={26} name="calendar" color={color} />,
        }}
      />
      <Tabs.Screen
        name="StartCharging"
        options={{
          // title: 'Bookings',
          tabBarIcon: ({ color }) => <FontAwesome size={26} name="calendar" color={color} />,
        }}
      />
      <Tabs.Screen
        name="Community"
        options={{
          title: 'Community',
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="comment-o" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="user-o" size={24} color={color} />
          ),
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
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 10,
    paddingLeft:10,
    paddingRight: 10
  },
  tabItem: {
    alignItems: 'center',
    padding: 6,
  },
  tabLabel: {
    fontFamily: fonts.PlusJakartaSans,
    fontSize: 12,
    color: colors.secondaryText,
    marginTop: 4,
  },
  tabLabelFocused: {
    color: colors.primary,
    fontWeight: '600',
  },
});