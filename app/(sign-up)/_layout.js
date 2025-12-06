import { Slot, usePathname } from 'expo-router';
import { useContext } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useThemedStyle from '../hooks/use-themed-style';
import StepProvider, { StepContext } from './step-context';

export default function SignUpLayout() {
  const pathname = usePathname();

  return (
    <StepProvider>
      {pathname === '/welcome' ? <Slot /> : <SignUpContent />}
    </StepProvider>
  );
}

function SignUpContent() {
  const insets = useSafeAreaInsets();
  const { styles } = useThemedStyle(getStyles);
  const { step, handleBackStep, handleNextStep, title } =
    useContext(StepContext);

  return (
    <View
      style={[
        styles.signUpContainer,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      {/* 헤더 */}
      <View style={styles.headerContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>{title}</Text>
        </View>
      </View>
      {/* 바디 */}
      <View style={styles.bodyContainer}>
        <Slot />
      </View>
      {/* 푸터 */}
      <View style={styles.footerContainer}>
        <Pressable style={styles.backButton} onPress={handleBackStep}>
          <Text style={styles.backButtonText}>뒤로가기</Text>
        </Pressable>
        <Pressable style={styles.nextButton} onPress={handleNextStep}>
          <Text style={styles.nextButtonText}>
            {step === 3 ? '완료' : '다음'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const getStyles = isDark => ({
  signUpContainer: {
    flex: 1,
    backgroundColor: isDark ? '#202020' : '#FCFCFC',
  },
  headerContainer: {
    flex: 4,
  },
  titleContainer: {
    flex: 1,
    paddingTop: 90,
    paddingLeft: 16,
  },
  titleText: {
    color: isDark ? '#FAFAFA' : '#141414',
    fontSize: 20,
  },
  bodyContainer: {
    flex: 12,
  },
  footerContainer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  backButton: {
    width: '30%',
    height: 40,
    backgroundColor: '#E6E6E6',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
  backButtonText: {
    fontSize: 14,
    color: '#000000',
  },
  nextButton: {
    width: '65%',
    height: 40,
    backgroundColor: '#CCFF66',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
});
