import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { View } from "react-native";

export default function TabLayout() {
  const router = useRouter();

  return (
    // <Tabs
    //   screenOptions={{
    //     tabBarActiveTintColor: "#FF5A5F",
    //     tabBarInactiveTintColor: "gray",
    //     headerShown: true,
    //     tabBarStyle: {
    //       height: 60,
    //       paddingBottom: 5,
    //     },
    //   }}
    // >

    <Tabs
      screenOptions={{
        // 1. Update Colors
        tabBarActiveTintColor: "#FF2E63", // Neon Primary
        tabBarInactiveTintColor: "#8D8D9E", // Dim Text
        // 2. Dark Background & Border
        tabBarStyle: {
          backgroundColor: "#1A1A2E", // Dark Card Color
          borderTopColor: "#2A2A3C", // Subtle Border
          height: 60,
          paddingBottom: 5,
          elevation: 0, // Remove default shadow for cleaner look
          shadowOpacity: 0,
        },
        headerShown: false, // Hide default headers for a cleaner look
      }}
    >
      <Tabs.Screen
        name="feed"
        options={{
          title: "Market",
          tabBarIcon: ({ color }) => (
            <Ionicons name="cart" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="create_placeholder"
        options={{
          title: "",
          tabBarIcon: () => (
            <View
              style={{
                backgroundColor: "#FF5A5F",
                width: 50,
                height: 50,
                borderRadius: 25,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 20,
                shadowColor: "#FF5A5F",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 5,
              }}
            >
              <Ionicons name="add" size={32} color="white" />
            </View>
          ),
        }}
        listeners={() => ({
          tabPress: (e) => {
            // 1. Stop the default jump
            e.preventDefault();

            // 2. Add a tiny delay for Web Browsers to process the click
            setTimeout(() => {
              router.push("/post");
            }, 10);
          },
        })}
      />

      <Tabs.Screen
        name="wanted"
        options={{
          title: "Wanted",
          tabBarIcon: ({ color }) => (
            <Ionicons name="skull" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "My Base",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
