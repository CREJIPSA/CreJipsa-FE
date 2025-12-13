import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';
import { StepContext } from './step-context';

export const TermContext = createContext();

export default function TermProvider({ children }) {
  const { signupCompleted } = useContext(StepContext);

  const [terms, setTerms] = useState({
    term1: false,
    term2: false,
    term3: false,
    term4: false,
  });

  const [termsOptions, setTermsOptions] = useState({
    isTermConfirmed: false,
    isAllTermsChecked: false,
    isTermModalVisible: true,
  });

  // 전체 약관 동의 상태 동기화
  useEffect(() => {
    if (terms.term1 && terms.term2 && terms.term3 && terms.term4) {
      setTermsOptions(prev => ({
        ...prev,
        isAllTermsChecked: true,
        isTermConfirmed: true,
      }));
    } else {
      setTermsOptions(prev => ({
        ...prev,
        isAllTermsChecked: false,
        isTermConfirmed: terms.term1 && terms.term2 && terms.term3,
      }));
    }
  }, [terms.term1, terms.term2, terms.term3, terms.term4]);

  // 모두 동의
  const handleAllTermsCheck = () => {
    const newValue = !termsOptions.isAllTermsChecked;
    setTermsOptions(prev => ({
      ...prev,
      isAllTermsChecked: newValue,
    }));
    setTerms({
      term1: newValue,
      term2: newValue,
      term3: newValue,
      term4: newValue,
    });
  };

  // 최종 동의
  const handleFinalConfirmation = () => {
    if (termsOptions.isTermConfirmed) {
      AsyncStorage.setItem('termsConfirmed', 'true');
    }
  };

  // 회원가입을 완료하지 않고 앱 종료 시 약관 동의 초기화
  useEffect(() => {
    const resetTermsConfirmation = async () => {
      if (!signupCompleted) {
        await AsyncStorage.removeItem('termsConfirmed');
      }
    };
    resetTermsConfirmation();
  }, [signupCompleted]);

  // 앱 시작 시 약관 동의 여부 확인
  useEffect(() => {
    const checkTermsConfirmed = async () => {
      const confirmed = await AsyncStorage.getItem('termsConfirmed');
      if (confirmed === 'true' || signupCompleted) {
        setTermsOptions(prev => ({ ...prev, isTermModalVisible: false }));
      } else if (!signupCompleted) {
        setTermsOptions(prev => ({ ...prev, isTermModalVisible: true }));
      }
    };
    checkTermsConfirmed();
  }, [signupCompleted]);

  return (
    <TermContext.Provider
      value={{
        terms,
        setTerms,
        termsOptions,
        setTermsOptions,
        handleAllTermsCheck,
        handleFinalConfirmation,
      }}
    >
      {children}
    </TermContext.Provider>
  );
}
