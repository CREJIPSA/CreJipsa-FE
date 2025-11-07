import { useRouter } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import kakaoLogo from '../assets/images/kakao_logo.png';

export default function Login() {

  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[ styles.loginContainer, { paddingTop: insets.top, paddingBottom: insets.bottom } ]}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>로그인</Text>
      </View>
      <View style={styles.formContainer}>
        <TextInput 
          style={styles.idInputForm}
          placeholder="아이디"
        />
        <TextInput 
          style={styles.passwordInputForm}
          placeholder="비밀번호" 
          secureTextEntry={true} 
        />
        <View style={styles.authOptionsContainer}>
          <Pressable>
            <Text style={styles.authOptionsText}>아이디 찾기</Text>
          </Pressable>
          <View style={styles.authOptionsDivider} />
          <Pressable>
            <Text style={styles.authOptionsText}>비밀번호 찾기</Text>
          </Pressable>
          <View style={styles.authOptionsDivider} />
          <Pressable>
            <Text style={styles.authOptionsText}>회원가입</Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable 
          style={styles.backButton}
          onPress={() => router.back()}>
          <Text style={styles.buttonText}>뒤로가기</Text>
        </Pressable>
        <Pressable style={styles.loginButton}>
          <Text style={styles.buttonText}>로그인</Text>
        </Pressable>
      </View>
      <View style={styles.socialLoginContainer}>
        <Pressable>
          <Image source={kakaoLogo} style={{ width: 60, height: 60 }} />
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1.5,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 25,
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  formContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
  },
  idInputForm: {
    width: 285,
    height: 50,
    borderColor: '#000000',
    borderBottomWidth: 0.5,
    marginBottom: 20,
    paddingLeft: 20,
  },
  passwordInputForm: {
    width: 285,
    height: 50,
    borderColor: '#000000',
    borderBottomWidth: 0.5,
    marginBottom: 20,
    paddingLeft: 20,
  },
  authOptionsContainer: {
    width: 270,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  authOptionsDivider: {
    width: 1,
    height: '70%',
    backgroundColor: '#000000',
  },
  authOptionsText: {
    fontSize: 14,
    fontWeight: 200,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  backButton: {
    width: 105,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 3,
    borderRadius: 100,
    backgroundColor: '#d9d9d9',
  },
  loginButton: { 
    width: 172,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 3,
    borderRadius: 100,
    backgroundColor: '#d9d9d9',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 200,
  },
  socialLoginContainer: {
    flex: 4,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});