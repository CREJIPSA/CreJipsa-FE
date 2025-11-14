import { router } from "expo-router";
import { Button, Text, View } from "react-native";

export default function Home() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>홈 화면</Text>
      <Button
        title="마이페이지로 이동"
        onPress={() => router.push("/mypage")}
      />
    </View>
  );
}
