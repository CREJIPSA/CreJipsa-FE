import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useRouter } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import { createContext, useState } from "react";

export const AuthContext = createContext({});
export default function RootLayout() {

  const router = useRouter();
  const [user, setUser] = useState(null);

  // 로그인
  const login = (userId, userPw) => {
    return fetch("/login", {
      method: "POST",
      body: JSON.stringify({ 
        userId: userId,
        userPw: userPw
      })
    })
    .then((res) => {
      console.log("res", res, res.status);
      if (res.status >= 400) {
        return { message: "아이디 또는 비밀번호가 올바르지 않습니다." };
      }
      return res.json();
    })
    .then((data) => {
      if (data.message) {
        return data;
      }
      console.log("data", data);
      setUser(data.user);
      return Promise.all([
        SecureStore.setItemAsync("accessToken", data.accessToken),
        SecureStore.setItemAsync("refreshToken", data.refreshToken),
        AsyncStorage.setItem("user", JSON.stringify(data.user))
      ]).then(() => router.push("/(tabs)"));
    })
    .catch((error) => {
      console.error("error", error);
    });
  }

  return (
    <AuthContext value={{ user, login }}>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthContext>
  );
}
