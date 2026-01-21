import { AuthContext } from '@/app/_layout';
import StoryboardDrawer from '@/app/components/storyboard/drawer/index.js';
import MessageItem from '@/app/components/storyboard/message-input';
import useThemedStyle from '@/app/hooks/use-themed-style';
import MenuIcon from '@/assets/svgs/storyboard/menu.js';
import SendIcon from '@/assets/svgs/storyboard/send.js';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
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

export default function ChatScreen() {
  const { roomId: roomIdParam, initialMessage } = useLocalSearchParams();
  const roomId = Array.isArray(roomIdParam) ? roomIdParam[0] : roomIdParam;
  console.log('roomIdParam', roomIdParam, 'roomId', roomId);
  const initial = Array.isArray(initialMessage)
    ? initialMessage[0]
    : initialMessage;

  const { accessToken } = useContext(AuthContext);
  const router = useRouter();

  const insets = useSafeAreaInsets();
  const { styles, primaryColors } = useThemedStyle(getStyles);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');

  const roomIdRef = useRef(roomId ?? null);
  useEffect(() => {
    roomIdRef.current = roomId ?? null;
  }, [roomId]);

  const initialSentRef = useRef(false);
  useEffect(() => {
    initialSentRef.current = false;
  }, [roomId]);

  // 기존 메시지 로드
  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      async function loadMessages() {
        if (!accessToken || !roomId) return;

        try {
          const res = await fetch(
            `https://dev.crezipsa.site/api/chats/${roomId}`,
            {
              method: 'GET',
              headers: { Authorization: `Bearer ${accessToken}` },
            },
          );

          const raw = await res.text();
          console.log('chat room api status', res.status);
          console.log('chat room api raw response', raw);

          if (!res.ok) {
            throw new Error(`Chat Room API error: ${res.status}`);
          }

          const data = JSON.parse(raw);

          const loadedMessages = (data.result?.messages ?? []).map(msg => ({
            id: msg.messageId,
            text: msg.content,
            isUser: msg.senderType === 'USER',
          }));

          if (!cancelled) {
            if (!loadedMessages.length) return;
            setMessages(prev => {
              const map = new Map();
              prev.forEach(m => map.set(String(m.id), m));
              loadedMessages.forEach(m => map.set(String(m.id), m));
              return Array.from(map.values());
            });
          }
        } catch (error) {
          console.error('Error loading messages:', error);
        }
      }

      loadMessages();

      return () => {
        cancelled = true;
      };
    }, [accessToken, roomId]),
  );

  // 채팅창 생성
  const creatingRoomRef = useRef(false); // 중복 생성 방지
  const ensureRoomId = async () => {
    if (!accessToken) return null;
    if (roomIdRef.current) return roomIdRef.current;
    if (creatingRoomRef.current) return null;

    creatingRoomRef.current = true;
    try {
      const res = await fetch('https://dev.crezipsa.site/api/chats', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!res.ok) {
        console.error(`Create Chat Room API error: ${res.status}`);
        return null;
      }
      const data = await res.json();
      roomIdRef.current = data.result;
      return roomIdRef.current;
    } catch (error) {
      console.error('Failed to create chat room', error);
      return null;
    } finally {
      creatingRoomRef.current = false;
    }
  };

  useEffect(() => {
    if (!accessToken) return;
    if (!roomId) return;
    if (!initial) return;
    if (initialSentRef.current) return;

    initialSentRef.current = true;

    (async () => {
      setMessages(prev => [
        ...prev,
        { id: `tmp-user-${Date.now()}`, text: initial, isUser: true },
      ]);

      const res = await fetch(
        `https://dev.crezipsa.site/api/chats/${roomId}/messages`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ message: initial }),
        },
      );

      const raw = await res.text();
      if (!res.ok) return;

      const data = JSON.parse(raw);
      setMessages(prev => [
        ...prev,
        {
          id: `tmp-ai-${Date.now()}`,
          text: data.result.content,
          isUser: false,
        },
      ]);
    })();
  }, [accessToken, roomId, initial]);

  // 메시지 전송 처리
  const handleSend = async () => {
    const text = messageInput.trim();
    if (!text) return;

    setMessageInput('');

    if (!roomId) {
      const id = await ensureRoomId();
      if (!id) return;

      router.replace({
        pathname: `/storyboard/${id}`,
        params: { initialMessage: text },
      });
      return;
    }

    setMessages(prev => [
      ...prev,
      { id: `temp-user-${Date.now()}`, text, isUser: true },
    ]);

    const res = await fetch(
      `https://dev.crezipsa.site/api/chats/${roomId}/messages`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ message: text }),
      },
    );
    const raw = await res.text();
    console.log('send message api status', res.status);
    console.log('send message api raw response', raw);

    if (!res.ok) {
      console.error(`Send Message API error: ${res.status}`);
      return;
    }

    const data = JSON.parse(raw);

    const aiMessageId = data.result.messageId ?? `temp-ai-${Date.now()}`;
    setMessages(prev => [
      ...prev,
      {
        id: aiMessageId,
        text: data.result.content,
        isUser: false,
      },
    ]);
  };

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
            <MessageItem
              text={item.text}
              isUser={item.isUser}
              chatMessageId={item.id}
            />
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
