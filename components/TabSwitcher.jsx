import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../constants/color';
import fonts from '../constants/fonts';

const TabSwitcher = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <View style={styles.tabRow}>
      {tabs.map((tab) => (
        <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
          <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderColor: colors.stroke,
    marginTop: 12,
    paddingBottom: 10,
  },
  tabText: {
    fontSize: 15,
    color: colors.secondaryText,
    fontFamily: fonts.PlusJakartaSansBold,
  },
  tabTextActive: {
    color: colors.primary,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
});

export default TabSwitcher;
