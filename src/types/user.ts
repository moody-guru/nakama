// src/types/user.ts
export interface UserProfile {
  uid: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  walletBalance: number; // The liquid OTC
  netWorth: number;
  reputation: number;
  wins: number;
}
