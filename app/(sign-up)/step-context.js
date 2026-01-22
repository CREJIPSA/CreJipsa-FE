import { useRouter } from 'expo-router';
import { createContext, useContext, useState } from 'react';
import { AuthContext } from '../_layout';

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
    case 10:
      return `등록된 채널이 없습니다.\n채널을 추가해주세요.`; // 등록된 채널이 없는 경우
    default:
      return '';
  }
}

export default function StepProvider({ children }) {
  const router = useRouter();

  const [step, setStep] = useState(1); // 회원가입 단계
  const [isSigningUp, setIsSigningUp] = useState(false); // 중복 제출 방지용

  // 회원가입 폼 데이터
  const [form, setForm] = useState({
    userInfo: { username: '', birth: '', gender: '' },
    interests: [],
    channelInfo: [],
  });

  const title = getStepTitle(step, form);

  const updateForm = (section, data) => {
    setForm(prev => {
      if (Array.isArray(prev[section])) {
        return {
          ...prev,
          [section]: data,
        };
      }
      return {
        ...prev,
        [section]: {
          ...prev[section],
          ...data,
        },
      };
    });
  };

  const handleNextStep = async () => {
    if (step === 8) {
      if (isSigningUp) return; // 중복 제출 방지
      setIsSigningUp(true);

      try {
        await signUp();
        router.push({
          pathname: '/(sign-up)/welcome',
          params: { username: form.userInfo.username },
        });
      } catch (error) {
        console.error('Sign-up failed:', error);
      } finally {
        setIsSigningUp(false);
      }
      return;
    } else {
      setStep(prev => Math.min(prev + 1, 8));
    }
  };

  // 채널 정보 형태 수정
  function buildChannelPayload(channelInfo = []) {
    const payload = {
      activeYoutube: null,
      activeInstagram: null,
      activeTiktok: null,
      mainPlatform: null,
    };
    channelInfo.forEach(({ platform, channelId }) => {
      if (!platform || !channelId) return;
      if (platform === 'YOUTUBE') {
        payload.activeYoutube = channelId;
      } else if (platform === 'INSTAGRAM') {
        payload.activeInstagram = channelId;
      } else if (platform === 'TIKTOK') {
        payload.activeTiktok = channelId;
      }
    });
    if (payload.activeYoutube) {
      payload.mainPlatform = 'YOUTUBE';
    } else if (payload.activeInstagram) {
      payload.mainPlatform = 'INSTAGRAM';
    } else if (payload.activeTiktok) {
      payload.mainPlatform = 'TIKTOK';
    }
    return payload;
  }

  const { kakaoEmail } = useContext(AuthContext);

  const signUp = async () => {
    if (!kakaoEmail) {
      throw new Error('Kakao email is missing');
    }
    const res = await fetch('https://dev.crezipsa.site/api/user/signUp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nickName: form.userInfo.username,
        email: kakaoEmail,
        birth: form.userInfo.birth,
        gender: form.userInfo.gender,
        userInterest: form.interests,
        ...buildChannelPayload(form.channelInfo),
      }),
    });

    const raw = await res.text();
    let data = null;
    try {
      data = raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.error('Failed to parse JSON response', e);
    }
    if (!res.ok)
      throw new Error(data?.message ?? `signUp Failed: ${res.status}`);
    console.log('Sign-up successful:', data);
    return data;
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
      }}
    >
      {children}
    </StepContext.Provider>
  );
}
