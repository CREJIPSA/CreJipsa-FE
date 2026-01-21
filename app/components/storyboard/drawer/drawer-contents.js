import { AuthContext } from '@/app/_layout';
import DropdownInnerOption from '@/app/components/storyboard/dropdown-inner-option';
import useThemedStyle from '@/app/hooks/use-themed-style';
import ChatStorageIcon from '@/assets/svgs/storyboard/archive.js';
import NewChatIcon from '@/assets/svgs/storyboard/chat.js';
import NewStoryboardIcon from '@/assets/svgs/storyboard/new-storyboard';
import StoryboardIcon from '@/assets/svgs/storyboard/storyboard.js';
import { useRouter } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function StoryboardDrawerDefault({ onClose }) {
  const { styles, primaryColors, isDark } = useThemedStyle(getStyles);

  const router = useRouter();
  const { accessToken } = useContext(AuthContext);

  const [openDropdown, setOpenDropdown] = useState(null); // 'storyboard' or 'chatting' or null
  const toggleStoryboardDropdown = () => {
    setOpenDropdown(prev => (prev === 'storyboard' ? null : 'storyboard'));
  };
  const toggleChatDropdown = () => {
    setOpenDropdown(prev => (prev === 'chatting' ? null : 'chatting'));
  };

  // 드롭다운이 있는 옵션 컴포넌트
  const dropdownOption = (icon, text, visible) => {
    return (
      <Pressable
        style={[
          styles.drawerOption,
          visible && { backgroundColor: isDark ? '#141414' : '#FAFAFA' },
        ]}
        onPress={() => {
          if (text === '스토리보드 보관함') {
            toggleStoryboardDropdown();
          } else if (text === '채팅 보관함') {
            toggleChatDropdown();
          }
        }}
      >
        {icon({
          color: visible ? styles.mainColor.color : primaryColors.color,
          size: 18.5,
        })}
        <View style={styles.drawerOptionTextContainer}>
          <Text
            style={[
              styles.drawerOptionText,
              {
                color: visible ? styles.mainColor.color : primaryColors.color,
              },
            ]}
          >
            {text}
          </Text>
          <Ionicons
            name="chevron-down"
            size={20}
            color={visible ? styles.mainColor.color : primaryColors.color}
          />
        </View>
      </Pressable>
    );
  };

  // 더보기 컴포넌트
  const moreOption = label => {
    return (
      <View style={{ alignItems: 'center', marginTop: 10 }}>
        <Pressable
          style={styles.moreOption}
          onPress={() =>
            label === 'storyboard'
              ? router.navigate('/storyboard/storage')
              : router.navigate('/storyboard/storage/chatting')
          }
        >
          <Text style={styles.moreOptionText}>더보기</Text>
        </Pressable>
      </View>
    );
  };

  // 채팅 데이터
  const [myChatList, setMyChatList] = useState([]);

  useEffect(() => {
    fetch('https://dev.crezipsa.site/api/chats', {
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

        setMyChatList(nextList.slice(0, 5));
      })
      .catch(error => {
        console.error('Failed to fetch my chats data', error);
      });
  }, [accessToken]);

  // 스토리보드 데이터
  const [myStoryboardList, setMyStoryboardList] = useState([]);
  useEffect(() => {
    fetch('https://dev.crezipsa.site/api/storyboard', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then(async res => {
        const raw = await res.text();
        console.log('my storyboard api status', res.status);
        console.log('my storyboard api raw response', raw);

        let data = null;
        try {
          data = raw ? JSON.parse(raw) : null;
        } catch (e) {
          console.error('Failed to parse JSON response', e);
        }

        if (!res.ok) throw new Error(`My Storyboard API error: ${res.status}`);
        return data;
      })
      .then(data => {
        const result = data?.result;
        if (!result || !Array.isArray(result)) {
          console.error('Invalid my storyboard data format', data);
          return;
        }
        const nextList = result
          .filter(item => item?.createdAt)
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );
        setMyStoryboardList(nextList.slice(0, 5));
      })
      .catch(error => {
        console.error('Failed to fetch my storyboard data', error);
      });
  }, [accessToken]);

  return (
    <View style={{ gap: 16 }}>
      <Pressable
        style={styles.drawerOption}
        onPress={() => {
          onClose();
          router.replace('/storyboard');
        }}
      >
        <NewChatIcon color={primaryColors.color} size={20} />
        <Text style={styles.drawerOptionText}>새 채팅</Text>
      </Pressable>
      <Pressable
        style={styles.drawerOption}
        onPress={async () => {
          onClose();
          await fetch('https://dev.crezipsa.site/api/storyboard/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({}),
          })
            .then(async res => {
              const raw = await res.text();
              console.log('create storyboard api status', res.status);
              console.log('create storyboard api raw response', raw);

              if (!res.ok) {
                throw new Error(
                  `Create Storyboard API error: ${res.status} raw=${raw}`,
                );
              }

              let data = null;
              try {
                data = raw ? JSON.parse(raw) : null;
              } catch (e) {
                console.error('Failed to parse JSON response', e);
              }

              return data;
            })
            .then(data => {
              const newStoryboardId = data?.result?.storyboardId;
              if (!newStoryboardId) {
                console.error('Invalid create storyboard data format', data);
                return;
              } else {
                console.log(
                  'newStoryboardId',
                  newStoryboardId,
                  typeof newStoryboardId,
                );
                router.push({
                  pathname: `/storyboard/edit/${newStoryboardId}`,
                  params: { draft: 1 },
                });
              }
            })
            .catch(error => {
              console.error('Failed to create new storyboard', error);
            });
        }}
      >
        <NewStoryboardIcon color={primaryColors.color} size={20} />
        <Text style={styles.drawerOptionText}>새 스토리보드</Text>
      </Pressable>
      {dropdownOption(
        StoryboardIcon,
        '스토리보드 보관함',
        openDropdown === 'storyboard',
      )}
      {/* 스토리보드 드롭다운 */}
      {openDropdown === 'storyboard' && (
        <View style={styles.dropdownContainer}>
          {myStoryboardList.slice(0, 5).map((item, index) => (
            <DropdownInnerOption
              key={item.storyboardId}
              label="storyboard"
              text={item.title}
              route={item.storyboardId}
              onClose={onClose}
            />
          ))}
          {moreOption('storyboard')}
        </View>
      )}
      {dropdownOption(
        ChatStorageIcon,
        '채팅 보관함',
        openDropdown === 'chatting',
      )}
      {/* 채팅 드롭다운 */}
      {openDropdown === 'chatting' && (
        <View style={styles.dropdownContainer}>
          {myChatList.slice(0, 5).map(item => (
            <DropdownInnerOption
              key={item.chatRoomId}
              label="chatting"
              text={item.title}
              route={item.chatRoomId}
              chatRoomId={item.chatRoomId}
              onClose={onClose}
            />
          ))}
          {moreOption('chatting')}
        </View>
      )}
    </View>
  );
}

const getStyles = (isDark, primaryColors) => ({
  mainColor: {
    color: isDark ? '#CCFF66' : '#C6E945',
  },
  drawerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 17,
    gap: 10,
    backgroundColor: isDark ? '#454545' : '#E6E6E6',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.1,
    elevation: 1,
  },
  drawerOptionText: {
    fontSize: 16,
    color: primaryColors.color,
  },
  drawerOptionTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  moreOption: {
    backgroundColor: isDark ? '#E6E6E6' : '#323232',
    borderRadius: 100,
    paddingHorizontal: 20,
    paddingVertical: 2,
  },
  moreOptionText: {
    fontSize: 14,
    color: isDark ? '#323232' : '#E6E6E6',
    textAlign: 'center',
  },
  dropdownContainer: {
    gap: 10,
    marginBottom: 30,
  },
});
