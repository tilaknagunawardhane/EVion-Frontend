import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Platform,
  StatusBar,
  Image,
} from "react-native";
import DiscussionCard from "../../components/DiscussionCard";
import BottomNavigation from "../../components/BottomNavigation";
import CustomButton from "../../components/CustomButton";
import colors from "../../constants/color";
import fonts from "../../constants/fonts";

const Discussions = () => {
  const [activeTab, setActiveTab] = useState("Pins");
  const [searchText, setSearchText] = useState("");

  const discussionsData = [
    {
      id: 1,
      hashtags: ["EVrange", "realworldperformance"],
      title:
        "Realistic Range vs. Manufacturer Claimed Range - What Are You Getting?",
      userName: "John Doe",
      timeAgo: "3 hrs ago",
      content:
        "Hi everyone, I recently bought an EV and noticed that the real-world range I'm getting on a full charge is significantly lower than the manufacturer's advertised range. Read More",
      likes: 18,
      replies: 0,
      isPinned: false,
    },
    {
      id: 2,
      hashtags: ["chargingissues", "bugs", "crowcharging"],
      title: "BYD Atto 3 vs Nissan Leaf - Which is Better for Long Trips?",
      userName: "John Doe",
      timeAgo: "3 hrs ago",
      content:
        "Hi everyone, I recently bought an EV and noticed that the real-world range I'm getting on a full charge is significantly lower than the manufacturer's advertised range. Read More",
      likes: 18,
      replies: 0,
      isPinned: true,
    },
  ];

  const renderContent = () => {
    // Filter discussions based on active tab
    const filteredDiscussions = activeTab === "Pins" 
      ? discussionsData.filter(discussion => discussion.isPinned)
      : discussionsData;

    return (
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredDiscussions.map((discussion) => (
          <DiscussionCard
            key={discussion.id}
            hashtags={discussion.hashtags}
            title={discussion.title}
            userName={discussion.userName}
            timeAgo={discussion.timeAgo}
            content={discussion.content}
            likes={discussion.likes}
            replies={discussion.replies}
            isPinned={discussion.isPinned}
          />
        ))}
        <View style={styles.bottomPadding} />
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discussions</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by Keywords"
          placeholderTextColor={colors.secondaryText}
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity style={styles.searchIcon}>
          <Image
            source={require("../../assets/Search.png")}
            style={styles.searchIconImage}
          />
        </TouchableOpacity>
      </View>

      {/* Start Discussion Button */}
      <View style={styles.buttonContainer}>
        <CustomButton
          title="Start a Discussion"
          type="primary"
          style={styles.startDiscussionButton}
          textStyle={styles.startDiscussionText}
          icon={require("../../assets/Pencil.png")}
        />
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "Pins" && styles.activeTab]}
          onPress={() => setActiveTab("Pins")}
        >
          <View style={styles.tabContent}>
            <Image
              source={require("../../assets/pin.png")}
              style={[
                styles.pinIcon,
                { tintColor: activeTab === "Pins" ? colors.primary : colors.secondaryText },
              ]}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === "Pins" && styles.activeTabText,
              ]}
            >
              Pins
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "My Discussions" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("My Discussions")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "My Discussions" && styles.activeTabText,
            ]}
          >
            My Discussions
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {renderContent()}

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="Community" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 25 : 60,
    paddingHorizontal: 16,
    paddingBottom: 20,
    backgroundColor: colors.background,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
  },
  searchContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    position: "relative",
  },
  searchInput: {
    height: 44,
    backgroundColor: "white",
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingRight: 48,
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.mainTextColor,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    position: "absolute",
    right: 16,
    top: 14,
  },
  searchIconText: {
    fontSize: 16,
    color: colors.secondaryText,
  },
  searchIconImage: {
    width: 40,
    height: 19,
    tintColor: colors.secondaryText,
  },
  pinIcon: {
    width: 14,
    height: 14,
    marginRight: 6,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  startDiscussionButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
  },
  startDiscussionText: {
    color: "white",
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSansMedium,
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginRight: 24,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
  },
  tabContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  activeTabText: {
    color: colors.primary,
    fontFamily: fonts.PlusJakartaSansMedium,
  },
  content: {
    flex: 1,
  },
  bottomPadding: {
    height: 100,
  },
});

export default Discussions;
