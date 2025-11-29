import { Ionicons } from '@expo/vector-icons';
import { Redirect, useRouter } from 'expo-router';
import { useContext } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthContext } from './_layout';

export default function Landing() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = getStyles(isDark);

  const { user } = useContext(AuthContext);
  const isLoggedIn = !!user;

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
        {/* 추후 로고 대체 */}
        <Ionicons
          name="checkmark-circle-outline"
          size={150}
          color={isDark ? '#CCFF66' : '#000000'}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.mainText}>크집사에 오신걸 환영합니다.</Text>
        <Text style={styles.subText}>크리에이터를 위한 어시스턴트 앱</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable
          style={styles.kakaoLoginButton}
          // 추후 카카오 로그인 연동 필요
          onPress={() => router.push('/sign-up')}
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
