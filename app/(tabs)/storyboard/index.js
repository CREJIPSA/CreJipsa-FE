import { AuthContext } from '@/app/_layout';
import StoryboardDrawer from '@/app/components/storyboard/drawer/index.js';
import MessageItem from '@/app/components/storyboard/message-input';
import useThemedStyle from '@/app/hooks/use-themed-style';
import MenuIcon from '@/assets/svgs/storyboard/menu.js';
import SendIcon from '@/assets/svgs/storyboard/send.js';
import { useFocusEffect } from 'expo-router';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Storyboard() {
  const { accessToken } = useContext(AuthContext);

  const insets = useSafeAreaInsets();
  const { styles, primaryColors } = useThemedStyle(getStyles);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');

  const handleSend = async () => {
    if (!messageInput.trim()) return;

    const roomId = activeRoomId;
    if (!roomId) return;

    setMessages(prevMessages => [
      ...prevMessages,
      { id: Date.now(), text: messageInput, isUser: true },
    ]);
    setMessageInput('');

    try {
      const res = await fetch(
        `https://dev.crezipsa.site/api/chats/${activeRoomId}/messages`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: messageInput,
          }),
        },
      );

      const raw = await res.text();
      console.log('chat message api status', res.status);
      console.log('chat message api raw response', raw);

      if (!res.ok) {
        throw new Error(`Chat Message API error: ${res.status}`);
      }

      const data = await JSON.parse(raw);
      setMessages(prevMessages => [
        ...prevMessages,
        { id: Date.now() + 1, text: data.result.content, isUser: false },
      ]);
      setHasActivity(true); // 기록이 생겼음을 표시
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // 새 채팅방 만들기
  const [activeRoomId, setActiveRoomId] = useState(null); // 활성 채팅방 ID
  const [hasActivity, setHasActivity] = useState(false); // 기록이 있는지
  const creatingRef = useRef(false); // 중복 생성 방지

  // 새 채팅방 생성 함수
  const createNewChatRoom = useCallback(async () => {
    if (creatingRef.current) return null; // 이미 생성 중이면 무시
    creatingRef.current = true;
    try {
      const res = await fetch('https://dev.crezipsa.site/api/chats', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) throw new Error(`Create Chat Room API error: ${res.status}`);

      const data = await res.json();
      return data.result; // 새로 생성된 채팅방 ID 반환
    } finally {
      creatingRef.current = false;
    }
  }, [accessToken]);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false; // 유효성 확인

      async function ensureNewChatRoom() {
        // 새 채팅방이 없으면 생성
        if (!activeRoomId) {
          const id = await createNewChatRoom();
          if (!cancelled) {
            // 유효
            setActiveRoomId(id); // 활성 채팅방 설정
            setHasActivity(false);
          }
          return;
        }

        // 기존 채팅방에 기록이 있으면 새 채팅방 생성
        if (hasActivity) {
          const id = await createNewChatRoom();
          if (!cancelled) {
            // 유효
            setActiveRoomId(id);
            setHasActivity(false);
          }
        }

        // 활동 안 했으면 그대로 사용
      }

      ensureNewChatRoom();
      return () => {
        cancelled = true;
      }; // 무효화
    }, [activeRoomId, hasActivity, createNewChatRoom]),
  );

  // 자동 스크롤 구현
  const listRef = useRef(null);
  const [isNearBottom, setIsNearBottom] = useState(true);
  useEffect(() => {
    if (isNearBottom) {
      listRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages, isNearBottom]);
  const handleScroll = event => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 100;
    const nearBottom =
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
    setIsNearBottom(nearBottom);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.mainContainer, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      <View style={styles.header}>
        <Text style={styles.titleText}>AI 스토리보드 생성</Text>
        <Pressable onPress={() => setDrawerVisible(true)}>
          <MenuIcon color={primaryColors.color} size={24} />
        </Pressable>
      </View>
      {messages.length > 0 ? (
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <MessageItem text={item.text} isUser={item.isUser} />
          )}
          contentContainerStyle={{
            paddingTop: 40,
            paddingHorizontal: 16,
            justifyContent: 'flex-end',
          }}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        />
      ) : (
        <View style={{ flex: 1 }}>
          <Text style={styles.initialText}>
            크집사에게{'\n'}
            <Text style={styles.highlightText}>스토리보드</Text> 부탁하기
          </Text>
        </View>
      )}
      <View style={styles.chatBar}>
        <TextInput
          style={styles.chatInput}
          value={messageInput}
          onChangeText={setMessageInput}
          placeholder="스토리보드 생성을 부탁하세요."
          placeholderTextColor={'#959595'}
          autoCapitalize="none"
          autoCorrect={false}
          multiline
        />
        <Pressable style={styles.sendButton} onPress={handleSend}>
          <SendIcon color={'#141414'} size={12} />
        </Pressable>
      </View>
      <StoryboardDrawer
        visible={drawerVisible}
        onClose={() => {
          setDrawerVisible(false);
        }}
      />
    </KeyboardAvoidingView>
  );
}

const getStyles = (isDark, primaryColors) => ({
  mainContainer: {
    flex: 1,
    backgroundColor: primaryColors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: primaryColors.color,
  },
  chatBar: {
    backgroundColor: isDark ? '#141414' : '#FAFAFA',
    borderTopWidth: 0.5,
    borderTopColor: isDark ? '#D3D3D3' : '#666666',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 22,
    gap: 20,
  },
  chatInput: {
    width: '85%',
    backgroundColor: isDark ? '#323232' : '#E6E6E6',
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 12,
    color: primaryColors.color,
    fontSize: 16,
  },
  sendButton: {
    width: 33,
    height: 33,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
    backgroundColor: isDark ? '#CCFF66' : '#C6E945',
    borderRadius: 100,
  },
  initialText: {
    marginTop: 130,
    color: isDark ? '#FAFAFA' : '#323232',
    fontSize: 20,
    textAlign: 'center',
  },
  highlightText: {
    fontWeight: 'bold',
    color: isDark ? '#D7FF88' : '#C6E945',
  },
});
