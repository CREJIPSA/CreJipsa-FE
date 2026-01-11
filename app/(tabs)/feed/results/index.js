import NoResult from '@/app/components/feed/NoResult';
import SearchBar from '@/app/components/feed/SearchBar';
import FilterComponent from '@/app/components/my/FilterComponent';
import DUMMY_POSTS from '@/app/constants/my/DUMMY_POSTS';
import useThemedStyle from '@/app/hooks/use-themed-style';
import BackIcon from '@/assets/svgs/feed/back-icon';
import WriteButtonIcon from '@/assets/svgs/feed/write-button-icon';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FeedScreen from '../(navigation)/FeedScreen';

export default function SearchResult() {
  const insets = useSafeAreaInsets();
  const { isDark, styles } = useThemedStyle(getStyles);
  const router = useRouter();
  const { q } = useLocalSearchParams();

  const [text, setText] = useState(q || '');
  const [searchQuery, setSearchQuery] = useState(q || '');

  const [openedFilter, setOpenedFilter] = useState(null);

  const toggleFilter = filterName => {
    setOpenedFilter(openedFilter === filterName ? null : filterName);
  };

  const filteredData = useMemo(() => {
    return DUMMY_POSTS.filter(post => post.title.includes(searchQuery));
  }, [searchQuery]);

  // 아이콘 색상 설정
  const iconColor = isDark ? '#FAFAFA' : '#141414';
  const writeBtnIconBg = isDark ? '#CCFF66' : '#B8E65C';
  const writeBtnIconcolor = isDark ? '#141414' : '#323232';

  const handleSearch = () => {
    if (text.trim().length > 0) {
      setSearchQuery(text);
      router.setParams({ q: text });
      console.log('결과 페이지 내 재검색 완료:', text);
    }
  };

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

      <View style={styles.filterContainer}>
        <FilterComponent
          text={'전체'}
          isOpen={openedFilter === 'category'}
          onPress={() => toggleFilter('category')}
          options={['전체', '일반', '팁', '같이 촬영해요']}
        />
        <FilterComponent
          text={'최신순'}
          isOpen={openedFilter === 'sort'}
          onPress={() => toggleFilter('sort')}
          options={['최신순', '인기순', '과거순']}
        />
      </View>

      {filteredData.length > 0 ? (
        <View style={{ flex: 1 }}>
          <FeedScreen styles={styles} data={filteredData} />
        </View>
      ) : (
        <NoResult searchText={searchQuery} />
      )}

      <Pressable style={styles.floatingButton}>
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

    filterContainer: {
      backgroundColor: isDark ? '#202020' : '#FCFCFC',
      flexDirection: 'row',
      gap: 16,
      justifyContent: 'flex-start',
      zIndex: 100,
      paddingVertical: 15,
      paddingHorizontal: 17,
    },

    feedContentBox: {
      backgroundColor: isDark ? '#202020' : '#FCFCFC',
      paddingHorizontal: 17,
      paddingTop: 15,
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
