import { useContext } from 'react';
import ChannelInfo from './screens/channelInfo';
import UserInfo from './screens/userInfo';
import { StepContext } from './step-context';

export default function SignUpIndex() {
  const { step } = useContext(StepContext);

  return <>{step <= 3 ? <UserInfo /> : <ChannelInfo />}</>;
}
