import {
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";

export default function MyPage() {
  return (
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

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>내 프로필</Text>
        <Text style={styles.sectionItem}>프로필 수정</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>환경 설정</Text>
        <View style={styles.switchRow}>
          <Text style={styles.sectionItem}>푸시 알림</Text>
          <Switch value={true} trackColor={{ true: "#d6ff57" }} />
        </View>
        <Text style={styles.sectionItem}>버전 정보</Text>
        <Text style={styles.sectionItem}>회원 탈퇴하기</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    color: "white",
    marginBottom: 20,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#fff",
  },
  name: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "600",
    color: "white",
  },
  menuRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
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
    fontSize: 12,
    color: "white",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: "white",
    fontWeight: "bold",
    marginBottom: 8,
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
});
