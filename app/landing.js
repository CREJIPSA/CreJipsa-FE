import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Landing() {

  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.landingContainer, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.logoContainer}>
        <Text>logo&graphic</Text>
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
        <Pressable style={styles.signUpButton}>
          <Text style={styles.signUpButtonText}>회원가입</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  landingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#d9d9d9',
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
  },
  mainText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subText: {
    fontSize: 16,
    fontWeight: 'medium',
  },
  buttonContainer: {
    flex: 2,
    alignItems: 'center',
    paddingTop: 15,
  },
  loginButton: {
    width: 250,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 100,
    marginBottom: 8,
  }, 
  signUpButton: {
    width: 250,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
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