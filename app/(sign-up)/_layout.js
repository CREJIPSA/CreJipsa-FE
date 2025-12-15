import { Slot, usePathname } from 'expo-router';
import { useContext, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useThemedStyle from '../hooks/use-themed-style';
import UserInfo from './screens/userInfo';
import StepProvider, { StepContext } from './step-context';
import TermProvider from './term-context';

export default function SignUpLayout() {
  const pathname = usePathname();

  return (
    <StepProvider>
      <TermProvider>
        {pathname === '/welcome' ? <Slot /> : <SignUpContent />}
      </TermProvider>
    </StepProvider>
  );
}

function SignUpContent() {
  const insets = useSafeAreaInsets();
  const { styles } = useThemedStyle(getStyles);
  const { step, handleNextStep, handleBackStep, title } =
    useContext(StepContext);

  const userInfoRef = useRef(null);
  // 다음 버튼 활성화 상태
  const [isNextButtonActive, setIsNextButtonActive] = useState(false);
  const handleFormChange = isComplete => {
    setIsNextButtonActive(isComplete);
  };

  const handleNextButtonClick = async () => {
    if (userInfoRef.current) {
      const isValid = await userInfoRef.current.validateAndGoNext();
      if (isValid) {
        console.log('유효성 검사 통과, 다음 단계로 이동');
        handleNextStep();
      } else {
        console.log('유효성 검사 실패, 현재 단계에 머무름');
      }
    }
  };

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
        <UserInfo ref={userInfoRef} onFormStatusChange={handleFormChange} />
      </View>
      {/* 푸터 */}
      <View style={styles.footerContainer}>
        {step > 3 && (
          <Pressable style={styles.backButton} onPress={handleBackStep}>
            <Text style={styles.backButtonText}>뒤로가기</Text>
          </Pressable>
        )}
        <Pressable
          style={[
            styles.nextButton,
            step < 4 && { width: '90%' },
            !isNextButtonActive && styles.nextButtonDimmed,
          ]}
          onPress={async () => {
            if (isNextButtonActive) {
              await handleNextButtonClick();
              console.log('step: ', step);
            }
          }}
          disabled={!isNextButtonActive}
        >
          <Text
            style={[
              styles.nextButtonText,
              !isNextButtonActive && styles.nextButtonTextDimmed,
            ]}
          >
            다음
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
  nextButtonDimmed: {
    backgroundColor: '#7A993D',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  nextButtonTextDimmed: {
    color: '#D3D3D3',
  },
});
