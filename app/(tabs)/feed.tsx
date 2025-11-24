import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { getFeed } from "../../src/services/market";
import { Listing } from "../../src/types/listing";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../src/styles/theme"; // Import our new theme

export default function FeedScreen() {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadFeed();
    }, [])
  );

  const loadFeed = async () => {
    try {
      const data = await getFeed("SELL");
      setListings(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const renderItem = ({ item }: { item: Listing }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/listing/${item.id}`)}
      activeOpacity={0.9}
    >
      {/* Image Section with Overlay */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.images[0] }}
          style={styles.image}
          contentFit="cover"
        />
        <View style={styles.imageOverlay} />

        {/* Price Tag */}
        <View style={styles.priceTag}>
          <Text style={styles.priceText}>{item.price}</Text>
          <Text style={styles.currencyText}>OTC</Text>
        </View>

        {/* Status Badge */}
        {item.status !== "ACTIVE" && (
          <View
            style={[
              styles.badge,
              item.status === "SOLD" ? styles.soldBadge : styles.inactiveBadge,
            ]}
          >
            <Text style={styles.badgeText}>{item.status}</Text>
          </View>
        )}
      </View>

      {/* Content Section */}
      <View style={styles.cardContent}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>

        <View style={styles.sellerRow}>
          <Image source={{ uri: item.sellerAvatar }} style={styles.avatar} />
          <Text style={styles.sellerName}>{item.sellerName}</Text>
          <View style={styles.spacer} />
          <Ionicons
            name="time-outline"
            size={14}
            color={theme.colors.textDim}
          />
          {/* You could add a real relative time here later */}
          <Text style={styles.timeText}>Recently</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );

  return (
    <View style={styles.container}>
      <FlatList
        data={listings}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadFeed();
            }}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.center}>
            <Ionicons
              name="planet-outline"
              size={80}
              color={theme.colors.textDim}
              style={styles.emptyIcon}
            />
            <Text style={styles.emptyText}>No loot detected.</Text>
            <Text style={styles.emptySubText}>
              Be the first to drop an item!
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background, // Dark background
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },

  // ANIME CARD STYLES
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    marginBottom: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.card,
  },
  imageContainer: {
    height: 200,
    width: "100%",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor:
      "linear-gradient(180deg, transparent 50%, rgba(15, 15, 26, 0.8) 100%)", // Gradient fade
  },
  priceTag: {
    position: "absolute",
    bottom: 12,
    left: 12,
    flexDirection: "row",
    alignItems: "baseline",
  },
  priceText: {
    fontSize: 24,
    fontWeight: "800",
    color: theme.colors.secondary, // Neon Cyan
    textShadowColor: theme.colors.secondary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8, // Neon glow effect
  },
  currencyText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.textDim,
    marginLeft: 4,
  },
  badge: {
    position: "absolute",
    top: 12,
    right: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: theme.borderRadius.xl,
  },
  soldBadge: { backgroundColor: theme.colors.danger },
  inactiveBadge: { backgroundColor: theme.colors.textDim },
  badgeText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 10,
    textTransform: "uppercase",
  },

  cardContent: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  sellerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: theme.borderRadius.xl,
    marginRight: 8,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  sellerName: {
    fontSize: 14,
    color: theme.colors.textDim,
    fontWeight: "600",
  },
  spacer: { flex: 1 },
  timeText: {
    fontSize: 12,
    color: theme.colors.textDim,
    marginLeft: 4,
  },

  // Empty State
  emptyIcon: { marginBottom: 16, opacity: 0.8 },
  emptyText: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
    marginTop: 10,
  },
  emptySubText: {
    fontSize: 14,
    color: theme.colors.textDim,
    marginTop: 8,
  },
});
