import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect, useRouter } from "expo-router";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { auth, db } from "../../firebaseConfig";
import {
  getUserProfile,
  logoutUser,
  deleteMyAccount,
} from "../../src/services/auth"; // 👈 Added deleteMyAccount import
import { uploadImage } from "../../src/services/storage";
import { theme } from "../../src/styles/theme";
import { Listing } from "../../src/types/listing";
import { UserProfile } from "../../src/types/user";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [myListings, setMyListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    const user = auth.currentUser;
    if (!user) return;
    if (!profile) setLoading(true);

    try {
      const userDoc = await getUserProfile(user.uid);
      setProfile(userDoc);

      const q = query(
        collection(db, "listings"),
        where("sellerId", "==", user.uid)
      );
      const snapshot = await getDocs(q);
      const items: Listing[] = [];
      snapshot.forEach((doc) =>
        items.push({ id: doc.id, ...doc.data() } as Listing)
      );
      setMyListings(items);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditAvatar = async () => {
    const user = auth.currentUser;
    if (!user) return;

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets[0].uri) {
      setUploading(true);
      try {
        const newAvatarUrl = await uploadImage(result.assets[0].uri, "avatars");
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, { avatarUrl: newAvatarUrl });

        if (profile) {
          setProfile({ ...profile, avatarUrl: newAvatarUrl });
        }
        Alert.alert("Success", "Profile picture updated!");
      } catch (error) {
        Alert.alert("Error", "Failed to update profile.");
      } finally {
        setUploading(false);
      }
    }
  };

  // 🧨 DELETE ACCOUNT LOGIC
  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account?",
      "This action is permanent. All your items, coins, and data will be wiped.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "DELETE",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              await deleteMyAccount();
              // The auth listener in _layout.tsx will detect the user is gone
              // and redirect to Login automatically.
            } catch (error: any) {
              Alert.alert("Error", error.message);
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleLogout = async () => {
    await logoutUser();
    router.replace("/");
  };

  if (loading && !profile)
    return (
      <View style={styles.center}>
        <ActivityIndicator color={theme.colors.primary} size="large" />
      </View>
    );

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={loadData}
          tintColor={theme.colors.primary}
        />
      }
    >
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: profile?.avatarUrl }} style={styles.avatar} />
            <TouchableOpacity
              style={styles.editBtn}
              onPress={handleEditAvatar}
              disabled={uploading}
            >
              {uploading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="camera" size={16} color="white" />
              )}
            </TouchableOpacity>
            <View style={styles.rankBadge}>
              <Text style={styles.rankText}>CPT</Text>
            </View>
          </View>

          <Text style={styles.name}>{profile?.displayName}</Text>
          <Text style={styles.bio}>{profile?.bio || "No bio yet."}</Text>

          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Ionicons
              name="log-out-outline"
              size={18}
              color={theme.colors.primary}
            />
            <Text style={styles.logoutText}>Disconnect</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Wallet Section */}
      <View style={styles.walletContainer}>
        <View style={styles.walletCard}>
          <View>
            <Text style={styles.walletLabel}>CREDIT BALANCE</Text>
            <View style={styles.balanceRow}>
              <Text style={styles.balance}>{profile?.walletBalance}</Text>
              <Text style={styles.currency}>OTC</Text>
            </View>
          </View>
          <View style={styles.walletIcon}>
            <Ionicons
              name="wallet-outline"
              size={32}
              color={theme.colors.secondary}
            />
          </View>
        </View>
      </View>

      {/* Inventory Section */}
      <View style={styles.inventorySection}>
        <Text style={styles.sectionTitle}>MY STASH ({myListings.length})</Text>
        <View style={styles.grid}>
          {myListings.length === 0 ? (
            <Text style={{ color: "#666", fontStyle: "italic" }}>
              No items listed.
            </Text>
          ) : (
            myListings.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.itemCard}
                onPress={() => router.push(`/listing/${item.id}`)}
                activeOpacity={0.8}
              >
                <Image
                  source={{ uri: item.images[0] }}
                  style={styles.itemImage}
                />
                {item.status !== "ACTIVE" && (
                  <View
                    style={[
                      styles.itemBadge,
                      item.status === "SOLD" ? styles.soldBadge : {},
                    ]}
                  >
                    <Text style={styles.itemBadgeText}>{item.status}</Text>
                  </View>
                )}
                <View style={styles.itemFooter}>
                  <Text numberOfLines={1} style={styles.itemTitle}>
                    {item.title}
                  </Text>
                  <Text style={styles.itemPrice}>{item.price} OTC</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </View>

      {/* 🧨 DANGER ZONE: Delete Account Button */}
      <View style={styles.dangerZone}>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={handleDeleteAccount}
        >
          <Ionicons name="trash-outline" size={18} color="#FF0033" />
          <Text style={styles.deleteText}>DELETE ACCOUNT</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 50 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  header: {
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: theme.colors.card,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.card,
  },
  headerContent: { alignItems: "center" },
  avatarContainer: { marginBottom: 16, position: "relative" },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: theme.colors.background,
    borderWidth: 3,
    borderColor: theme.colors.primary,
  },
  editBtn: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: theme.colors.secondary,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: theme.colors.card,
    zIndex: 10,
  },
  rankBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.card,
  },
  rankText: { color: "white", fontSize: 10, fontWeight: "900" },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 4,
    letterSpacing: 1,
  },
  bio: { color: theme.colors.textDim, fontSize: 14, marginBottom: 20 },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "rgba(255, 46, 99, 0.1)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  logoutText: {
    color: theme.colors.primary,
    marginLeft: 6,
    fontWeight: "600",
    fontSize: 12,
  },
  walletContainer: { padding: 24, marginTop: -20 },
  walletCard: {
    padding: 24,
    borderRadius: 24,
    backgroundColor: "#131324",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.secondary,
    ...theme.shadows.neon,
    shadowColor: theme.colors.secondary,
  },
  walletLabel: {
    color: theme.colors.textDim,
    fontSize: 12,
    marginBottom: 8,
    fontWeight: "700",
    letterSpacing: 1,
  },
  balanceRow: { flexDirection: "row", alignItems: "baseline" },
  balance: {
    color: "white",
    fontSize: 36,
    fontWeight: "900",
    marginRight: 8,
    letterSpacing: -1,
  },
  currency: { fontSize: 18, color: theme.colors.secondary, fontWeight: "bold" },
  walletIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(8, 217, 214, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.secondary,
  },
  inventorySection: { paddingHorizontal: 24 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: theme.colors.text,
    marginBottom: 16,
    letterSpacing: 1,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  itemCard: {
    width: CARD_WIDTH,
    marginBottom: 16,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  itemImage: { width: "100%", height: 140, backgroundColor: "#000" },
  itemBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: theme.colors.textDim,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  soldBadge: { backgroundColor: theme.colors.danger },
  itemBadgeText: { color: "white", fontSize: 8, fontWeight: "bold" },
  itemFooter: { padding: 12 },
  itemTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: theme.colors.secondary,
  },
  // DANGER ZONE STYLES
  dangerZone: {
    marginTop: 40,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#FF0033",
    borderRadius: 12,
    backgroundColor: "rgba(255, 0, 51, 0.05)",
  },
  deleteText: {
    color: "#FF0033",
    fontWeight: "bold",
    fontSize: 12,
    marginLeft: 8,
    letterSpacing: 1,
  },
});
