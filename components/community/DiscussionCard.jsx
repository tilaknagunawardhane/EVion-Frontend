import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import colors from "../../constants/color";
import fonts from "../../constants/fonts";

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
  comments = [],
  onAddComment,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [pinned, setPinned] = useState(isPinned); // Local pin state

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
    setPinned(prev => !prev);
    if (onPinToggle) {
      onPinToggle(!pinned);
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      if (onAddComment) {
        onAddComment({
          id: Math.random().toString(36).substring(7),
          text: newComment,
          userName: "Current User",
          timeAgo: "Just now",
          replies: [],
          replyingTo: replyingTo,
        });
      }
      setNewComment("");
      setReplyingTo(null);
    }
  };

  const handleReply = (commentId) => {
    setReplyingTo(commentId);
    setShowComments(true);
  };

  const handleFlag = (reason) => {
    setShowFlagModal(false);
    Alert.alert(
      "Post Flagged",
      `Thank you for reporting this post. Reason: ${reason}`,
      [{ text: "OK" }]
    );
  };

  const shortContent = content.length > 150 ? content.substring(0, 150) + "..." : content;
  
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
        transparent
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
                source={require("../../assets/pin.png")}
                style={styles.menuIcon}
              />
              <Text style={styles.menuText}>
                {pinned ? "Unpin Post" : "Pin Post"}
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
        {pinned && (
          <View style={styles.pinnedBadge}>
            <Image
              source={require("../../assets/pin.png")}
              style={styles.pinnedIcon}
            />
            <Text style={styles.pinnedText}>Pinned</Text>
          </View>
        )}
      </View>

      {/* User Info */}
      <View style={styles.userInfo}>
        <Image
          source={require("../../assets/Jone-Doe.png")}
          style={styles.avatar}
        />
        <View style={styles.userTextContainer}>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.timeAgo}>{timeAgo}</Text>
        </View>
      </View>

      {/* Content with Read More */}
      <View style={styles.hiEveryoneBox}>
        <Text style={styles.hiEveryoneText}>
          {isExpanded ? content : shortContent}
          {content.length > 150 && !isExpanded && (
            <Text style={styles.readMore} onPress={toggleExpanded}>
              {" "}Read More
            </Text>
          )}
        </Text>
        {isExpanded && content.length > 150 && (
          <TouchableOpacity onPress={toggleExpanded} style={styles.readLessContainer}>
            <Text style={styles.readLess}>Read Less</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Separator Line */}
      <View style={styles.separatorLine} />

      {/* Interaction Buttons */}
      <View style={styles.interactionRow}>
        <TouchableOpacity 
          style={styles.interactionButton} 
          onPress={toggleComments}
        >
          <Image
            source={require("../../assets/Replyarrow.png")}
            style={styles.replyIcon}
          />
          <Text style={styles.interactionText}>
            {replies} {replies === 1 ? "Reply" : "Replies"}
          </Text>
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

      {/* Comments Section */}
      {showComments && (
        <View style={styles.commentsSection}>
          {comments.length > 0 ? (
            <ScrollView style={styles.commentsList}>
              {comments.map((comment) => (
                <View key={comment.id} style={styles.commentContainer}>
                  <View style={styles.commentHeader}>
                    <Image
                      source={require("../../assets/Jone-Doe.png")}
                      style={styles.commentAvatar}
                    />
                    <View style={styles.commentUserInfo}>
                      <Text style={styles.commentUserName}>{comment.userName}</Text>
                      <Text style={styles.commentTime}>{comment.timeAgo}</Text>
                    </View>
                  </View>
                  <Text style={styles.commentText}>{comment.text}</Text>
                  <TouchableOpacity 
                    style={styles.replyButton}
                    onPress={() => handleReply(comment.id)}
                  >
                    <Text style={styles.replyButtonText}>Reply</Text>
                  </TouchableOpacity>
                  
                  {comment.replies && comment.replies.length > 0 && (
                    <View style={styles.repliesContainer}>
                      {comment.replies.map((reply) => (
                        <View key={reply.id} style={styles.replyContainer}>
                          <View style={styles.commentHeader}>
                            <Image
                              source={require("../../assets/Jone-Doe.png")}
                              style={styles.commentAvatar}
                            />
                            <View style={styles.commentUserInfo}>
                              <Text style={styles.commentUserName}>{reply.userName}</Text>
                              <Text style={styles.commentTime}>{reply.timeAgo}</Text>
                            </View>
                          </View>
                          <Text style={styles.commentText}>{reply.text}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>
          ) : (
            <Text style={styles.noCommentsText}>No comments yet</Text>
          )}

          <View style={styles.addCommentContainer}>
            {replyingTo && (
              <Text style={styles.replyingToText}>
                Replying to {comments.find(c => c.id === replyingTo)?.userName}
              </Text>
            )}
            <TextInput
              style={styles.commentInput}
              placeholder="Add a comment..."
              placeholderTextColor={colors.secondaryText}
              value={newComment}
              onChangeText={setNewComment}
              multiline
            />
            <TouchableOpacity 
              style={styles.postCommentButton}
              onPress={handleAddComment}
            >
              <Text style={styles.postCommentButtonText}>Post</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Flag Modal */}
      <Modal
        visible={showFlagModal}
        transparent
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
menuOverlay: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
},
menuDropdown: {
  position: "absolute",
  top: 40,  // adjust relative to three dots button
  right: 16,
  backgroundColor: colors.background,
  borderRadius: 12,
  paddingVertical: 4,
  minWidth: 180,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.1,
  shadowRadius: 8,
  elevation: 6,
},
menuItem: {
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: 12,
  paddingHorizontal: 16,
},
menuIcon: {
  width: 18,
  height: 18,
  marginRight: 12,
  tintColor: colors.mainTextColor,
},
menuText: {
  fontSize: 15,
  fontFamily: fonts.PlusJakartaSansMedium,
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

  // Add these new styles:
  commentsSection: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.stroke,
    paddingTop: 12,
  },
  commentsList: {
    maxHeight: 200,
    marginBottom: 12,
  },
  commentContainer: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.stroke,
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  commentAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  commentUserInfo: {
    flex: 1,
  },
  commentUserName: {
    fontSize: 12,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.mainTextColor,
  },
  commentTime: {
    fontSize: 10,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
  },
  commentText: {
    fontSize: 12,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.mainTextColor,
    marginBottom: 8,
    lineHeight: 16,
  },
  replyButton: {
    alignSelf: 'flex-end',
  },
  replyButtonText: {
    fontSize: 12,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  repliesContainer: {
    marginLeft: 16,
    marginTop: 8,
    borderLeftWidth: 2,
    borderLeftColor: colors.stroke,
    paddingLeft: 8,
  },
  replyContainer: {
    marginBottom: 8,
  },
  noCommentsText: {
    fontSize: 12,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
    textAlign: 'center',
    marginVertical: 16,
  },
  addCommentContainer: {
    marginTop: 8,
  },
  replyingToText: {
    fontSize: 10,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
    marginBottom: 4,
  },
  commentInput: {
    backgroundColor: colors.stroke,
    borderRadius: 8,
    padding: 12,
    fontSize: 12,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.mainTextColor,
    minHeight: 40,
    marginBottom: 8,
  },
  postCommentButton: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  postCommentButtonText: {
    fontSize: 12,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.background,
  },
  separatorLine: {
    height: 1,
    backgroundColor: colors.stroke,
    marginBottom: 16,
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
    backgroundColor: colors.stroke,
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