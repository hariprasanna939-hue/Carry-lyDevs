import React, { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { colors } from "../../theme/colors";

interface Props {
  title: string;
  subtitle?: string;
  imageUri?: string;
  onImageSelected: (uri: string) => void;
  required?: boolean;
  isExpired?: boolean;
  statusBadge?: string;
  rejectionReason?: string;
}

export default function DocumentUploader({
  title,
  subtitle,
  imageUri,
  onImageSelected,
  required = true,
  isExpired = false,
  statusBadge,
  rejectionReason,
}: Props) {
  const [modalVisible, setModalVisible] = useState(false);

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Camera Permission Needed",
        "Please grant camera access to take clear photos of your documents."
      );
      return false;
    }
    return true;
  };

  const requestGalleryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Gallery Permission Needed",
        "Please grant photo library access to upload documents."
      );
      return false;
    }
    return true;
  };

  const handleTakePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7, // Compress for bandwidth efficiency
      });

      if (!result.canceled && result.assets && result.assets[0].uri) {
        onImageSelected(result.assets[0].uri);
      }
    } catch (e: any) {
      Alert.alert("Camera Error", e?.message || "Failed to capture image.");
    }
  };

  const handlePickGallery = async () => {
    const hasPermission = await requestGalleryPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7, // Compress for bandwidth efficiency
      });

      if (!result.canceled && result.assets && result.assets[0].uri) {
        onImageSelected(result.assets[0].uri);
      }
    } catch (e: any) {
      Alert.alert("Gallery Error", e?.message || "Failed to select image.");
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>
            {title} {required && <Text style={styles.requiredMark}>*</Text>}
          </Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>

        {statusBadge ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{statusBadge}</Text>
          </View>
        ) : null}
      </View>

      {/* Warnings & Remarks */}
      {isExpired ? (
        <View style={styles.warningBanner}>
          <Text style={styles.warningText}>⚠️ Document appears to be EXPIRED.</Text>
        </View>
      ) : null}

      {rejectionReason ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>❌ Admin Remark: {rejectionReason}</Text>
        </View>
      ) : null}

      {/* Upload Box / Image Preview */}
      {imageUri ? (
        <View style={styles.previewContainer}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setModalVisible(true)}
            style={styles.thumbnailWrapper}
          >
            <Image source={{ uri: imageUri }} style={styles.thumbnail} resizeMode="cover" />
            <View style={styles.viewOverlay}>
              <Text style={styles.viewText}>🔍 Tap to preview</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.replaceBtn} onPress={handleTakePhoto}>
              <Text style={styles.replaceBtnText}>📷 Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.replaceBtn} onPress={handlePickGallery}>
              <Text style={styles.replaceBtnText}>🖼️ Choose Another</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.uploadButtonsRow}>
          <TouchableOpacity style={styles.uploadBtn} onPress={handleTakePhoto}>
            <Text style={styles.uploadBtnIcon}>📸</Text>
            <Text style={styles.uploadBtnText}>Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.uploadBtn, styles.galleryBtn]} onPress={handlePickGallery}>
            <Text style={styles.uploadBtnIcon}>📁</Text>
            <Text style={styles.uploadBtnText}>Upload from Gallery</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Fullscreen Preview Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{title}</Text>
            {imageUri && (
              <Image source={{ uri: imageUri }} style={styles.modalImage} resizeMode="contain" />
            )}
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>Close Preview</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.deepNavy,
  },
  requiredMark: {
    color: "#E53E3E",
    fontWeight: "800",
  },
  subtitle: {
    fontSize: 13,
    color: colors.secondaryText,
    marginTop: 2,
    lineHeight: 18,
  },
  badge: {
    backgroundColor: "#F0EDFF",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.primary,
  },
  warningBanner: {
    backgroundColor: "#FEF3C7",
    padding: 8,
    borderRadius: 8,
    marginBottom: 10,
  },
  warningText: {
    fontSize: 12,
    color: "#92400E",
    fontWeight: "600",
  },
  errorBanner: {
    backgroundColor: "#FEE2E2",
    padding: 8,
    borderRadius: 8,
    marginBottom: 10,
  },
  errorText: {
    fontSize: 12,
    color: "#991B1B",
    fontWeight: "600",
  },
  uploadButtonsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 6,
  },
  uploadBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1F5F9",
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#CBD5E1",
    paddingVertical: 14,
    borderRadius: 10,
    gap: 6,
  },
  galleryBtn: {
    backgroundColor: "#F8FAFC",
  },
  uploadBtnIcon: {
    fontSize: 18,
  },
  uploadBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.deepNavy,
  },
  previewContainer: {
    marginTop: 6,
  },
  thumbnailWrapper: {
    height: 140,
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#0F172A",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
  viewOverlay: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.65)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  viewText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600",
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  replaceBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 6,
    backgroundColor: "#F1F5F9",
  },
  replaceBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.deepNavy,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.deepNavy,
    marginBottom: 12,
    textAlign: "center",
  },
  modalImage: {
    width: "100%",
    height: 300,
    borderRadius: 10,
  },
  modalCloseBtn: {
    marginTop: 16,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  modalCloseText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});
