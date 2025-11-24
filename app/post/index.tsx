import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../../firebaseConfig";
import { uploadImage } from "../../src/services/storage";
import { createListing } from "../../src/services/market";
import { getUserProfile } from "../../src/services/auth";
import { ListingType } from "../../src/types/listing";
import { theme } from "../../src/styles/theme"; // Import theme

export default function CreatePostScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [type, setType] = useState<ListingType>("SELL");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handlePost = async () => {
    if (!title || !price || !imageUri) {
      Alert.alert("Missing Fields", "Please add an image, title, and price.");
      return;
    }

    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Login required");

      const userProfile = await getUserProfile(user.uid);
      const safeProfile = userProfile || {
        displayName: "Unknown",
        avatarUrl: "https://i.pravatar.cc/150",
      };

      const downloadUrl = await uploadImage(imageUri, "listings");

      await createListing({
        type,
        title,
        description: description || "",
        price: parseInt(price),
        images: [downloadUrl],
        sellerId: user.uid,
        sellerName: safeProfile.displayName,
        sellerAvatar: safeProfile.avatarUrl,
        status: "ACTIVE",
        tags: [],
      });

      Alert.alert("Success", "Item Posted!");
      router.replace("/(tabs)/feed");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.replace("/(tabs)/feed")}>
            <Ionicons name="close" size={28} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>NEW LISTING</Text>
          <View style={{ width: 28 }} />
        </View>

        <View style={styles.typeContainer}>
          <TouchableOpacity
            style={[styles.typeButton, type === "SELL" && styles.activeType]}
            onPress={() => setType("SELL")}
          >
            <Text
              style={[
                styles.typeText,
                type === "SELL" && styles.activeTypeText,
              ]}
            >
              SELL
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeButton, type === "WANTED" && styles.activeType]}
            onPress={() => setType("WANTED")}
          >
            <Text
              style={[
                styles.typeText,
                type === "WANTED" && styles.activeTypeText,
              ]}
            >
              WANTED
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="camera" size={40} color={theme.colors.textDim} />
              <Text style={styles.imageText}>UPLOAD IMAGE</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.form}>
          <Text style={styles.label}>TITLE</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Rare Gundam"
            placeholderTextColor={theme.colors.textDim}
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>PRICE (OTC)</Text>
          <TextInput
            style={styles.input}
            placeholder="0"
            placeholderTextColor={theme.colors.textDim}
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />

          <Text style={styles.label}>DESCRIPTION</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Details..."
            placeholderTextColor={theme.colors.textDim}
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
          />
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handlePost}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#0F0F1A" />
          ) : (
            <Text style={styles.submitButtonText}>POST LISTING</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: 20,
  },
  scrollContent: { paddingBottom: 40 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: theme.colors.text,
    letterSpacing: 1,
  },

  typeContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  activeType: { backgroundColor: theme.colors.primary },
  typeText: { fontWeight: "bold", color: theme.colors.textDim },
  activeTypeText: { color: "#0F0F1A" },

  imagePicker: {
    width: 160,
    height: 160,
    alignSelf: "center",
    marginBottom: 24,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderStyle: "dashed",
  },
  imagePreview: { width: "100%", height: "100%" },
  imagePlaceholder: { flex: 1, justifyContent: "center", alignItems: "center" },
  imageText: {
    color: theme.colors.textDim,
    marginTop: 8,
    fontSize: 10,
    fontWeight: "bold",
  },

  form: { paddingHorizontal: 20 },
  label: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 8,
    color: theme.colors.textDim,
    letterSpacing: 1,
  },
  input: {
    backgroundColor: "#0F0F1A",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    fontSize: 16,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  textArea: { height: 100, textAlignVertical: "top" },

  submitButton: {
    backgroundColor: theme.colors.primary,
    marginHorizontal: 20,
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 50,
  },
  submitButtonText: {
    color: "#0F0F1A",
    fontWeight: "900",
    fontSize: 16,
    letterSpacing: 1,
  },
});
