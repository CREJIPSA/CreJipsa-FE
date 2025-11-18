import { Redirect, useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, View, useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import kakaoLogo from '../assets/images/kakao_logo.png';
import { AuthContext } from './_layout';

export default function Login() {

  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = getStyles(isDark);
  const [userId, setUserId] = useState('');
  const [userPw, setUserPw] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { user, login } = useContext(AuthContext);
  const isLoggedIn = !!user;

  const handleLogin = async () => {
    const result = await login(userId, userPw);
    if (result && result.message) {
      setErrorMessage(result.message);
      return;
    }
  }

  if (isLoggedIn) { // 자동 로그인
    return <Redirect href="/(tabs)" />;
  }

  return (
    <View style={[ styles.loginContainer, { paddingTop: insets.top, paddingBottom: insets.bottom } ]}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>로그인</Text>
      </View>
      <View style={styles.formContainer}>
        <TextInput 
          style={styles.inputForm}
          placeholder="아이디"
          placeholderTextColor={isDark ? '#ffffff' : '#000000'}
          value={userId}
          onChangeText={setUserId}
        />
        <TextInput 
          style={styles.inputForm}
          placeholder="비밀번호" 
          placeholderTextColor={isDark ? '#ffffff' : '#000000'}
          secureTextEntry={true} 
          value={userPw}
          onChangeText={setUserPw}
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
          <Pressable
            onPress={() => router.navigate("sign-up")} 
          >
            <Text style={styles.authOptionsText}>회원가입</Text>
          </Pressable>
        </View>
      </View>
      {errorMessage ? <Text style={{ color: 'red' }}>{errorMessage}</Text> : null}
      <View style={styles.buttonContainer}>
        <Pressable 
          style={styles.backButton}
          onPress={() => router.back()}>
          <Text style={styles.buttonText}>뒤로가기</Text>
        </Pressable>
        <Pressable 
          style={styles.loginButton}
          onPress={handleLogin}  
        >
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

const getStyles = (isDark) => StyleSheet.create({
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: isDark ? '#202020' : '#d9d9d9',
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
    color: isDark ? '#FAFAFA' : '#000000',
  },
  formContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
  },
  inputForm: {
    width: 285,
    height: 50,
    color: isDark ? '#FAFAFA' : '#000000',
    borderColor: isDark ? '#FAFAFA' : '#000000',
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
    backgroundColor: isDark ? '#FAFAFA' : '#000000',
  },
  authOptionsText: { 
    color: isDark ? '#FAFAFA' : '#000000',
    fontSize: 14,
    fontWeight: 'lighter',
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
    backgroundColor: isDark ? '#d9d9d9' : '#E6E6E6',
  },
  loginButton: { 
    width: 172,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 3,
    borderRadius: 100,
    backgroundColor: isDark ? '#CCFF66' : '#E6E6E6',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'lighter',
  },
  socialLoginContainer: {
    flex: 4,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});