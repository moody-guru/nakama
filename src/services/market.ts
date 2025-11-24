// src/services/market.ts
//We need a way to take a photo from your phone and push it to the cloud. 
import { db } from "../../firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import { Listing, ListingType } from "../types/listing";

// 1. Create a new Listing
export const createListing = async (
  listingData: Omit<Listing, "id" | "createdAt">
) => {
  try {
    const docRef = await addDoc(collection(db, "listings"), {
      ...listingData,
      createdAt: Timestamp.now(),
      status: "ACTIVE",
    });
    console.log("Listing created with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding listing: ", error);
    throw error;
  }
};

// 2. Fetch Feed (Get all Active items)
export const getFeed = async (type: ListingType) => {
  try {
    console.log(`🔍 Fetching Feed for type: ${type}...`); // Log 1

    const q = query(
      collection(db, "listings"),
      where("status", "==", "ACTIVE"),
      where("type", "==", type),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    console.log(`📬 Found ${querySnapshot.size} items.`); // Log 2

    const listings: Listing[] = [];
    querySnapshot.forEach((doc) => {
      listings.push({ id: doc.id, ...doc.data() } as Listing);
    });

    return listings;
  } catch (error) {
    console.error("❌ Error fetching feed: ", error);
    return [];
  }
};  