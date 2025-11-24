// src/services/auth.ts
import { auth, db } from "../../firebaseConfig";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  deleteUser,
  User,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { UserProfile } from "../types/user";

// 1. The Listener: Checks if user is logged in
export const subscribeToAuthChanges = (
  callback: (user: User | null) => void
) => {
  return onAuthStateChanged(auth, callback);
};

// 2. Sign Up (And create the Wallet!)
export const signUpUser = async (email: string, pass: string, name: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      pass
    );
    const user = userCredential.user;

    // Create the "Nakama" Profile in Firestore
    const newProfile: UserProfile = {
      uid: user.uid,
      displayName: name,
      bio: "New to the crew.",
      avatarUrl: "https://i.pravatar.cc/150?img=12",
      walletBalance: 100, // 💰 FREE MONEY!
      netWorth: 100,
      reputation: 0,
      wins: 0,
    };

    await setDoc(doc(db, "users", user.uid), newProfile);
    return user;
  } catch (error) {
    throw error;
  }
};

// 3. Login
export const signInUser = async (email: string, pass: string) => {
  return signInWithEmailAndPassword(auth, email, pass);
};

// 4. Logout
export const logoutUser = async () => {
  return signOut(auth);
};

// 5. Get Current Profile Data
export const getUserProfile = async (
  uid: string
): Promise<UserProfile | null> => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as UserProfile;
  } else {
    return null;
  }
};

// 6. 💣 Nuke The Account
export const deleteMyAccount = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("No user found");

  const uid = user.uid;

  // A. Delete their Listings (Clean up the market)
  const q = query(collection(db, "listings"), where("sellerId", "==", uid));
  const snapshot = await getDocs(q);
  const deletePromises = snapshot.docs.map((d) => deleteDoc(d.ref));
  await Promise.all(deletePromises);

  // B. Delete User Profile (Clean up the user list)
  await deleteDoc(doc(db, "users", uid));

  // C. Delete Auth Account (The actual login)
  // Note: If it's been a long time since login, Firebase might ask to re-login first.
  await deleteUser(user);

  return true;
};
