import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useThemedStyle from '../hooks/use-themed-style';

export default function Welcome() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { styles } = useThemedStyle(getStyles);

  const { username } = useLocalSearchParams();

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
      <View style={styles.completedTextContainer}>
        <Image
          source={require('@/assets/images/kzipsa_logo.png')}
          style={{ width: 100, height: 100 }}
        />
        <Text style={styles.completedText}>
          {username}님, 환영합니다!{'\n'}
          가입이 완료되었습니다.
        </Text>
      </View>
    </View>
  );
}

const getStyles = isDark =>
  StyleSheet.create({
    completedContainer: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: isDark ? '#202020' : '#FCFCFC',
    },
    completedTextContainer: {
      width: '100%',
      paddingTop: 200,
      justifyContent: 'center',
      alignItems: 'center',
      gap: 30,
    },
    completedText: {
      textAlign: 'center',
      fontSize: 20,
      color: isDark ? '#FAFAFA' : '#141414',
      width: '100%',
    },
  });
