import SearchBar from '@/app/components/feed/SearchBar';
import useThemedStyle from '@/app/hooks/use-themed-style';
import BackIcon from '@/assets/svgs/feed/back-icon';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SearchResult() {
  const insets = useSafeAreaInsets();
  const { isDark, styles } = useThemedStyle(getStyles);
  const router = useRouter();
  const { q } = useLocalSearchParams();
  const [text, setText] = useState(q || '');

  // 아이콘 색상 설정
  const iconColor = isDark ? '#FAFAFA' : '#141414';

  // 3. 결과 페이지 내에서 다시 검색할 때 실행할 함수
  const handleSearch = () => {
    if (text.trim().length > 0) {
      // 같은 페이지에서 파라미터만 업데이트 (필요 시)
      router.setParams({ q: text });
      console.log('결과 페이지 내 재검색:', text);
    }
  };

  return (
    <View style={[styles.mainContainer, { paddingTop: insets.top }]}>
      <View style={styles.searchBarContainer}>
        <BackIcon color={iconColor} />
        <SearchBar
          value={q}
          onChangeText={setText}
          onSubmit={handleSearch}
          styles={styles}
          isDark={isDark}
        />
      </View>
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
