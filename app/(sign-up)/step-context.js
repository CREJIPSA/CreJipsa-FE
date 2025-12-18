import { useRouter } from 'expo-router';
import { createContext, useState } from 'react';

// 회원가입 단계 컨텍스트
export const StepContext = createContext();

// 회원가입 단계별 제목
function getStepTitle(step, form) {
  switch (step) {
    case 1:
      return `반갑습니다!\n어떻게 불러드리면 될까요?`;
    case 2:
      return `${form.userInfo.username}님의 생일을 알려주세요`;
    case 3:
      return `성별은 어떻게 되시나요?`;
    case 4:
      return `${form.userInfo.username}님의 관심 분야를 선택해주세요.\n(최대 3개)`;
    case 5:
      return `${form.userInfo.username}님이 운영하시는\n채널의 플랫폼 형태를 알려주세요.`;
    case 6:
      return `${form.userInfo.username}님이 운영하시는\n채널의 아이디를 알려주세요.`;
    case 7:
    case 8:
      return `정보가 모두 맞나요?`;
    default:
      return '';
  }
}

export default function StepProvider({ children }) {
  const router = useRouter();

  const [step, setStep] = useState(1); // 회원가입 단계
  const [signupCompleted, setSignupCompleted] = useState(false); // 회원가입 완료 여부

  // 회원가입 폼 데이터
  const [form, setForm] = useState({
    userInfo: { username: '', birth: '', gender: '' },
    interests: [],
    channelInfo: [],
  });

  const title = getStepTitle(step, form);

  const updateForm = (section, data) => {
    setForm(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...data,
      },
    }));
  };

  const handleNextStep = () => {
    if (step === 8) {
      setSignupCompleted(true);
      router.push({
        pathname: '/(sign-up)/welcome',
        params: { username: form.userInfo.username },
      });
      return;
    } else {
      setStep(prev => Math.min(prev + 1, 8));
    }
  };

  const handleBackStep = () => {
    if (step === 1) {
      router.back();
    } else if (step === 8) {
      setStep(5);
    } else {
      setStep(prev => Math.max(prev - 1, 1));
    }
  };

  return (
    <StepContext.Provider
      value={{
        form,
        setForm,
        updateForm,
        step,
        setStep,
        title,
        handleNextStep,
        handleBackStep,
        signupCompleted,
        setSignupCompleted,
      }}
    >
      {children}
    </StepContext.Provider>
  );
}
