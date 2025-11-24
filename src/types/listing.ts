// src/types/listing.ts
import { Timestamp } from "firebase/firestore";

export type ListingType = "SELL" | "WANTED";
export type ListingStatus = "ACTIVE" | "SOLD" | "FULFILLED" | "ARCHIVED";

export interface Listing {
  id: string;
  type: ListingType; // Is this a Shop Item or a Bounty?
  title: string;
  description: string;
  price: number; // In OTC (Otaku Coin)
  images: string[]; // URLs from Firebase Storage
  sellerId: string; // User UID
  sellerName: string; // Display Name (cached for speed)
  sellerAvatar: string; // Avatar URL (cached for speed)
  status: ListingStatus;
  tags: string[]; // e.g. ['OnePiece', 'Figure']
  createdAt: Timestamp; // When was it posted?
}
