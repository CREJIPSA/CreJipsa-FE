import { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MyPage() {
  const [pushEnabled, setPushEnabled] = useState(true);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#121212" }}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>마이</Text>

        <View style={styles.profileSection}>
          <Image
            source={require("../../assets/images/profile.png")}
            style={styles.avatar}
          />
          <Text style={styles.name}>혜안</Text>
        </View>

        <View style={styles.menuRow}>
          <View style={styles.menuItem}>
            <View style={styles.squareBox} />
            <Text style={styles.menuText}>내 트렌드함</Text>
          </View>
          <View style={styles.menuItem}>
            <View style={styles.squareBox} />
            <Text style={styles.menuText}>내가 쓴 글</Text>
          </View>
          <View style={styles.menuItem}>
            <View style={styles.squareBox} />
            <Text style={styles.menuText}>내 좋아요함</Text>
          </View>
          <View style={styles.menuItem}>
            <View style={styles.squareBox} />
            <Text style={styles.menuText}>내 댓글함</Text>
          </View>
        </View>

        <View style={styles.editSection}>
          <Text style={styles.sectionTitle}>내 프로필</Text>
          <Text style={styles.sectionItem}>프로필 수정</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>환경 설정</Text>
          <View style={styles.switchRow}>
            <Text style={styles.sectionItem}>푸시 알림</Text>
            <Switch
              value={pushEnabled}
              onValueChange={setPushEnabled}
              trackColor={{ false: "#555", true: "#d6ff57" }}
              thumbColor={pushEnabled ? "#000" : "#fff"}
            />
          </View>
          <View style={styles.versionRow}>
            <Text style={styles.sectionItem}>버전 정보</Text>
            <Text style={styles.sectionItem}>1234567890</Text>
          </View>
          <Text style={styles.sectionItem}>회원 탈퇴하기</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#202020",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
    marginBottom: 20,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 50,
    gap: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#fff",
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
  },
  menuRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  menuItem: {
    alignItems: "center",
    width: "22%",
  },
  squareBox: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: "#f3f5e6",
    marginBottom: 8,
  },
  menuText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
  editSection: {
    marginBottom: 40,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: "white",
    fontWeight: "bold",
    marginBottom: 20,
  },
  sectionItem: {
    color: "white",
    marginBottom: 6,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  versionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
