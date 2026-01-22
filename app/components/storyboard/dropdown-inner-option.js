import { AuthContext } from '@/app/_layout';
import useThemedStyle from '@/app/hooks/use-themed-style';
import { useRouter } from 'expo-router';
import { useContext, useEffect, useRef, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

// 드롭다운 내부 옵션 컴포넌트
export default function DropdownInnerOption({
  label,
  text,
  route,
  chatRoomId,
}) {
  const { styles } = useThemedStyle(getStyles);
  const router = useRouter();

  const { accessToken } = useContext(AuthContext);

  const [chatRoomTitle, setChatRoomTitle] = useState(text);
  const prevTitleRef = useRef(text);

  useEffect(() => {
    setChatRoomTitle(text);
    prevTitleRef.current = text;
  }, [text]);

  async function changeChatTitle() {
    if (!accessToken || !chatRoomId) return;

    const newTitle = chatRoomTitle.trim();
    const prevTitle = prevTitleRef.current.trim();
    if (!newTitle || newTitle === prevTitle) return;

    try {
      const res = await fetch(
        `https://dev.crezipsa.site/api/chats/${chatRoomId}/title`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ title: newTitle }),
        },
      );
      if (!res.ok)
        throw new Error(`Change Chat Title API error: ${res.status}`);
      prevTitleRef.current = newTitle;
      setChatRoomTitle(newTitle);
    } catch (error) {
      console.error('Failed to change chat room title', error);
      setChatRoomTitle(prevTitle);
    }
  }

  return (
    <View style={styles.drawerInnerOption}>
      <TextInput
        style={styles.drawerInnerOptionText}
        value={chatRoomTitle}
        onChangeText={setChatRoomTitle}
        editable={label === 'chatting'}
        onSubmitEditing={changeChatTitle}
      />
      <Pressable
        style={styles.drawerInnerOptionButton}
        onPress={() => {
          console.log('label', label, 'route', route, 'typeof', typeof route);
          if (label === 'storyboard') {
            router.push(`/storyboard/edit/${route}`);
          } else {
            router.push(`/storyboard/${route}`);
          }
        }}
      >
        <Text style={styles.drawerInnerOptionButtonText}>
          {label === 'storyboard' ? '편집' : '이동'}
        </Text>
      </Pressable>
    </View>
  );
}

const getStyles = (isDark, primaryColors) => ({
  drawerInnerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  drawerInnerOptionText: {
    fontSize: 16,
    color: primaryColors.color,
  },
  drawerInnerOptionButton: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 100,
  },
  drawerInnerOptionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: isDark ? '#B7B7B7' : '#8A8A8A',
  },
});
