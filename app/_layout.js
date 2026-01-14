import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { createContext, useState } from 'react';
import { Text, View } from 'react-native';
import Toast from 'react-native-toast-message';
import useThemedStyle from './hooks/use-themed-style';

export const AuthContext = createContext({});
export default function RootLayout() {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [kakaoEmail, setKakaoEmail] = useState(null);

  const { styles, isDark } = useThemedStyle(getStyles);

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
    <AuthContext.Provider
      value={{
        user,
        setUser,
        accessToken,
        setAccessToken,
        refreshToken,
        setRefreshToken,
        isLoggedIn: !!accessToken,
        kakaoEmail,
        setKakaoEmail,
      }}
    >
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Toast config={toastConfig} />
    </AuthContext.Provider>
  );
}

const getStyles = (isDark, primaryColors) => ({
  toastBg: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  toast: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: isDark
      ? 'rgba(69, 69, 69, 0.8)'
      : 'rgba(211, 211, 211, 0.8)',
    borderRadius: 20,
  },
  toastText: {
    color: isDark ? '#FFFFFF' : '#000000',
    fontSize: 18,
    textAlign: 'center',
  },
});
