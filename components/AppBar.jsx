import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import colors from "../constants/color";
import fonts from "../constants/fonts";

const AppBar = ({ title, buttonVisibility = true }) => {
  const navigation = useNavigation();

 return (
    <View style={styles.container}>
      <View style={styles.inner}>
        {buttonVisibility && (
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Image
              source={require('../assets/back-icon.png')}
              style={styles.backIcon}
            />
          </TouchableOpacity>
        )}
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 25 : 60,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: colors.background,
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    backgroundColor: `${colors.stroke}4D`,
    borderRadius: 20,
    padding: 10,
    marginRight: 16,
  },
  backIcon: {
    width: 18,
    height: 18,
    tintColor: colors.mainTextColor,
    resizeMode: "contain",
  },
  title: {
    fontSize: 22,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
  },
});

export default AppBar;
