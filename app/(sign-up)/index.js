import { useContext } from 'react';
import ChannelInfo from './screens/channelInfo';
import InterestsInfo from './screens/interestsInfo';
import UserInfo from './screens/userInfo';
import { StepContext } from './step-context';
import Welcome from './welcome';

export default function SignUpIndex() {
  const { step } = useContext(StepContext);

  return (
    <>
      {step <= 3 ? (
        <UserInfo />
      ) : step === 4 ? (
        <InterestsInfo />
      ) : step <= 7 ? (
        <ChannelInfo />
      ) : (
        <Welcome />
      )}
    </>
  );
}
