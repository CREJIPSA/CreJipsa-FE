import NotificationIcon from '@/assets/svgs/feed/notification-icon';
import SearchIcon from '@/assets/svgs/feed/search-icon';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useThemedStyle from '../../hooks/use-themed-style';
import NavigationLayout from './(navigation)/_layout';

export default function Feed() {
  const insets = useSafeAreaInsets();
  const { isDark, styles } = useThemedStyle(getStyles);
  const [text, setText] = useState('');

  // 아이콘 색상 설정
  const searchIconColor = isDark ? '#141414' : '#202020';
  const notificationIconColor = isDark ? '#FAFAFA' : '#141414';
  const tabBarBg = isDark ? '#141414' : '#FAFAFA';

  return (
    <View style={[styles.mainContainer, { paddingTop: insets.top }]}>
      <View style={styles.searchBarContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.searchInput}
            onChangeText={setText}
            value={text}
            placeholder="검색어를 입력해주세요."
            placeholderTextColor="#959595"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <View style={styles.searchIconContainer}>
            <SearchIcon color={searchIconColor} />
          </View>
        </View>
        <NotificationIcon color={notificationIconColor} />
      </View>
      <NavigationLayout isDark={isDark} styles={styles} tabBarBg={tabBarBg} />
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
  });
};
