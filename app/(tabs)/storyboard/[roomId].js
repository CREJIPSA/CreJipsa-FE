import { useLocalSearchParams } from 'expo-router';
import ChatScreen from './chatScreen';

export default function StoryboardRoom() {
  const { roomId } = useLocalSearchParams();
  return <ChatScreen roomId={roomId} />;
}
