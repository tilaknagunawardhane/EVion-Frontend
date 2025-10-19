// src/components/DiscussionCard.js

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
import { useAuth } from '../../context/AuthContext'; 

const DiscussionCard = ({
  discussionId, // REQUIRED: ID to send to the parent/API
  hashtags = [],
  title,
  userName,
  timeAgo,
  content,
  isPinned = false, 
  userAvatar,
  onPinToggle, 
  onFlagPost, 
  comments = [],
  onAddComment, 
  images = [],
}) => {
  // 2. USE THE HOOK TO GET THE CURRENT USER
  const { user } = useAuth();
  
  const [showMenu, setShowMenu] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null); 
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
    // Call the parent function with the discussionId and the new pin state
    if (onPinToggle) {
      onPinToggle(discussionId, !isPinned); 
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleComments = () => {
    setShowComments(prev => !prev);
    if (showComments) {
      setReplyingTo(null);
      setNewComment("");
    }
  };

  const handleAddComment = () => {
    // 3. DYNAMICALLY GET USER DATA
    // Use optional chaining (?.) and logical OR (||) for safe access and fallbacks
    // If your user object has 'displayName' use: user?.displayName
    const currentUserName = user?.name || user?.email || "Anonymous User"; 
    const currentUserId = user?._id || user?.id || null; // Sending ID is crucial for the backend

    if (!user) {
        Alert.alert("Authentication Required", "You must be logged in to post a comment.");
        return;
    }
    
    if (newComment.trim()) {
      if (onAddComment) {
        // Pass a comment object including replyingTo ID. Parent manages discussionId.
        onAddComment({
          text: newComment.trim(),
          userName: currentUserName, // <-- Now dynamic!
          userId: currentUserId,     // <-- Added for completeness/best practice
          replyingTo: replyingTo, 
        });
      }
      setNewComment("");
      setReplyingTo(null);
    }
  };

  const handleReply = (commentId, userName) => {
    setReplyingTo(commentId);
    setShowComments(true);
  };

  const handleFlag = (reason) => {
    setShowFlagModal(false);
    if (onFlagPost) {
      onFlagPost(discussionId, reason); 
    }
    // The parent component (Discussions.js) handles the API call and provides a successful Alert.
  };
  
  const shortContent = content.length > 150 ? content.substring(0, 150) + "..." : content;

  // Helper function to format date/time
  const formatCommentTime = (dateString) => {
    if (!dateString) return "Just now";
    const date = new Date(dateString);
    // Simple formatting: 10/17/2025 1:00 AM
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Function to render comment or reply
  const CommentItem = ({ comment, isReply = false }) => {
    // Determine the unique ID (Mongo _id or temp frontend id)
    const uniqueId = comment._id || comment.id;
    // Prefer backend user field (user) over frontend placeholder (userName)
    const commentUser = comment.user || comment.userName;
    const commentTime = comment.timeAgo || formatCommentTime(comment.created_at);
    
    return (
      <View 
        key={uniqueId} 
        style={[
          styles.commentContainer, 
          isReply && styles.replyContainer,
          { borderBottomWidth: isReply ? 0 : 1 } 
        ]}
      >
        <View style={styles.commentHeader}>
          <Image
            source={require("../../assets/Jone-Doe.png")} // Replace with actual avatar logic
            style={styles.commentAvatar}
          />
          <View style={styles.commentUserInfo}>
            <Text style={styles.commentUserName}>{commentUser}</Text> 
            <Text style={styles.commentTime}>{commentTime}</Text>
          </View>
        </View>
        <Text style={[styles.commentText, {paddingLeft: isReply ? 0 : 32}]}>{comment.text}</Text>
        
        {!isReply && (
          <TouchableOpacity
            style={styles.replyButton}
            onPress={() => handleReply(uniqueId, commentUser)}
          >
            <Text style={styles.replyButtonText}>Reply</Text>
          </TouchableOpacity>
        )}

        {/* Render nested replies */}
        {comment.replies && comment.replies.length > 0 && (
          <View style={styles.repliesContainer}>
            {comment.replies.map((reply) => (
              <CommentItem key={reply._id || reply.id} comment={reply} isReply={true} /> 
            ))}
          </View>
        )}
      </View>
    )
  };

  // Calculate total count (top-level + nested replies)
  const totalReplies = comments.reduce((count, comment) => {
    return count + 1 + (comment.replies?.length || 0);
  }, 0);
  
  // Helper to find the name of the user being replied to
  const getReplyingToName = () => {
    const parentComment = comments.find(c => (c._id || c.id) === replyingTo);
    if (!parentComment) return 'a comment'; 
    return parentComment.user || parentComment.userName || 'a comment';
  }

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
                {isPinned ? "Unpin Post" : "Pin Post"} 
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => {
                setShowMenu(false); 
                setShowFlagModal(true);
              }}
            >
              <Ionicons 
                name="flag-outline" 
                size={18} 
                color={colors.mainTextColor} 
                style={styles.menuIconSpacer} 
              />
              <Text style={styles.menuText}>Flag Post</Text>
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

      {/* ⭐ FIX: NEW Image Display Section */}
      {images && images.length > 0 && (
        <View style={styles.imageGallery}>
          {images.slice(0, 4).map((url, index) => ( 
            <Image
              key={index}
              // The `uri` must be a complete, accessible URL (e.g., from S3, Cloudinary)
              source={{ uri: url }} 
              style={[
                styles.discussionImage,
                // Layout adjustment based on number of images
                images.length === 1 && styles.imageFull,
                images.length === 2 && styles.imageHalf,
                images.length >= 3 && styles.imageThird,
              ]}
              resizeMode="cover"
            />
          ))}
        </View>
      )}

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
            {totalReplies} {totalReplies === 1 ? "Reply" : "Replies"}
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
                <CommentItem key={comment._id || comment.id} comment={comment} />
              ))}
            </ScrollView>
          ) : (
            <Text style={styles.noCommentsText}>No comments yet</Text>
          )}

          <View style={styles.addCommentContainer}>
            {replyingTo && (
              <View style={styles.replyingToBox}>
                <Text style={styles.replyingToText}>
                  Replying to {getReplyingToName()}
                </Text>
                <TouchableOpacity onPress={() => setReplyingTo(null)}>
                  <Ionicons name="close-circle" size={16} color={colors.secondaryText} />
                </TouchableOpacity>
              </View>
            )}
            <View style={styles.commentInputRow}>
              <TextInput
                style={styles.commentInput}
                placeholder={replyingTo ? "Add your reply..." : "Add a comment..."}
                placeholderTextColor={colors.secondaryText}
                value={newComment}
                onChangeText={setNewComment}
                multiline
                // Disable input if user is not logged in
                editable={!!user}
              />
              <TouchableOpacity 
                style={[styles.postCommentButton, (!newComment.trim() || !user) && styles.disabledButton]}
                onPress={handleAddComment}
                disabled={!newComment.trim() || !user}
              >
                <Text style={styles.postCommentButtonText}>
                  {user ? "Post" : "Login"}
                </Text>
              </TouchableOpacity>
            </View>
            {!user && (
                <Text style={styles.loginPromptText}>
                    You must be logged in to post or reply.
                </Text>
            )}
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
          <View style={styles.flagModalContent} onStartShouldSetResponder={() => true}>
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
    borderColor: colors.border,
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
  },
  menuDropdown: {
    position: "absolute",
    top: 40,
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
  menuIconSpacer: { 
    marginRight: 12,
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
  imageGallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  discussionImage: {
    height: 120, 
    borderRadius: 8,
    marginBottom: 8,
  },
  imageFull: {
    width: '100%',
    height: 200, 
  },
  imageHalf: {
    width: '48%', 
  },
  imageThird: {
    width: '30%', 
    height: 80, 
  },
  hiEveryoneBox: {
    backgroundColor: colors.stroke,
    padding: 12,
    borderRadius: 8,
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
  commentsSection: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.stroke,
    paddingTop: 12,
  },
  commentsList: {
    maxHeight: 250,
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
    marginBottom: 4,
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
    alignSelf: 'flex-start',
    marginLeft: 32,
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
    borderBottomWidth: 0,
    paddingBottom: 0,
    marginTop: 8,
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
  replyingToBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: colors.stroke,
    borderRadius: 8,
    marginBottom: 4,
  },
  replyingToText: {
    fontSize: 10,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
  },
  commentInputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  commentInput: {
    flex: 1,
    backgroundColor: colors.stroke,
    borderRadius: 8,
    padding: 12,
    fontSize: 12,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.mainTextColor,
    minHeight: 40,
    marginRight: 8,
  },
  postCommentButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    height: 40,
    justifyContent: 'center',
  },
  postCommentButtonText: {
    fontSize: 12,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.background,
  },
  disabledButton: { 
    backgroundColor: colors.secondaryText,
    opacity: 0.7,
  },
  loginPromptText: { 
    fontSize: 10,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
    textAlign: 'center',
    marginTop: 4,
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