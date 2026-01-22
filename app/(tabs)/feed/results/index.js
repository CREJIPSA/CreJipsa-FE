import { AuthContext } from '@/app/_layout';
import { searchCommunityPosts } from '@/app/api/feed';
import NoResult from '@/app/components/feed/NoResult';
import SearchBar from '@/app/components/feed/SearchBar';
import FilterComponent from '@/app/components/my/FilterComponent';
import {
  COMMUNITY_FIELDS,
  getCommunityFieldLabels,
  getFieldKeyByLabel,
} from '@/app/constants/common/COMMUNITY_FIELDS';
import useThemedStyle from '@/app/hooks/use-themed-style';
import BackIcon from '@/assets/svgs/feed/back-icon';
import WriteButtonIcon from '@/assets/svgs/feed/write-button-icon';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FeedScreen from '../(navigation)/FeedScreen';

export default function SearchResult() {
  const insets = useSafeAreaInsets();
  const { isDark, styles, primaryColors } = useThemedStyle(getStyles);
  const router = useRouter();
  const { q } = useLocalSearchParams();
  const { accessToken } = useContext(AuthContext);

  const [text, setText] = useState(q || '');
  const [searchQuery, setSearchQuery] = useState(q || '');
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);

  const [selectedField, setSelectedField] = useState('ALL');
  const [selectedSort, setSelectedSort] = useState('latest');
  const [openedFilter, setOpenedFilter] = useState(null);

  const isFetching = useRef(false);
  const requestIdRef = useRef(0);

  const handleSelectFilter = label => {
    const key = getFieldKeyByLabel(label);
    if (key) {
      setSelectedField(key);
    }
    setOpenedFilter(null);
  };

  const toggleFilter = filterName => {
    setOpenedFilter(openedFilter === filterName ? null : filterName);
  };

  const loadPosts = useCallback(
    async (targetPage, isFresh = false) => {
      if (isFetching.current && !isFresh) {
        return;
      }

      if (!isFresh && targetPage === 0) {
        return;
      }

      if (!searchQuery || searchQuery.trim().length === 0) {
        setInitialLoading(false);
        setPosts([]);
        return;
      }

      const requestId = ++requestIdRef.current;

      try {
        isFetching.current = true;
        setLoading(true);

        const params = {
          keyword: searchQuery.trim(),
          page: targetPage,
          size: 10,
          field: selectedField === 'ALL' ? null : selectedField,
          sort: selectedSort,
        };

        const data = await searchCommunityPosts(params, accessToken);

        if (requestId !== requestIdRef.current) return;

        if (data?.success) {
          const newPosts = data.result || [];

          if (isFresh) {
            setPosts(newPosts);
            setPage(0);
            setHasNextPage(newPosts.length === 10);
          } else {
            setPosts(prev => [...prev, ...newPosts]);
            setPage(targetPage);
            setHasNextPage(newPosts.length === 10);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (requestId === requestIdRef.current) {
          isFetching.current = false;
          setLoading(false);
          setIsRefreshing(false);
          setInitialLoading(false);
        }
      }
    },
    [searchQuery, selectedField, selectedSort, accessToken],
  );

  useEffect(() => {
    setPosts([]);
    setPage(0);
    setHasNextPage(true);
    setInitialLoading(true);
    loadPosts(0, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedField, selectedSort]);

  const handleSearch = () => {
    if (text.trim().length > 0) {
      setSearchQuery(text);
      router.setParams({ q: text });
      console.log('결과 페이지 내 재검색 완료:', text);
    }
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    loadPosts(0, true);
  };

  const onEndReached = () => {
    if (!loading && hasNextPage && !isFetching.current) {
      const nextPage = page + 1;
      loadPosts(nextPage);
    }
  };

  // 아이콘 색상 설정
  const iconColor = isDark ? '#FAFAFA' : '#141414';
  const writeBtnIconBg = isDark ? '#CCFF66' : '#B8E65C';
  const writeBtnIconcolor = isDark ? '#141414' : '#323232';

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
        />
      </View>

      <View style={styles.filterContainer}>
        <FilterComponent
          text={COMMUNITY_FIELDS[selectedField]}
          isOpen={openedFilter === 'category'}
          onPress={() => toggleFilter('category')}
          options={getCommunityFieldLabels()}
          onSelect={handleSelectFilter}
        />
        <FilterComponent
          text={selectedSort === 'latest' ? '최신순' : '인기순'}
          isOpen={openedFilter === 'sort'}
          onPress={() => toggleFilter('sort')}
          options={['최신순', '인기순']}
          onSelect={val => {
            setSelectedSort(val === '최신순' ? 'latest' : 'popular');
            setOpenedFilter(null);
          }}
        />
      </View>

      {initialLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={primaryColors.pointColor} />
        </View>
      ) : posts.length > 0 ? (
        <View style={{ flex: 1 }}>
          <FeedScreen
            styles={styles}
            data={posts}
            onRefresh={onRefresh}
            refreshing={isRefreshing}
            onEndReached={onEndReached}
            ListFooterComponent={
              loading && !isRefreshing ? (
                <ActivityIndicator style={{ margin: 20 }} />
              ) : null
            }
          />
        </View>
      ) : (
        <NoResult searchText={searchQuery} />
      )}

      <Pressable
        style={styles.floatingButton}
        onPress={() => router.push('/write-post')}
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

    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isDark ? '#202020' : '#FCFCFC',
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
