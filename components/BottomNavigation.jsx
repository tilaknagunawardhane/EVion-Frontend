import React from "react";
import { View, TouchableOpacity, Text, StyleSheet, Image } from "react-native";
import colors from "../constants/color";
import fonts from "../constants/fonts";

const BottomNavigation = ({ activeTab = "Community" }) => {
  const navItems = [
    {
      id: "Explore",
      label: "Explore",
      iconPath: require("../assets/Explore.png"),
    },
    {
      id: "Bookings",
      label: "Bookings",
      iconPath: require("../assets/Bookings.png"),
    },
    { id: "Center", label: "", iconPath: require("../assets/charging.png") }, // Central charging button
    {
      id: "Community",
      label: "Community",
      iconPath: require("../assets/Community.png"),
    },
    {
      id: "Profile",
      label: "Profile",
      iconPath: require("../assets/Ptofile.png"),
    },
  ];

  return (
    <View style={styles.container}>
      {navItems.map((item) => {
        if (item.id === "Center") {
          return (
            <TouchableOpacity key={item.id} style={styles.centerButton}>
              <Image source={item.iconPath} style={styles.centerIcon} />
            </TouchableOpacity>
          );
        }

        const isActive = item.id === activeTab;
        return (
          <TouchableOpacity key={item.id} style={styles.navItem}>
            <Image
              source={item.iconPath}
              style={[
                styles.navIcon,
                { tintColor: isActive ? colors.primary : colors.secondaryText },
              ]}
            />
            <Text style={[styles.navLabel, isActive && styles.activeLabel]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "white",
    paddingVertical: 8,
    paddingHorizontal: 16,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: colors.stroke,
    alignItems: "center",
    justifyContent: "space-around",
    position: "relative",
  },
  navItem: {
    alignItems: "center",
    flex: 1,
    paddingVertical: 8,
  },
  navIcon: {
    width: 20,
    height: 20,
    marginBottom: 4,
  },
  navLabel: {
    fontSize: 10,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
  },

  activeLabel: {
    color: colors.primary,
    fontFamily: fonts.PlusJakartaSansMedium,
  },
  centerButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  centerIcon: {
    width: 24,
    height: 24,
    tintColor: "white",
  },
});

export default BottomNavigation;
