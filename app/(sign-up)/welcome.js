import { useRouter } from 'expo-router';
import { useContext, useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useThemedStyle from '../hooks/use-themed-style';
import { StepContext } from './step-context';

export default function Welcome() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { form } = useContext(StepContext);
  const { styles } = useThemedStyle(getStyles);

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/(tabs)/(home)');
    }, 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View
      style={[
        styles.completedContainer,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <View
        style={{
          paddingTop: 200,
          justifyContent: 'center',
          alignItems: 'center',
          gap: 30,
        }}
      >
        <Image
          source={require('@/assets/images/kzipsa_logo.png')}
          style={{ width: 100, height: 100 }}
        />
        <Text
          style={styles.completedText}
        >{`${form.userInfo.username}님, 환영합니다!\n가입이 완료되었습니다`}</Text>
      </View>
    </View>
  );
}

const getStyles = isDark =>
  StyleSheet.create({
    completedContainer: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: isDark ? '#141414' : '#FAFAFA',
    },
    completedText: {
      textAlign: 'center',
      fontSize: 20,
      fontWeight: 'normal',
      color: isDark ? '#FAFAFA' : '#141414',
    },
  });
