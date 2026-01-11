import SearchBar from '@/app/components/feed/SearchBar';
import NotificationIcon from '@/assets/svgs/feed/notification-icon';
import WriteButtonIcon from '@/assets/svgs/feed/write-button-icon';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useThemedStyle from '../../hooks/use-themed-style';
import NavigationLayout from './(navigation)/_layout';

export default function Feed() {
  const insets = useSafeAreaInsets();
  const { isDark, styles } = useThemedStyle(getStyles);
  const [text, setText] = useState('');
  const router = useRouter();

  // 검색 실행 함수
  const handleSearch = () => {
    if (text.trim().length > 0) {
      router.push({
        pathname: '/feed/results',
        params: { q: text },
      });
    }
  };

  // 아이콘 색상 설정
  const iconColor = isDark ? '#FAFAFA' : '#141414';
  const tabBarBg = isDark ? '#141414' : '#FAFAFA';
  const writeBtnIconBg = isDark ? '#CCFF66' : '#B8E65C';
  const writeBtnIconcolor = isDark ? '#141414' : '#323232';

  return (
    <View style={[styles.mainContainer, { paddingTop: insets.top }]}>
      <View style={styles.searchBarContainer}>
        <SearchBar
          value={text}
          onChangeText={setText}
          onSubmit={handleSearch}
          styles={styles}
          searchIconColor={iconColor}
        />
        <NotificationIcon color={iconColor} />
      </View>
      <NavigationLayout isDark={isDark} styles={styles} tabBarBg={tabBarBg} />
      <Pressable
        style={styles.floatingButton}
        onPress={() => console.log('새 글 작성 버튼 클릭!')}
      >
        <WriteButtonIcon
          backgroundColor={writeBtnIconBg}
          color={writeBtnIconcolor}
        />
      </Pressable>
    </View>
  );
}

const getStyles = (isDark, primaryColors) => {
  const headerBg = isDark ? '#141414' : '#FAFAFA';

  return StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: headerBg,
    },

    searchBarContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 22,
      paddingTop: 20,
      paddingBottom: 10,
      paddingHorizontal: 16,
      backgroundColor: headerBg,
    },

    inputWrapper: {
      flex: 1,
      position: 'relative',
      justifyContent: 'center',
    },

    searchInput: {
      flexDirection: 'row',
      gap: 90,
      backgroundColor: isDark ? '#E6E6E6' : '#EFF1F4',
      borderRadius: 100,
      paddingHorizontal: 15,
    },

    searchIconContainer: {
      position: 'absolute',
      right: 15,
    },

    tabItem: {
      flex: 1,
      flexDirection: 'row',
      gap: 10,
      paddingVertical: 5,
      paddingHorizontal: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },

    tabText: {
      fontSize: 16,
      fontWeight: '700',
    },

    feedContentBox: {
      backgroundColor: isDark ? '#202020' : '#FCFCFC',
      paddingHorizontal: 17,
      paddingTop: 30,
    },

    postItemSeparator: {
      height: 1,
      borderRadius: 1,
      backgroundColor: isDark ? '#454545' : '#D3D3D3',
      marginHorizontal: 10,
      marginVertical: 14,
    },

    floatingButton: {
      position: 'absolute',
      bottom: 20,
      right: 17,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 10,
      elevation: 8,
    },
  });
};
