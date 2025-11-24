# 🏴‍☠️ Nakama: The Otaku Marketplace

![Expo](https://img.shields.io/badge/Expo-4630EB?style=for-the-badge&logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

**Nakama** is a gamified marketplace mobile application designed for anime collectors. Built with the "Speedrun Stack" (Expo + Firebase), it allows users to trade items, post bounties, and manage a virtual economy using "Otaku Coin" (OTC).

---

## 🚀 Key Features

* **⚛️ Modern Tech Stack:** Built with React Native, Expo Router v3, and FlashList for high performance.
* **🔐 Authentication:** Secure Email/Password login with persistent sessions via Firebase Auth.
* **🌑 Cyberpunk UI:** A custom dark theme with neon accents, fully responsive to all device sizes.
* **💰 Atomic Economy:** Users buy/sell items using `runTransaction` to ensure money and items move safely (ACID compliance).
* **☁️ Cloud Storage:** Image uploading and hosting via Firebase Storage.
* **🎯 Wanted Board:** A dedicated section for users to post bounties for rare items.
* **🛡️ Security:** Logic prevents users from buying their own items or spending money they don't have.

---

## 🛠️ Tech Stack

* **Frontend:** React Native, Expo SDK 52
* **Routing:** Expo Router (File-based routing)
* **Backend:** Firebase (Firestore Database, Authentication, Storage)
* **State/Logic:** React Hooks, Context API
* **Styling:** Custom Theme System (StyleSheet)
* **Build:** EAS (Expo Application Services)

---

## 🏗️ Installation & Setup

To run this project locally, follow these steps:

### 1. Clone the repository
```bash
git clone [https://github.com/YOUR_USERNAME/nakama-market.git](https://github.com/YOUR_USERNAME/nakama-market.git)
cd nakama
