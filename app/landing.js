import {
  getKeyHashAndroid,
  initializeKakaoSDK,
} from '@react-native-kakao/core';
import { login as kakaoLogin } from '@react-native-kakao/user';
import { useRouter } from 'expo-router';
import { useContext, useEffect } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthContext } from './_layout';
import useThemedStyle from './hooks/use-themed-style';

export default function Landing() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { styles } = useThemedStyle(getStyles);

  const {
    setAccessToken,
    setRefreshToken,
    setUser,
    setKakaoEmail,
    setKakaoProfileImageUrl,
  } = useContext(AuthContext);

  useEffect(() => {
    initializeKakaoSDK('2d0e496c2a9ff2019280d0ff3d7ffb23');
  }, []);

  const onKakaoLogin = async () => {
    console.log('키 해시', await getKeyHashAndroid());
    try {
      // 카카오 로그인
      console.log('before kakao login');
      const loginResult = await kakaoLogin();
      console.log('kakao login result', loginResult);
      console.log('after kakao login');
      const kakaoAccessToken = loginResult?.accessToken;
      console.log('kakaoAccessToken exists?', !!kakaoAccessToken);
      if (!kakaoAccessToken) {
        throw new Error('No Kakao access token');
      }

      // 서버 인증 api 호출
      const res = await fetch('https://dev.crezipsa.site/api/auth/kakaoLogin', {
        method: 'GET',
        headers: {
          'Kakao-Authorization': `${kakaoAccessToken}`,
        },
      });

      // raw data
      const rawText = await res.text();
      console.log('auth status', res.status);
      console.log('auth raw response', rawText);

      let data = null;
      try {
        data = rawText ? JSON.parse(rawText) : null;
      } catch (e) {
        console.error('Failed to parse JSON response', e);
      }
      if (!res.ok) throw new Error('Auth API error');

      // result
      const result = data?.result;
      if (!result) {
        throw new Error('No result in Auth API response');
      }

      // 신규 유저는 바로 회원가입으로
      if (result.newUser) {
        setUser(result.kakaoUserInfo);
        setKakaoEmail(result.kakaoUserInfo?.email ?? null);
        setKakaoProfileImageUrl(result.kakaoUserInfo?.profileImage ?? null);
        router.replace('/(sign-up)');
        return;
      }

      // 기존 유저는 토큰 저장 후 홈으로 이동
      if (!result.accessToken || !result.refreshToken) {
        throw new Error('No tokens received from server');
      }
      setAccessToken(result.accessToken);
      setRefreshToken(result.refreshToken);
      setUser(result.kakaoUserInfo);
      setKakaoEmail(result.kakaoUserInfo?.email ?? null);
      setKakaoProfileImageUrl(result.kakaoUserInfo?.profileImage ?? null);
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Kakao login failed', error);
    }
  };

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
        <Pressable
          style={styles.kakaoLoginButton}
          onPress={() => onKakaoLogin()}
        >
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
