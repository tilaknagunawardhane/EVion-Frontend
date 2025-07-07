import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Modal,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import colors from "../../constants/color";
import fonts from "../../constants/fonts";

const Discussion = () => {
  const [replyText, setReplyText] = useState("");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showUnpinMenu, setShowUnpinMenu] = useState(false);
  const [sortBy, setSortBy] = useState("Most Recent");
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [showKeyboard, setShowKeyboard] = useState(false);

  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardHeight(0);
      },
    );

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  const discussionData = {
    hashtags: ["EVrange", "realworldperformance"],
    title:
      "Realistic Range vs. Manufacturer Claimed Range - What Are You Getting?",
    userName: "John Doe",
    timeAgo: "3 hrs ago",
    content:
      "Hi everyone, I recently bought an EV and noticed that the real-world range I'm getting on a full charge is significantly lower than the manufacturer's advertised range.",
    likes: 18,
    replies: 4,
    isPinned: true,
    hasImage: true,
    imageUrl: require("../../assets/Car-blue.png"),
  };

  const commentsData = [
    {
      id: 1,
      userName: "John Doe",
      timeAgo: "3 hrs ago",
      content:
        "Try using Eco mode if your car has it — helps stretch the range a bit",
      likes: 18,
      avatar: require("../../assets/Jone-Doe.png"),
    },
    {
      id: 2,
      userName: "John Doe",
      timeAgo: "1 hr ago",
      content: "Thanks",
      likes: 0,
      avatar: require("../../assets/Jone-Doe.png"),
      isReply: true,
    },
    {
      id: 3,
      userName: "John Doe",
      timeAgo: "12 mins ago",
      content: "",
      likes: 0,
      hasThumbsUp: true,
      avatar: require("../../assets/Jone-Doe.png"),
      isReply: true,
    },
    {
      id: 4,
      userName: "Emily",
      timeAgo: "3 hrs ago",
      content:
        "Hey, totally relatable! I drive a BYD Atto 3, and yeah, the range difference is real. On paper, it says 420 km, but realistically I get around 350 km, especially if I'm using AC or carrying passengers. ",
      likes: 0,
      avatar: require("../../assets/Jone-Doe.png"),
      hasReadMore: true,
    },
  ];

  const sortOptions = ["Most Recent", "Earliest"];

  const handleSendReply = () => {
    if (replyText.trim()) {
      // Handle sending reply - you can add your logic here
      console.log('Sending reply:', replyText);
      setReplyText("");
    }
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={colors.mainTextColor}
          />
        </TouchableOpacity>
        <View style={styles.headerSpacer} />
        {discussionData.isPinned && (
          <View style={styles.pinnedBadge}>
            <Image
              source={require("../../assets/pin.png")}
              style={styles.pinnedIcon}
            />
            <Text style={styles.pinnedText}>Pinned</Text>
          </View>
        )}
      </View>
      <View style={styles.userHeaderSection}>
        <Image
          source={require("../../assets/Jone-Doe.png")}
          style={styles.headerAvatar}
        />
        <View style={styles.headerUserInfo}>
          <Text style={styles.headerUserName}>{discussionData.userName}</Text>
          <Text style={styles.headerTimeAgo}>{discussionData.timeAgo}</Text>
        </View>
      </View>
    </View>
  );

  const renderMainPost = () => (
    <View style={styles.mainPost}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{discussionData.title}</Text>
        <TouchableOpacity
          style={styles.moreButton}
          onPress={() => setShowUnpinMenu(true)}
        >
          <View style={styles.threeDotsHorizontal}>
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.hashtagContainer}>
        {discussionData.hashtags.map((tag, index) => (
          <View key={index} style={styles.hashtagItem}>
            <Text style={styles.hashtag}>#{tag}</Text>
            {index < discussionData.hashtags.length - 1 && (
              <Text style={styles.hashtagSeparator}>|</Text>
            )}
          </View>
        ))}
      </View>

      <Text style={styles.content}>{discussionData.content}</Text>

      {discussionData.hasImage && (
        <Image
          source={
            typeof discussionData.imageUrl === "string"
              ? { uri: discussionData.imageUrl }
              : discussionData.imageUrl
          }
          style={styles.postImage}
          resizeMode="cover"
        />
      )}

      <View style={styles.interactionRow}>
        <TouchableOpacity style={styles.interactionButton}>
          <Image
            source={require("../../assets/Massages.png")}
            style={styles.interactionIcon}
          />
          <Text style={styles.interactionText}>{discussionData.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.interactionButton, styles.replyButton]}
        >
          <Image
            source={require("../../assets/Replyarrow.png")}
            style={styles.interactionIcon}
          />
          <Text style={styles.interactionText}>Reply</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSortHeader = () => (
    <View style={styles.sortContainer}>
      <TouchableOpacity
        style={styles.sortButton}
        onPress={() => setShowSortMenu(true)}
      >
        <Text style={styles.sortText}>{sortBy}</Text>
        <Ionicons name="chevron-down" size={16} color={colors.secondaryText} />
      </TouchableOpacity>
    </View>
  );

  const renderComment = (comment) => (
    <View key={comment.id} style={[
      styles.commentContainer,
      comment.isReply && styles.threadedComment
    ]}>
      {comment.isReply && <View style={styles.threadLine} />}
      <View style={comment.isReply ? styles.threadedAvatarContainer : styles.normalAvatarContainer}>
        <Image source={comment.avatar} style={[
          styles.commentAvatar,
          comment.isReply && styles.threadedAvatar
        ]} />
      </View>
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <Text style={styles.commentUserName}>{comment.userName}</Text>
          <Text style={styles.commentTimeAgo}>{comment.timeAgo}</Text>
        </View>

        {comment.hasThumbsUp ? (
          <View style={styles.thumbsUpContainer}>
            <Text style={styles.thumbsUp}>👍</Text>
          </View>
        ) : (
          <>
            <Text style={styles.commentText}>
              {comment.content}
              {comment.hasReadMore && (
                <Text style={styles.readMoreText}> Read More</Text>
              )}
            </Text>
          </>
        )}

        <View style={styles.commentActions}>
          <TouchableOpacity style={styles.commentActionButton}>
            <Image
              source={require("../../assets/Massages.png")}
              style={styles.commentActionIcon}
            />
            {comment.likes > 0 && (
              <Text style={styles.commentActionText}>{comment.likes}</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.commentActionButton, styles.replyButton]}
          >
            <Image
              source={require("../../assets/Replyarrow.png")}
              style={styles.commentActionIcon}
            />
            <Text style={styles.commentActionText}>Reply</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderInput = () => (
    <View style={styles.inputContainer}>
      <TouchableOpacity onPress={() => console.log('Attach file')}>
        <Ionicons name="attach" size={20} color={colors.secondaryText} style={styles.attachIcon} />
      </TouchableOpacity>
      <TextInput
        style={styles.textInputField}
        placeholder="Reply to John"
        placeholderTextColor={colors.secondaryText}
        value={replyText}
        onChangeText={setReplyText}
        multiline
        maxLength={500}
      />
      <TouchableOpacity
        style={styles.shareButton}
        onPress={handleSendReply}
      >
        <Image
          source={require("../../assets/Share.png")}
          style={styles.shareIcon}
        />
      </TouchableOpacity>
    </View>
  );

  const renderKeyboard = () => {
    if (!showKeyboard) return null;

    const keyboardRows = [
      ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
      ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
      ["shift", "z", "x", "c", "v", "b", "n", "m", "delete"],
      ["123", "globe", "space", "return"],
    ];

    return (
      <View style={styles.keyboardContainer}>
        {keyboardRows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.keyboardRow}>
            {row.map((key, keyIndex) => (
              <TouchableOpacity
                key={keyIndex}
                style={[
                  styles.keyboardKey,
                  key === "space" && styles.spaceKey,
                  (key === "shift" ||
                    key === "delete" ||
                    key === "123" ||
                    key === "globe" ||
                    key === "return") &&
                    styles.specialKey,
                ]}
                onPress={() => {
                  if (key === "space") {
                    setReplyText((prev) => prev + " ");
                  } else if (key === "delete") {
                    setReplyText((prev) => prev.slice(0, -1));
                  } else if (key === "return") {
                    setReplyText((prev) => prev + "\n");
                  } else if (
                    key !== "shift" &&
                    key !== "123" &&
                    key !== "globe"
                  ) {
                    setReplyText((prev) => prev + key);
                  }
                }}
              >
                <Text
                  style={[
                    styles.keyboardKeyText,
                    (key === "shift" ||
                      key === "delete" ||
                      key === "123" ||
                      key === "globe" ||
                      key === "return") &&
                      styles.specialKeyText,
                  ]}
                >
                  {key === "delete"
                    ? "⌫"
                    : key === "return"
                      ? "↵"
                      : key === "shift"
                        ? "⇧"
                        : key === "globe"
                          ? "🌐"
                          : key}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
        <View style={styles.homeIndicator} />
      </View>
    );
  };

  const renderSortModal = () => (
    <Modal
      visible={showSortMenu}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowSortMenu(false)}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setShowSortMenu(false)}
      >
        <View style={styles.sortMenuDropdown}>
          {sortOptions.map((option) => (
            <TouchableOpacity
              key={option}
              style={styles.sortMenuItem}
              onPress={() => {
                setSortBy(option);
                setShowSortMenu(false);
              }}
            >
              <Text
                style={[
                  styles.sortMenuText,
                  sortBy === option && styles.sortMenuTextActive,
                ]}
              >
                {option}
              </Text>
              {sortBy === option && (
                <Ionicons name="checkmark" size={16} color={colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const renderUnpinModal = () => (
    <Modal
      visible={showUnpinMenu}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowUnpinMenu(false)}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setShowUnpinMenu(false)}
      >
        <View style={styles.unpinMenuDropdown}>
          <TouchableOpacity
            style={styles.sortMenuItem}
            onPress={() => {
              setShowUnpinMenu(false);
            }}
          >
            <Text style={styles.sortMenuText}>Unpin Post</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {renderHeader()}

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {renderMainPost()}
        {renderSortHeader()}
        {commentsData.map((comment) => renderComment(comment))}
      </ScrollView>

      {renderInput()}
      {renderKeyboard()}
      {renderSortModal()}
      {renderUnpinModal()}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerContainer: {
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 10 : 50,
    paddingBottom: 10,
    backgroundColor: colors.background,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.mainTextColor,
    marginLeft: 12,
    flex: 1,
  },
  headerSpacer: {
    flex: 1,
  },
  userHeaderSection: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backButton: {
    padding: 4,
  },
  headerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  headerUserInfo: {
    flex: 1,
  },
  headerUserName: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.mainTextColor,
  },
  headerTimeAgo: {
    fontSize: 12,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
    alignSelf: "flex-start",
  },
  pinnedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.bgGreen,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
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
  scrollView: {
    flex: 1,
  },
  mainPost: {
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.stroke,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    flex: 1,
    lineHeight: 22,
    marginRight: 16,
  },
  moreButton: {
    padding: 4,
  },
  threeDotsHorizontal: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.secondaryText,
    marginHorizontal: 1,
  },
  hashtagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  hashtagItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
  hashtag: {
    color: colors.HighlightText,
    fontSize: 12,
    fontFamily: fonts.PlusJakartaSans,
  },
  hashtagSeparator: {
    color: colors.HighlightText,
    fontSize: 12,
    fontFamily: fonts.PlusJakartaSans,
    marginHorizontal: 6,
  },
  content: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.mainTextColor,
    lineHeight: 20,
    marginBottom: 16,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  interactionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 16,
  },
  interactionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    padding: 4,
  },
  replyButton: {
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  interactionIcon: {
    width: 16,
    height: 16,
    tintColor: colors.secondaryText,
  },
  interactionText: {
    fontSize: 12,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
    marginLeft: 6,
  },
  sortContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  sortText: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.secondaryText,
    marginRight: 8,
  },
  commentContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.stroke,
    position: "relative",
  },
  threadedComment: {
    paddingLeft: 48,
    marginLeft: 8,
  },
  threadLine: {
    position: "absolute",
    left: 40,
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: colors.stroke,
  },
  commentAvatar: {
    width: 32,
    height: 30,
    borderRadius: 16,
    marginRight: 12,
  },
  threadedAvatar: {
    width: 24,
    height: 24,
    borderRadius: 5,
  },
  normalAvatarContainer: {
    marginRight: 0,
  },
  threadedAvatarContainer: {
    marginRight: 0,
    backgroundColor: colors.stroke,
    borderRadius: 8,
    padding: 2,
    marginRight: 2,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  commentUserName: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.mainTextColor,
    marginRight: 8,
  },
  commentTimeAgo: {
    fontSize: 12,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
  },
  commentText: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.mainTextColor,
    lineHeight: 20,
    marginBottom: 8,
  },
  commentImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  thumbsUpContainer: {
    marginBottom: 8,
  },
  thumbsUp: {
    fontSize: 20,
  },
  commentActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  commentActionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    padding: 2,
  },
  commentActionIcon: {
    width: 14,
    height: 14,
    tintColor: colors.secondaryText,
  },
  commentActionText: {
    fontSize: 12,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor:colors.background,
    borderWidth: 1,
    borderColor: colors.stroke,
    borderRadius: 20,
    marginHorizontal: 16,
    marginVertical: 6,
  },
  attachIcon: {
    marginRight: 10,
  },
  textInputField: {
    flex: 1,
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.mainTextColor,
    paddingVertical: 6,
    paddingHorizontal: 0,
    marginRight: 10,
    minHeight: 18,
    maxHeight: 40,
    textAlignVertical: 'top',
  },
  replyText: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
    flex: 1,
  },
  attachedIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
    alignSelf: "flex-start",
    marginTop: 12,
  },
  attachButton: {
    padding: 8,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: colors.stroke,
    borderRadius: 20,
    marginHorizontal: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 60,
    justifyContent: "flex-start",
  },
  textInput: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.mainTextColor,
    maxHeight: 50,
    marginBottom: 4,
  },
  bottomText: {
    fontSize: 12,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
    lineHeight: 16,
  },
  strikethrough: {
    textDecorationLine: "line-through",
  },
  readMoreText: {
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    textDecorationLine: "underline",
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  shareButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary,
  },
  shareIcon: {
    width: 16,
    height: 16,
    tintColor: colors.background
  },
  sendIcon: {
    width: 16,
    height: 16,
    tintColor:colors.background,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.mainTextColor,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  sortMenuDropdown: {
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingVertical: 4,
    minWidth: 140,
    shadowColor: colors.mainTextColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    position: "absolute",
    top: 200,
    left: 16,
  },
  unpinMenuDropdown: {
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingVertical: 8,
    minWidth: 120,
    shadowColor: colors.mainTextColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    position: "absolute",
    top: 120,
    right: 20,
  },
  sortMenuItem: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 40,
  },
  sortMenuText: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.mainTextColor,
    flex: 1,
  },
  sortMenuTextActive: {
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.primary,
  },
  
  
  homeIndicator: {
    width: 134,
    height: 5,
    backgroundColor: colors.mainTextColor,
    borderRadius: 3,
    alignSelf: "center",
    marginTop: 8,
    marginBottom: 8,
  },
});

export default Discussion;
