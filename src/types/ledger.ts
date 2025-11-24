import { Timestamp } from "firebase/firestore";

export interface LedgerEntry {
  id?: string;
  fromUser: string; // Buyer UID
  toUser: string; // Seller UID
  amount: number; // Price
  type: "TRADE" | "BOOST" | "REWARD";
  listingId: string;
  timestamp: Timestamp;
}
