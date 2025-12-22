import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { StatusBar } from 'expo-status-bar';
import { createContext, useState } from 'react';
import { Text, View } from 'react-native';
import Toast from 'react-native-toast-message';
import useThemedStyle from './hooks/use-themed-style';

export const AuthContext = createContext({});
export default function RootLayout() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  const { styles, isDark } = useThemedStyle(getStyles);

  // 로그인
  const login = (userId, userPw) => {
    return fetch('/login', {
      method: 'POST',
      body: JSON.stringify({
        userId: userId,
        userPw: userPw,
      }),
    })
      .then(res => {
        console.log('res', res, res.status);
        if (res.status >= 400) {
          return { message: '아이디 또는 비밀번호가 올바르지 않습니다.' };
        }
        return res.json();
      })
      .then(data => {
        if (data.message) {
          return data;
        }
        console.log('data', data);
        setUser(data.user);
        return Promise.all([
          SecureStore.setItemAsync('accessToken', data.accessToken),
          SecureStore.setItemAsync('refreshToken', data.refreshToken),
          AsyncStorage.setItem('user', JSON.stringify(data.user)),
        ]).then(() => router.push('/(tabs)'));
      })
      .catch(error => {
        console.error('error', error);
      });
  };

  // 토스트
  const toastConfig = {
    addTrendToast: ({ text1 }) => (
      <View style={styles.toastBg}>
        <View style={styles.toast}>
          <Text style={styles.toastText}>{text1}</Text>
        </View>
      </View>
    ),
  };

  return (
    <AuthContext.Provider value={{ user, login }}>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Toast config={toastConfig} />
    </AuthContext.Provider>
  );
}

const getStyles = isDark => ({
  toastBg: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  toast: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#454545',
    borderRadius: 20,
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
  },
});
