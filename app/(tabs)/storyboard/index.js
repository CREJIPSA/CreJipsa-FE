import MessageItem from '@/app/components/storyboard/message-input';
import useThemedStyle from '@/app/hooks/use-themed-style';
import MenuIcon from '@/assets/svgs/storyboard/menu.js';
import SendIcon from '@/assets/svgs/storyboard/send.js';
import { useEffect, useRef, useState } from 'react';
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
import StoryboardDrawer from './drawer';

export default function Storyboard() {
  const insets = useSafeAreaInsets();
  const { styles, primaryColors } = useThemedStyle(getStyles);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');

  const handleSend = () => {
    if (!messageInput.trim()) return;
    setMessages(prevMessages => [
      ...prevMessages,
      { text: messageInput, isUser: true },
    ]);
    setMessageInput('');

    // (임시) AI 응답 확인용 테스트 코드
    setTimeout(() => {
      const replies = [
        '짧게: 좋아요!',
        '긴 문장 테스트: 이 메시지는 버블이 화면을 넘치지 않고 자연스럽게 줄바꿈 되는지 확인하기 위한 아주 긴 텍스트입니다. 계속 길게 써볼게요. 계속 계속…',
        '줄바꿈 테스트:\n1) 씬1: 인트로\n2) 씬2: 갈등\n3) 씬3: 결말',
        '이모지 테스트 🙂🔥✨',
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      setMessages(prevMessages => [
        ...prevMessages,
        { text: randomReply, isUser: false },
      ]);
    }, 2000);
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
          keyExtractor={(_, index) => index.toString()}
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
        onClose={() => setDrawerVisible(false)}
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
