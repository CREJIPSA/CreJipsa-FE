import { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FilterComponent from './components/my/FilterComponent';
import PostItem from './components/my/PostItem';
import DUMMY_POSTS from './constants/my/DUMMY_POSTS';
import useThemedStyle from './hooks/use-themed-style';

export default function MyReplys() {
  const { styles } = useThemedStyle(getStyles);

  const renderPostItem = ({ item }) => {
    return <PostItem post={item} isMyReplys={true} />;
  };

  const [openedFilter, setOpenedFilter] = useState(null);

  const toggleFilter = filterName => {
    setOpenedFilter(openedFilter === filterName ? null : filterName);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>내 댓글함</Text>
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
      <FlatList
        style={styles.contentsListContainer}
        data={DUMMY_POSTS}
        renderItem={renderPostItem}
        keyExtractor={item => item.id.toString()}
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
