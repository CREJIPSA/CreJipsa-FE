import SearchIcon from '@/assets/svgs/home/search-icon';
import { router } from 'expo-router';
import { Pressable, TextInput, View } from 'react-native';
import useThemedStyle from '../../hooks/use-themed-style';

export default function SearchBox({ searchKeyword, setSearchKeyword }) {
  const { styles } = useThemedStyle(getStyles);

  return (
    <View style={styles.searchBoxContainer}>
      <TextInput
        style={styles.searchBox}
        value={searchKeyword}
        onChangeText={setSearchKeyword}
        placeholder="검색"
        placeholderTextColor={'#949494'}
        autoCapitalize="none"
        autoCorrect={false}
        spellCheck={false}
        returnKeyType="search"
        onSubmitEditing={() => {
          router.navigate({
            pathname: '/search/results',
            params: { query: searchKeyword },
          });
        }}
      />
      <Pressable
        onPress={() => {
          router.navigate({
            pathname: '/search/results',
            params: { query: searchKeyword },
          });
        }}
      >
        <SearchIcon size={20} color="#141619" />
      </Pressable>
    </View>
  );
}

const getStyles = isDark => ({
  searchBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '85%',
    backgroundColor: isDark ? '#FAFAFA' : '#E6E6E6',
    borderRadius: 100,
    paddingHorizontal: 16,
  },
  searchBox: {
    flex: 1,
    height: 40,
    fontSize: 18,
    paddingVertical: 8,
  },
});
