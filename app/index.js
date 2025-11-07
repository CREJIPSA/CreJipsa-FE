import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";

export default function Index() {

  const router = useRouter();
  const isLoggedIn = false; // Replace with actual authentication logic

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/landing");
    }
  }, [isLoggedIn, router]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}
