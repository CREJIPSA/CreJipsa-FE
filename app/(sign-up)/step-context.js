import { useRouter } from 'expo-router';
import { createContext, useEffect, useState } from 'react';

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
      return `${form.userInfo.username}님이 운영하시는\n채널의 플랫폼 형태를 알려주세요.`;
    case 5:
      return `${form.userInfo.username}님이 운영하시는\n채널의 관심 분야를 알려주세요!`;
    case 6:
      return `${form.userInfo.username}님이 운영하시는\n채널의 아이디를 알려주세요.`;
    case 7:
      return `정보가 모두 맞나요?`;
    default:
      return '';
  }
}

export default function StepProvider({ children }) {
  const router = useRouter();

  const [step, setStep] = useState(1); // 회원가입 단계
  const [title, setTitle] = useState(getStepTitle(1, form)); // 단계별 제목
  const [signupCompleted, setSignupCompleted] = useState(false); // 회원가입 완료 여부

  const [form, setForm] = useState({
    // 회원가입 폼 데이터
    userInfo: {
      username: '',
      birth: '',
      gender: '',
    },
    channelInfo: [],
    tempChannel: {
      platform: '',
      channelId: '',
      interests: [],
    },
  });

  const updateForm = patch => {
    setForm(prev => ({
      ...prev,
      ...patch,
    }));
  };

  const addChannel = channel => {
    setForm(prev => ({
      ...prev,
      channelInfo: [...prev.channelInfo, channel],
    }));
  };

  const handleNextStep = () => {
    if (step === 7) {
      addChannel(form.tempChannel);
      const nextChannelInfo = [...form.channelInfo, form.tempChannel];
      updateForm({
        channelInfo: [...form.channelInfo, form.tempChannel],
        tempChannel: {
          platform: '',
          channelId: '',
          interests: [],
        },
      });
      console.log('⚪ Final sign-up data:', {
        ...form,
        channelInfo: nextChannelInfo,
      });
      router.push('/(sign-up)/welcome');
      setSignupCompleted(true);
      return;
    }
    setStep(prev => {
      const next = Math.min(prev + 1, 7);
      if (next <= 4) {
        console.log('🟢 Current userInfo:', form.userInfo);
      }
      return next;
    });
  };

  const handleBackStep = () => {
    if (step > 1) {
      setStep(prev => Math.max(prev - 1, 1));
    } else {
      router.back();
    }
  };

  useEffect(() => {
    setTitle(getStepTitle(step, form));
  }, [step, form]);

  return (
    <StepContext.Provider
      value={{
        step,
        setStep,
        title,
        setTitle,
        handleNextStep,
        handleBackStep,
        form,
        updateForm,
        addChannel,
        signupCompleted,
        setSignupCompleted,
      }}
    >
      {children}
    </StepContext.Provider>
  );
}
