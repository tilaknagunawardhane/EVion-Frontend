import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  Alert,
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import colors from "../constants/color";
import fonts from "../constants/fonts";

const DiscussionCard = ({
  hashtags = [],
  title,
  userName,
  timeAgo,
  content,
  likes = 0,
  replies = 0,
  isPinned = false,
  userAvatar,
  onPinToggle,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showFlagModal, setShowFlagModal] = useState(false);

  const flagReasons = [
    "Spam or unwanted commercial content",
    "Harassment or abusive behavior", 
    "Hate speech or discrimination",
    "False information or misinformation",
    "Inappropriate content",
    "Copyright infringement",
    "Other"
  ];

  const handlePinToggle = () => {
    setShowMenu(false);
    if (onPinToggle) {
      onPinToggle();
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleFlag = (reason) => {
    setShowFlagModal(false);
    Alert.alert(
      "Post Flagged",
      `Thank you for reporting this post. Reason: ${reason}`,
      [{ text: "OK" }]
    );
  };

  const shortContent = "Hi everyone, I recently bought an EV and noticed that the real-world range I'm getting on a full charge is significantly lower than the manufacturer's advertised range.";
  
  const fullContent = `Hi everyone, I recently bought an EV and noticed that the real-world range I'm getting on a full charge is significantly lower than the manufacturer's advertised range. For example, my EV is supposed to do 450 km per charge, but I barely get 320 km, even with careful driving. I'm trying to understand what factors actually affect this - things like AC usage, passenger load, or terrain. Can other EV users share their experiences? How much range are you realistically getting, and what are your driving conditions like? Also, any tips to improve range would be great.`;

  return (
    <View style={styles.card}>
      {/* Three dots menu */}
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setShowMenu(true)}
      >
        <View style={styles.threeDots}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </TouchableOpacity>

      {/* Menu Modal */}
      <Modal
        visible={showMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowMenu(false)}
        >
          <View style={styles.menuDropdown}>
            <TouchableOpacity style={styles.menuItem} onPress={handlePinToggle}>
              <Image
                source={require("../assets/pin.png")}
                style={styles.menuIcon}
              />
              <Text style={styles.menuText}>
                {isPinned ? "Unpin Post" : "Pin Post"}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Hashtags */}
      <View style={styles.hashtagContainer}>
        {hashtags.map((tag, index) => (
          <View key={index} style={styles.hashtagItem}>
            <Text style={styles.hashtag}>#{tag}</Text>
            {index < hashtags.length - 1 && (
              <Text style={styles.separator}>|</Text>
            )}
          </View>
        ))}
      </View>

      {/* Title and Pin Badge */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        {isPinned && (
          <View style={styles.pinnedBadge}>
            <Image
              source={require("../assets/pin.png")}
              style={styles.pinnedIcon}
            />
            <Text style={styles.pinnedText}>Pinned</Text>
          </View>
        )}
      </View>

      {/* User Info */}
      <View style={styles.userInfo}>
        <Image
          source={require("../assets/Jone-Doe.png")}
          style={styles.avatar}
        />
        <View style={styles.userTextContainer}>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.timeAgo}>{timeAgo}</Text>
        </View>
      </View>

      {/* Hi Everyone Box with Read More */}
      <View style={styles.hiEveryoneBox}>
        <Text style={styles.hiEveryoneText}>
          {isExpanded ? fullContent : shortContent}
          {!isExpanded && (
            <Text style={styles.readMore} onPress={toggleExpanded}>
              {" "}Read More
            </Text>
          )}
        </Text>
        {isExpanded && (
          <TouchableOpacity onPress={toggleExpanded} style={styles.readLessContainer}>
            <Text style={styles.readLess}>Read Less</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Separator Line */}
      <View style={styles.separator} />

      {/* Interaction Buttons */}
      <View style={styles.interactionRow}>
        <TouchableOpacity style={styles.interactionButton}>
          <Image
            source={require("../assets/Massages.png")}
            style={styles.likeIcon}
          />
          <Text style={styles.interactionText}>{likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.interactionButton}>
          <Image
            source={require("../assets/Replyarrow.png")}
            style={styles.replyIcon}
          />
          <Text style={styles.interactionText}>Reply</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.interactionButton}
          onPress={() => setShowFlagModal(true)}
        >
          <Ionicons 
            name="flag-outline" 
            size={16} 
            color={colors.secondaryText} 
          />
          <Text style={styles.interactionText}>Flag</Text>
        </TouchableOpacity>
      </View>

      {/* Flag Modal */}
      <Modal
        visible={showFlagModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowFlagModal(false)}
      >
        <TouchableOpacity 
          style={styles.flagModalOverlay}
          activeOpacity={1}
          onPress={() => setShowFlagModal(false)}
        >
          <View style={styles.flagModalContent}>
            <Text style={styles.flagModalTitle}>Report this post</Text>
            <Text style={styles.flagModalSubtitle}>Why are you reporting this post?</Text>
            
            {flagReasons.map((reason, index) => (
              <TouchableOpacity
                key={index}
                style={styles.flagOption}
                onPress={() => handleFlag(reason)}
              >
                <Text style={styles.flagOptionText}>{reason}</Text>
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowFlagModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    bordercolor: colors.border,
    padding: 16,
    position: "relative",
    shadowColor: colors.secondaryText,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menuButton: {
    position: "absolute",
    top: 16,
    right: 16,
    padding: 4,
  },
  threeDots: {
    flexDirection: "column",
    alignItems: "center",
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.secondaryText,
    marginVertical: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor:colors.mainTextColor,
    justifyContent: "center",
    alignItems: "center",
  },
  menuDropdown: {
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingVertical: 8,
    minWidth: 150,
    shadowColor:colors.stroke,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuIcon: {
    width: 16,
    height: 16,
    marginRight: 12,
    tintColor: colors.primary,
  },
  menuText: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.mainTextColor,
  },
  hashtagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
    marginTop: 4,
  },
  hashtagItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
    marginBottom: 4,
  },
  hashtag: {
    color: colors.HighlightText,
    fontSize: 12,
    fontFamily: fonts.PlusJakartaSans,
  },
  separator: {
    color: colors.HighlightText,
    fontSize: 12,
    fontFamily: fonts.PlusJakartaSans,
    marginHorizontal: 6,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingRight: 24,
  },
  title: {
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    flex: 1,
    lineHeight: 22,
  },
  pinnedBadge: {
    backgroundColor: colors.bgGreen,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  pinnedIcon: {
    width: 10,
    height: 10,
    tintColor: colors.primary,
    marginRight: 4,
  },
  pinnedText: {
    color: colors.primary,
    fontSize: 10,
    fontFamily: fonts.PlusJakartaSansMedium,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  userTextContainer: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.mainTextColor,
  },
  timeAgo: {
    fontSize: 12,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
    marginTop: 2,
  },
  hiEveryoneBox: {
    backgroundColor: colors.stroke,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  separator: {
    height: 1,
    backgroundColor: colors.stroke,
    marginBottom: 16,
  },
  hiEveryoneText: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.mainTextColor,
    lineHeight: 20,
  },
  readMore: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    textDecorationLine: "underline",
  },
  readLessContainer: {
    marginTop: 8,
    alignItems: "flex-end",
  },
  readLess: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    textDecorationLine: "underline",
  },
  interactionRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  interactionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    padding: 4,
  },
  likeIcon: {
    width: 16,
    height: 16,
    marginRight: 6,
    tintColor: colors.secondaryText,
  },
  replyIcon: {
    width: 16,
    height: 16,
    marginRight: 6,
    tintColor: colors.secondaryText,
  },
  interactionText: {
    fontSize: 12,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
  },
  flagModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flagModalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 20,
    maxWidth: 320,
    width: '100%',
  },
  flagModalTitle: {
    fontSize: 18,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    textAlign: 'center',
    marginBottom: 8,
  },
  flagModalSubtitle: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
    textAlign: 'center',
    marginBottom: 20,
  },
  flagOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  flagOptionText: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.mainTextColor,
  },
  cancelButton: {
    marginTop: 16,
    paddingVertical: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.secondaryText,
  },
});

export default DiscussionCard;
