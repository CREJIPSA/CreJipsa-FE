import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FilterComponent from './components/my/FilterComponent';
import PostItem from './components/my/PostItem';
import DUMMY_POSTS from './constants/my/DUMMY_POSTS';
import useThemedStyle from './hooks/use-themed-style';

export default function MyLikes() {
  const { styles } = useThemedStyle(getStyles);

  const renderPostItem = ({ item }) => {
    return <PostItem post={item} />;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>내 좋아요함</Text>
      </View>
      <View style={styles.filterContainer}>
        <FilterComponent text={'전체'} />
        <FilterComponent text={'최신순'} />
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
      gap: 20,
    },

    contentsListContainer: {
      marginTop: 16,
      marginHorizontal: 18,
    },
  });
};
