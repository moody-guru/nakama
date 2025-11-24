import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Listing } from "../types/listing";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");
const COLUMN_WIDTH = width / 2 - 15; // 2 columns with padding

interface Props {
  item: Listing;
}

export const ListingCard = ({ item }: Props) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      // Future: Go to detail page
      onPress={() => router.push(`/listing/${item.id}` as any)}
    >
      <Image source={{ uri: item.images[0] }} style={styles.image} />

      <View style={styles.content}>
        <Text numberOfLines={1} style={styles.title}>
          {item.title}
        </Text>
        <Text style={styles.price}>{item.price} OTC</Text>

        <View style={styles.seller}>
          <Image source={{ uri: item.sellerAvatar }} style={styles.avatar} />
          <Text numberOfLines={1} style={styles.sellerName}>
            {item.sellerName}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: COLUMN_WIDTH,
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 150,
    backgroundColor: "#f0f0f0",
  },
  content: {
    padding: 10,
  },
  title: {
    fontWeight: "600",
    fontSize: 14,
    marginBottom: 4,
  },
  price: {
    color: "#FF5A5F", // Otaku Red
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
  },
  seller: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 6,
    backgroundColor: "#eee",
  },
  sellerName: {
    fontSize: 12,
    color: "#666",
    flex: 1,
  },
});
