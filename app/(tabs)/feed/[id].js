import SearchBar from '@/app/components/feed/SearchBar';
import useThemedStyle from '@/app/hooks/use-themed-style';
import BackIcon from '@/assets/svgs/feed/back-icon';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function FeedDetail() {
  const { id } = useLocalSearchParams();
  console.log('현재 게시글 ID:', id);

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

  return (
    <View style={[styles.mainContainer, { paddingTop: insets.top }]}>
      <View style={styles.searchBarContainer}>
        <Pressable onPress={() => router.back()}>
          <BackIcon color={iconColor} />
        </Pressable>
        <SearchBar
          value={text}
          onChangeText={setText}
          onSubmit={handleSearch}
          styles={styles}
          searchIconColor={iconColor}
        />
      </View>
      <View style={styles.contentContainer}></View>
    </View>
  );
}

const getStyles = (isDark, primaryColors) => {
  const headerBg = isDark ? '#141414' : '#FAFAFA';
  const contentBg = isDark ? '#323232' : '#FFFFFF';

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

    contentContainer: {
      flex: 1,
      backgroundColor: contentBg,
    },
  });
};
