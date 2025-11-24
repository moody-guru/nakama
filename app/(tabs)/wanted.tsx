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
import { useSafeAreaInsets } from "react-native-safe-area-context"; // 👈 Notch Fix
import { getFeed } from "../../src/services/market";
import { Listing } from "../../src/types/listing";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../src/styles/theme";

export default function WantedScreen() {
  const insets = useSafeAreaInsets();
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
      const data = await getFeed("WANTED");
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
      <View style={styles.row}>
        <Image source={{ uri: item.images[0] }} style={styles.thumb} />
        <View style={styles.content}>
          <View style={styles.topRow}>
            <Text style={styles.bountyLabel}>BOUNTY</Text>
            <Text style={styles.price}>{item.price} OTC</Text>
          </View>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
          <View style={styles.userRow}>
            <Image source={{ uri: item.sellerAvatar }} style={styles.avatar} />
            <Text style={styles.username}>{item.sellerName}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>BOUNTY BOARD</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#FFA500" />
        </View>
      ) : (
        <FlatList
          data={listings}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                loadFeed();
              }}
              tintColor="#FFA500"
            />
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <Ionicons
                name="skull-outline"
                size={60}
                color={theme.colors.textDim}
              />
              <Text style={styles.emptyText}>No active bounties.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  list: { padding: 16 },

  header: { paddingHorizontal: 20, paddingBottom: 10 },
  headerTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: theme.colors.text,
    letterSpacing: 1,
  },

  card: {
    backgroundColor: theme.colors.card,
    marginBottom: 12,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#FFA500", // Orange for bounties
    shadowColor: "#FFA500",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  row: { flexDirection: "row" },
  thumb: { width: 80, height: 80, borderRadius: 12, backgroundColor: "#000" },
  content: { flex: 1, marginLeft: 12, justifyContent: "space-between" },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bountyLabel: {
    color: "#FFA500",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1,
    backgroundColor: "rgba(255, 165, 0, 0.1)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  price: { color: "#FFA500", fontSize: 16, fontWeight: "bold" },

  title: { color: theme.colors.text, fontSize: 16, fontWeight: "bold" },

  userRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  avatar: { width: 16, height: 16, borderRadius: 8, marginRight: 6 },
  username: { color: theme.colors.textDim, fontSize: 12 },

  emptyText: { color: theme.colors.textDim, marginTop: 10, fontSize: 16 },
});
