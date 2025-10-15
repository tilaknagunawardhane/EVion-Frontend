import React, { useState, useEffect } from "react";
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
  ActivityIndicator,
} from "react-native";
import DiscussionCard from "../../components/community/DiscussionCard";
import CustomButton from "../../components/CustomButton";
import colors from "../../constants/color";
import fonts from "../../constants/fonts";
import { router } from "expo-router";
import { API_BASE_URL } from "@env";

const fallbackDiscussions = [
  {
    id: 1,
    hashtags: ["EVrange", "realworldperformance"],
    title: "Realistic Range vs. Manufacturer Claimed Range - What Are You Getting?",
    user: "John Doe",
    createdAt: new Date().toISOString(),
    description:
      "Hi everyone, I recently bought an EV and noticed that the real-world range...",
    likes: 18,
    isPinned: false,
    comments: [
      {
        id: "c1",
        text: "I have the same experience with my EV.",
        user: "Sarah Johnson",
        timeAgo: "2 hrs ago",
        replies: [],
      },
    ],
  },
];

const Discussions = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [currentUser] = useState("John Doe"); // Replace with auth user later
  const [discussionsData, setDiscussionsData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch discussions from backend
  useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/discussions/get-discussions`
        );
        const json = await response.json();
        if (json.success) {
          setDiscussionsData(json.data);
        } else {
          setDiscussionsData(fallbackDiscussions);
        }
      } catch (error) {
        console.error("Error fetching discussions:", error);
        setDiscussionsData(fallbackDiscussions);
      } finally {
        setLoading(false);
      }
    };

    fetchDiscussions();
  }, []);

  const handleAddComment = (discussionId, newComment) => {
    setDiscussionsData((prevData) =>
      prevData.map((discussion) => {
        if (discussion.id === discussionId) {
          const updatedComments = [
            ...discussion.comments,
            {
              ...newComment,
              id: Math.random().toString(36).substring(7),
              replies: [],
            },
          ];
          return {
            ...discussion,
            comments: updatedComments,
          };
        }
        return discussion;
      })
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading all discussions...</Text>
        </View>
      );
    }

    let filteredDiscussions = discussionsData;

    if (activeTab === "Pins") {
      filteredDiscussions = discussionsData.filter((d) => d.isPinned);
    } else if (activeTab === "My Discussions") {
      filteredDiscussions = discussionsData.filter(
        (d) => d.user === currentUser
      );
    }

    if (searchText) {
      filteredDiscussions = filteredDiscussions.filter((d) =>
        d.title.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (filteredDiscussions.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            {activeTab === "Pins"
              ? "No pinned discussions yet"
              : activeTab === "My Discussions"
              ? "You haven't started any discussions yet"
              : searchText
              ? "No discussions found with that title"
              : "No discussions found"}
          </Text>
        </View>
      );
    }

    return (
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredDiscussions.map((discussion) => (
          <DiscussionCard
            key={discussion.id}
            hashtags={discussion.hashtags}
            title={discussion.title}
            userName={discussion.user}
            timeAgo={new Date(discussion.createdAt).toLocaleString()}
            content={discussion.description}
            likes={discussion.likes}
            replies={discussion.comments?.length || 0}
            isPinned={discussion.isPinned}
            comments={discussion.comments}
            onAddComment={(comment) => handleAddComment(discussion.id, comment)}
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
          placeholder="Search by title"
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
          onPress={() => router.push("/pages/Community/StartDiscussion")}
        />
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "All" && styles.activeTab]}
          onPress={() => setActiveTab("All")}
        >
          <Text style={[styles.tabText, activeTab === "All" && styles.activeTabText]}>
            All Discussions
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "Pins" && styles.activeTab]}
          onPress={() => setActiveTab("Pins")}
        >
          <View style={styles.tabContent}>
            <Image
              source={require("../../assets/pin.png")}
              style={[
                styles.pinIcon,
                {
                  tintColor:
                    activeTab === "Pins" ? colors.primary : colors.secondaryText,
                },
              ]}
            />
            <Text style={[styles.tabText, activeTab === "Pins" && styles.activeTabText]}>
              Pins
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "My Discussions" && styles.activeTab]}
          onPress={() => setActiveTab("My Discussions")}
        >
          <Text
            style={[styles.tabText, activeTab === "My Discussions" && styles.activeTabText]}
          >
            My Discussions
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {renderContent()}
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
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    position: "absolute",
    right: 16,
    top: 14,
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
    justifyContent: "space-between",
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 4,
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
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.secondaryText,
    fontFamily: fonts.PlusJakartaSans,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: 50,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.secondaryText,
  },
});

export default Discussions;
