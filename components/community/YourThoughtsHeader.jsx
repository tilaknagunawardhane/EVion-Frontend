import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  Image,
  ActivityIndicator,
} from "react-native";
import colors from "../../constants/color";
import fonts from "../../constants/fonts";

const YourThoughtsHeader = ({ title, onBack, onAttach, onPost, isSubmitting }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Image
          source={require("../../assets/back.png")}
          style={styles.backIcon}
        />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={styles.headerRight}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={onAttach}
          disabled={isSubmitting}
        >
          <Image
            source={require("../../assets/Attached.png")}
            style={[styles.actionIcon, { tintColor: colors.mainTextColor }]}
          />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.postButton} 
          onPress={onPost}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color={colors.background} />
          ) : (
            
            <Text style={styles.postButtonText}>Post</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 20 : 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.stroke,
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    width: 20,
    height: 20,
    tintColor: colors.mainTextColor,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    flex: 1,
    textAlign: "center",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    padding: 8,
    marginRight: 12,
  },
  actionIcon: {
    width: 20,
    height: 20,
  },
  postButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postButtonText: {
    color: colors.background,
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
  },
});

export default YourThoughtsHeader;