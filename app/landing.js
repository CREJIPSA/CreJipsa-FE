import { Ionicons } from '@expo/vector-icons';
import { Redirect, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


export default function Landing() {

  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = getStyles(isDark);
  const isLoggedIn = false; // 실제 인증 상태에 따라 변경

  // 로그인 상태 확인
  if (isLoggedIn) {
    return <Redirect href="/(tabs)" />;
  }
  
  return (
    <View style={[styles.landingContainer, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.logoContainer}>
        {/* 추후 로고 대체 */}
        <Ionicons name="checkmark-circle-outline" size={150} color={isDark ? '#CCFF66' : '#000000'} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.mainText}>크집사에 오신걸 환영합니다.</Text>
        <Text style={styles.subText}>크리에이터를 위한 어시스턴트 앱</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable 
          style={styles.loginButton}
          onPress={() => router.navigate("login")}
        >
          <Text style={styles.loginButtonText}>로그인</Text>
        </Pressable>
        <Pressable 
          style={styles.signUpButton}
          onPress={() => router.navigate("sign-up")}
        >
          <Text style={styles.signUpButtonText}>회원가입</Text>
        </Pressable>
      </View>
    </View>
  )
}

const getStyles = (isDark) => StyleSheet.create({
  landingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: isDark ? '#202020' : '#d9d9d9',
  },
  logoContainer: {
    flex: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 9,
  },
  mainText: {
    color: isDark ? '#FFFFFF' : '#000000',
    fontSize: 24,
    fontWeight: 'bold',
  },
  subText: {
    color: isDark ? '#CCCCCC' : '#333333',
    fontSize: 16,
    fontWeight: 'normal',
  },
  buttonContainer: {
    flex: 2,
    alignItems: 'center',
    paddingTop: 30,
  },
  loginButton: {
    width: 250,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: isDark ? '#CCFF66' : '#FFFFFF',
    borderRadius: 100,
    marginBottom: 8,
  }, 
  signUpButton: {
    width: 250,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: isDark ? '#E6E6E6' : '#FFFFFF',
    borderRadius: 100,
  }, 
  loginButtonText: {
    color: '#000000',
    fontSize: 16,   
    fontWeight: 'bold',
  },
  signUpButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  }
});