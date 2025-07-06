import React from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import colors from "../constants/color";
import fonts from "../constants/fonts";

const ImageUpload = ({ selectedImage, onRemoveImage }) => {
  if (!selectedImage) return null;

  return (
    <View style={styles.imageContainer}>
      <Image source={selectedImage} style={styles.uploadedImage} />
      <TouchableOpacity
        style={styles.removeImageButton}
        onPress={onRemoveImage}
      >
        <Text style={styles.removeImageText}>×</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    marginTop: 20,
    position: "relative",
  },
  uploadedImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    resizeMode: "cover",
  },
  removeImageButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.mainTextColor,
    justifyContent: "center",
    alignItems: "center",
  },
  removeImageText: {
    color: colors.background,
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSansBold,
  },
});

export default ImageUpload;
