import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { subscribeToAuthChanges } from "../src/services/auth";
import { User } from "firebase/auth";

export default function RootLayout() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const segments = useSegments();

  // Handle user state changes
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((currentUser) => {
      setUser(currentUser);
      if (initializing) setInitializing(false);
    });

    return unsubscribe;
  }, []);

  // Protect the routes
  useEffect(() => {
    if (initializing) return;

    const inAuthGroup = segments[0] === "(tabs)";

    if (!user && inAuthGroup) {
      // 1. Not logged in? Go to Login.
      router.replace("/");
    } else if (user && segments[0] === undefined) {
      // 2. Logged in, but on the Login Screen ("/" corresponds to undefined segment)?
      // Go to Feed.
      router.replace("/(tabs)/feed");
    }
    // 3. If user is logged in and goes to "/post" or "/listing", DO NOTHING. Let them pass.
  }, [user, initializing, segments]);

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#FF5A5F" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(tabs)" />
      {/* Allow the Post screen to sit on top of the tabs */}
      <Stack.Screen
        name="post/index"
        options={{ presentation: "modal", headerShown: false }}
      />
    </Stack>
  );
}
