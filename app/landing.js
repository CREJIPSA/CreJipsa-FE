import {
  getKeyHashAndroid,
  initializeKakaoSDK,
} from '@react-native-kakao/core';
import { login as kakaoLogin, me } from '@react-native-kakao/user';
import { Redirect, useRouter } from 'expo-router';
import { useContext, useEffect } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthContext } from './_layout';
import useThemedStyle from './hooks/use-themed-style';

export default function Landing() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { styles } = useThemedStyle(getStyles);

  const { user } = useContext(AuthContext);
  const isLoggedIn = !!user;

  useEffect(() => {
    initializeKakaoSDK('2d0e496c2a9ff2019280d0ff3d7ffb23');
  }, []);

  const onKakaoLogin = async () => {
    console.log('키 해시', await getKeyHashAndroid());
    try {
      const loginResult = await kakaoLogin();
      console.log('Kakao login success', loginResult);
      const loginUser = await me();
      console.log('Kakao user info', loginUser);
      router.replace('/(sign-up)');
    } catch (error) {
      console.error('Kakao login failed', error);
    }
  };

  // 로그인 상태 확인
  if (isLoggedIn) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <View
      style={[
        styles.landingContainer,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <View style={styles.logoContainer}>
        <Image
          source={require('@/assets/images/kzipsa_logo.png')}
          style={{ width: 100, height: 100 }}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.mainText}>크집사에 오신걸 환영합니다.</Text>
        <Text style={styles.subText}>크리에이터를 위한 어시스턴트 앱</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable style={styles.kakaoLoginButton} onPress={onKakaoLogin}>
          <Image
            source={require('../assets/images/kakao_logo.png')}
            style={{ width: 15, height: 15 }}
          />
          <Text style={styles.kakaoLoginButtonText}>카카오 로그인</Text>
        </Pressable>
      </View>
    </View>
  );
}

const getStyles = isDark =>
  StyleSheet.create({
    landingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isDark ? '#202020' : '#FCFCFC',
    },
    logoContainer: {
      flex: 7,
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
      color: isDark ? '#FFFFFF' : '#141414',
      fontSize: 24,
      fontWeight: 'bold',
    },
    subText: {
      color: isDark ? '#CCCCCC' : '#141414',
      fontSize: 16,
      fontWeight: 'normal',
    },
    buttonContainer: {
      flex: 2,
      width: '80%',
      alignItems: 'center',
      paddingTop: 30,
    },
    kakaoLoginButton: {
      marginTop: 30,
      flexDirection: 'row',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#FFEB34',
      borderRadius: 8,
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    kakaoLoginButtonText: {
      color: '#000000',
      fontSize: 15,
      fontWeight: 'bold',
      marginLeft: 5,
    },
  });
