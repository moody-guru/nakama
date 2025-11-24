import {
  collection,
  doc,
  increment,
  runTransaction,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";

export const buyItem = async (listingId: string, buyerId: string) => {
  try {
    console.log("💰 Starting Transaction for:", listingId);

    await runTransaction(db, async (transaction) => {
      // 1. REFERENCES
      const listingRef = doc(db, "listings", listingId);
      const buyerRef = doc(db, "users", buyerId);
      const ledgerRef = doc(collection(db, "ledger"));

      // 2. READS (Must come before writes!)
      const listingSnap = await transaction.get(listingRef);
      const buyerSnap = await transaction.get(buyerRef);

      if (!listingSnap.exists()) throw new Error("Item does not exist!");
      if (!buyerSnap.exists()) throw new Error("Buyer does not exist!");

      const listing = listingSnap.data();
      const buyer = buyerSnap.data();

      // 3. CHECKS (The Bouncers)
      if (listing.status !== "ACTIVE") {
        throw new Error("Sorry! This item is already SOLD.");
      }
      if (listing.sellerId === buyerId) {
        throw new Error("You cannot buy your own item!");
      }
      if (buyer.walletBalance < listing.price) {
        throw new Error(`Not enough coins! You need ${listing.price} OTC.`);
      }

      const sellerRef = doc(db, "users", listing.sellerId);

      // 4. WRITES (The Magic)

      // A. Deduct from Buyer
      transaction.update(buyerRef, {
        walletBalance: increment(-listing.price),
        netWorth: increment(listing.price), // Item value adds to net worth
      });

      // B. Add to Seller
      transaction.update(sellerRef, {
        walletBalance: increment(listing.price),
      });

      // C. Update Listing
      transaction.update(listingRef, {
        status: "SOLD",
        buyerId: buyerId,
      });

      // D. Create Receipt
      transaction.set(ledgerRef, {
        fromUser: buyerId,
        toUser: listing.sellerId,
        amount: listing.price,
        type: "TRADE",
        listingId: listingId,
        timestamp: Timestamp.now(),
      });
    });

    console.log("✅ Transaction Complete!");
    return { success: true };
  } catch (error: any) {
    console.error("❌ Transaction Failed:", error);
    throw error;
  }
};
