import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthContext } from './_layout';
import { fetchMyPosts } from './api/my';
import FilterComponent from './components/my/FilterComponent';
import PostItem from './components/my/PostItem';
import {
  COMMUNITY_FIELDS,
  getCommunityFieldLabels,
  getFieldKeyByLabel,
} from './constants/common/COMMUNITY_FIELDS';
import useThemedStyle from './hooks/use-themed-style';

export default function MyPosts() {
  const { styles } = useThemedStyle(getStyles);
  const { accessToken } = useContext(AuthContext);

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);

  const [selectedField, setSelectedField] = useState('ALL');
  const [selectedSort, setSelectedSort] = useState('latest');
  const [openedFilter, setOpenedFilter] = useState(null);

  const handleSelectFilter = label => {
    const key = getFieldKeyByLabel(label);
    if (key) {
      setSelectedField(key);
    }
    setOpenedFilter(null);
  };

  const isFetching = useRef(false);

  const onEndReachedDuringMomentum = useRef(false);

  const loadPosts = useCallback(
    async (targetPage, isFresh = false) => {
      console.log(targetPage);
      if (isFetching.current) {
        return;
      }

      if (!isFresh && targetPage === 0) {
        return;
      }

      try {
        isFetching.current = true;
        setLoading(true);

        const params = {
          page: targetPage,
          size: 10,
          field: selectedField === 'ALL' ? null : selectedField,
          sort: selectedSort,
        };

        const data = await fetchMyPosts(params, accessToken);

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
        isFetching.current = false;
        setLoading(false);
        setIsRefreshing(false);
      }
    },
    [selectedField, selectedSort, accessToken],
  );

  useEffect(() => {
    setPosts([]);
    setPage(0);
    setHasNextPage(true);
    loadPosts(0, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedField, selectedSort]);

  const onRefresh = () => {
    setIsRefreshing(true);
    loadPosts(0, true);
  };

  const onEndReached = () => {
    if (!loading && hasNextPage && !onEndReachedDuringMomentum.current) {
      setPage(prev => {
        const nextPage = prev + 1;
        loadPosts(nextPage);
        return nextPage;
      });
      onEndReachedDuringMomentum.current = true;
    }
  };

  const toggleFilter = filterName => {
    setOpenedFilter(openedFilter === filterName ? null : filterName);
  };

  const handleDeleteSuccess = communityId => {
    // 삭제된 게시글을 목록에서 제거
    setPosts(prev => prev.filter(post => post.communityId !== communityId));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>내가 쓴 글</Text>
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

      <FlatList
        style={styles.contentsListContainer}
        data={posts}
        renderItem={({ item }) => (
          <PostItem post={item} onDeleteSuccess={handleDeleteSuccess} />
        )}
        keyExtractor={item => item.communityId.toString()}
        onRefresh={onRefresh}
        refreshing={isRefreshing}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.2}
        onMomentumScrollBegin={() => {
          onEndReachedDuringMomentum.current = false;
        }}
        ListFooterComponent={
          loading && !isRefreshing ? (
            <ActivityIndicator style={{ margin: 20 }} />
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const getStyles = (isDark, primaryColors) => {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: primaryColors.background,
    },
    headerContainer: {
      paddingVertical: 10,
      paddingLeft: 16,
      paddingRight: 10,
    },
    headerText: {
      fontSize: 20,
      fontWeight: '700',
      color: primaryColors.color,
    },
    filterContainer: {
      marginTop: 16,
      marginLeft: 19,
      flexDirection: 'row',
      gap: 16,
      zIndex: 100,
    },
    contentsListContainer: {
      marginTop: 16,
      marginHorizontal: 18,
    },
  });
};
