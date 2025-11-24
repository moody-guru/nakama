//Now we need a place to put the "BUY NOW" button. This screen will show the big image, the description, and handle the purchase.
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../../firebaseConfig";
import { buyItem } from "../../src/services/trade";
import { Listing } from "../../src/types/listing";

export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [item, setItem] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    if (!id) return;
    try {
      const docRef = doc(db, "listings", id as string);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setItem({ id: snap.id, ...snap.data() } as Listing);
      } else {
        console.error("Item not found");
      }
    } catch (e) {
      console.error("Error fetching item:", e);
    } finally {
      setLoading(false);
    }
  };

  const executePurchase = async () => {
    setBuying(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Login required");

      if (!item) return;

      await buyItem(item.id, user.uid);

      // Success Message
      if (Platform.OS === "web") {
        window.alert("🎉 SOLD! You are now the owner!");
      } else {
        Alert.alert("🎉 SOLD!", "You are now the owner!");
      }
      router.replace("/(tabs)/feed");
    } catch (error: any) {
      console.error("Purchase Error:", error);
      const msg = error.message || "Transaction failed";
      if (Platform.OS === "web") window.alert(msg);
      else Alert.alert("Purchase Failed", msg);
    } finally {
      setBuying(false);
    }
  };

  const handleBuyPress = () => {
    if (!item) return;
    console.log("Buy button pressed for:", item.title);

    // 🌍 WEB LOGIC: Use standard browser confirm
    if (Platform.OS === "web") {
      const confirmed = window.confirm(
        `Buy "${item.title}" for ${item.price} Coins?`
      );
      if (confirmed) {
        executePurchase();
      }
    }
    // 📱 MOBILE LOGIC: Use Native Alert
    else {
      Alert.alert(
        "Confirm Purchase",
        `Buy "${item.title}" for ${item.price} Coins?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "BUY NOW",
            style: "destructive",
            onPress: executePurchase,
          },
        ]
      );
    }
  };

  if (loading)
    return <ActivityIndicator style={{ marginTop: 50 }} color="#FF5A5F" />;
  if (!item)
    return (
      <Text style={{ marginTop: 50, textAlign: "center" }}>
        Item not found.
      </Text>
    );

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView style={styles.container}>
        <View>
          <Image source={{ uri: item.images[0] }} style={styles.image} />
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {item.status === "SOLD" && (
            <View style={styles.soldBadge}>
              <Text style={styles.soldText}>SOLD OUT</Text>
            </View>
          )}

          <View style={styles.row}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.price}>{item.price} OTC</Text>
          </View>

          <View style={styles.sellerRow}>
            <Image source={{ uri: item.sellerAvatar }} style={styles.avatar} />
            <Text style={styles.sellerName}>Sold by {item.sellerName}</Text>
          </View>

          <Text style={styles.descTitle}>Description</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.buyBtn,
            (item.status !== "ACTIVE" || buying) && styles.disabledBtn,
          ]}
          onPress={handleBuyPress}
          disabled={item.status !== "ACTIVE" || buying}
        >
          {buying ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buyText}>
              {item.status === "ACTIVE" ? "BUY NOW" : "ITEM SOLD"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  image: { width: "100%", height: 350, backgroundColor: "#eee" },
  backBtn: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: "white",
    padding: 8,
    borderRadius: 20,
    zIndex: 10, // Ensure it sits on top
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  content: { padding: 20 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: { fontSize: 24, fontWeight: "bold", flex: 1 },
  price: { fontSize: 24, fontWeight: "bold", color: "#FF5A5F" },
  sellerRow: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
    backgroundColor: "#eee",
  },
  sellerName: { color: "#666" },
  descTitle: { fontSize: 16, fontWeight: "600", marginBottom: 5 },
  description: { fontSize: 16, color: "#444", lineHeight: 24 },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "white",
    paddingBottom: 40,
  },
  buyBtn: {
    backgroundColor: "#FF5A5F",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
  },
  disabledBtn: { backgroundColor: "#ccc" },
  buyText: { color: "white", fontWeight: "bold", fontSize: 18 },
  soldBadge: {
    backgroundColor: "#333",
    padding: 6,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  soldText: { color: "white", fontWeight: "bold", fontSize: 12 },
});
