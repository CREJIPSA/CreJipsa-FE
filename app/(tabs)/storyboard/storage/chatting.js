import { AuthContext } from '@/app/_layout';
import { authFetch } from '@/app/api/authFetch';
import DropdownInnerOption from '@/app/components/storyboard/dropdown-inner-option';
import useThemedStyle from '@/app/hooks/use-themed-style';
import { useContext, useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';

export default function ChattingStorage() {
  const { styles } = useThemedStyle(getStyles);

  const { accessToken } = useContext(AuthContext);

  const [myChatList, setMyChatList] = useState([]);

  useEffect(() => {
    authFetch('https://dev.crezipsa.site/api/chats', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then(async res => {
        const raw = await res.text();
        console.log('my chats api status', res.status);
        console.log('my chats api raw response', raw);

        let data = null;
        try {
          data = raw ? JSON.parse(raw) : null;
        } catch (e) {
          console.error('Failed to parse JSON response', e);
        }

        if (!res.ok) throw new Error(`My Chats API error: ${res.status}`);
        return data;
      })
      .then(data => {
        const result = data?.result;
        if (!result || !Array.isArray(result)) {
          console.error('Invalid my chats data format', data);
          return;
        }
        const nextList = result
          .filter(item => item?.lastMessageAt)
          .sort(
            (a, b) =>
              new Date(b.lastMessageAt).getTime() -
              new Date(a.lastMessageAt).getTime(),
          );

        setMyChatList(nextList);
      })
      .catch(error => {
        console.error('Failed to fetch my chats data', error);
      });
  }, [accessToken]);

  return (
    <View style={styles.mainContainer}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 23, gap: 20 }}
      >
        {myChatList.map(item => (
          <DropdownInnerOption
            key={item.chatRoomId}
            label="chatting"
            text={item.title}
            route={item.chatRoomId}
            chatRoomId={item.chatRoomId}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const getStyles = (isDark, primaryColors) => ({
  mainContainer: {
    flex: 1,
    backgroundColor: primaryColors.background,
    paddingHorizontal: 16,
  },
});
