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
  Alert, 
} from "react-native";
// Ensure this path is correct based on your file structure
import DiscussionCard from "../../components/community/DiscussionCard"; 
import CustomButton from "../../components/CustomButton";
import colors from "../../constants/color";
import fonts from "../../constants/fonts";
import { router } from "expo-router";
// Ensure you have configured API_BASE_URL in your environment setup
import { API_BASE_URL } from "@env"; 
// 🔑 1. IMPORT THE AUTH HOOK
import { useAuth } from "../../context/AuthContext"; // ⚠️ VERIFY PATH

// Helper function to derive a reliable username for display/comparison
const getUsernameForComparison = (user) => {
    if (!user) return "Guest";
    // Prioritize username or name
    const nameOrUsername = user?.userName || user?.name;
    if (nameOrUsername) return nameOrUsername;
    // Fallback: Use the part of the email before the @ sign
    if (user.email) {
        return user.email.split('@')[0];
    }
    return "Guest";
};

const Discussions = () => {
  // 🔑 2. USE THE HOOK TO GET USER DATA
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState("All");
  const [searchText, setSearchText] = useState("");
  
  // 🔑 3. DERIVE USER ID and NAME from context
  const currentUserId = user?._id || user?.id || null;
  // Use the helper for a consistent name
  const currentUserName = getUsernameForComparison(user); 
  
  const [discussionsData, setDiscussionsData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to refresh all discussions
  const fetchDiscussions = async (setLoadingState = true) => {
    if (setLoadingState) setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/discussions/get-discussions`
      );
      const json = await response.json();
      if (json.success) {
        // Map backend _id to frontend id for consistency
        setDiscussionsData(json.data.map(d => ({ ...d, id: d.id || d._id }))); 
      } else {
        console.error("API Fetch Error:", json.message || "Unknown error");
      }
    } catch (error) {
      console.error("Error fetching discussions:", error);
    } finally {
      if (setLoadingState) setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscussions();
  }, []);

  // Handler for Pin/Unpin
  const handleTogglePinStatus = async (discussionId, newPinnedState) => {
    // Basic check for admin/moderator permission for pinning
    if (!user /* || !user.role === 'admin' */) {
        Alert.alert("Permission Denied", "You must have moderator privileges to pin a post.");
        return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/discussions/discussions/${discussionId}/pin`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ isPinned: newPinnedState }),
        }
      );
      const json = await response.json();

      if (json.success) {
        setDiscussionsData(prevData =>
          prevData.map(d =>
            d.id === discussionId ? { ...d, isPinned: json.data } : d
          )
        );
        Alert.alert(
          "Success",
          `Discussion ${newPinnedState ? 'pinned' : 'unpinned'} successfully.`
        );
      } else {
        throw new Error(json.message || `Failed to ${newPinnedState ? 'pin' : 'unpin'} post.`);
      }
    } catch (error) {
      console.error("Error toggling pin status:", error);
      Alert.alert("Error", error.message || "Could not toggle pin status.");
      fetchDiscussions(false); 
    }
  };

  // Helper to map frontend reason to backend enum (e.g., 'spam', 'harassment')
  const mapFlagReason = (reason) => {
    if (reason.toLowerCase().includes('spam')) return 'spam';
    if (reason.toLowerCase().includes('harassment') || reason.toLowerCase().includes('abusive')) return 'harassment';
    return 'other';
  };
  
  // Handler for Flagging (UPDATED)
  const handleFlagPost = async (discussionId, reason) => {
    if (!currentUserId) {
        Alert.alert("Login Required", "Please log in to report a post.");
        return;
    }
    
    const backendReason = mapFlagReason(reason);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/discussions/discussions/${discussionId}/flag`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            reason: backendReason,
            flaggedByUserId: currentUserId // 🎯 Using the dynamic user ID
          }),
        }
      );
      const json = await response.json();

      if (json.success) {
        Alert.alert("Post Reported", json.message);
        fetchDiscussions(false); 
      } else {
        throw new Error(json.message || "Failed to flag post.");
      }
    } catch (error) {
      console.error("Error flagging post:", error);
      Alert.alert("Error", error.message || "Could not flag post.");
    }
  };

  // Handler for Commenting and Replying
  const handleAddComment = async (discussionId, commentData) => {
    const { text, userName, userId, replyingTo } = commentData; 
    
    if (!userId) {
        Alert.alert("Login Required", "You must be logged in to post a comment.");
        return;
    }

    const endpoint = `/api/discussions/discussions/${discussionId}/comments`;
    
    try {
      const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            text, 
            user: userName,         // 🔑 Dynamic user name for display
            userId: userId,         // 🔑 Dynamic user ID for linking
            replyingTo      
          }),
        }
      );
      const json = await response.json();

      if (json.success) {
        fetchDiscussions(false); 
      } else {
        throw new Error(json.message || "Failed to post comment/reply.");
      }
    } catch (error) {
      console.error("Error adding comment/reply:", error);
      Alert.alert("Error", error.message || "Could not post comment/reply.");
    }
  };


  // Filtering and Rendering Logic
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
      // 🔑 CORRECTED FILTER LOGIC
      // Compare both ID (most reliable) and Name (using case-insensitive for robustness)
      filteredDiscussions = discussionsData.filter(
        (d) => 
          (currentUserId && d.userId === currentUserId) || 
          (d.user?.toLowerCase() === currentUserName?.toLowerCase()) // Case-insensitive check
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
              ? `You haven't started any discussions as "${currentUserName}" yet` // 🔑 Dynamic Name
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
            discussionId={discussion.id} 
            hashtags={discussion.hashtags}
            title={discussion.title}
            userName={discussion.user}
            timeAgo={new Date(discussion.createdAt).toLocaleString()}
            content={discussion.description}
            likes={discussion.likes}
            replies={discussion.comments?.length || 0}
            isPinned={discussion.isPinned}
            comments={discussion.comments}
            images={discussion.images} 
            onAddComment={(comment) => handleAddComment(discussion.id, comment)} 
            onPinToggle={handleTogglePinStatus} 
            onFlagPost={handleFlagPost}     
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
          onPress={() => {
            if (user) {
              router.push("/pages/Community/StartDiscussion");
            } else {
              Alert.alert("Login Required", "You must be logged in to start a new discussion.");
              // Optionally navigate to login screen: router.push("/login");
            }
          }}
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
    textAlign: 'center',
    paddingHorizontal: 30,
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