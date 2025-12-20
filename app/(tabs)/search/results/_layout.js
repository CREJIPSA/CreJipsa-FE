import { Ionicons } from '@expo/vector-icons';
import { Slot, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SearchBox from '../../../components/search/search-box';
import useThemedStyle from '../../../hooks/use-themed-style';

export default function SearchResultLayout() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { styles, isDark } = useThemedStyle(getStyles);

  const { query } = useLocalSearchParams();

  const [searchKeyword, setSearchKeyword] = useState(query);

  useEffect(() => {
    setSearchKeyword(query);
  }, [query]);

  return (
    <View style={[styles.mainContainer, { paddingTop: insets.top }]}>
      <View style={styles.searchHeader}>
        <Pressable
          onPress={() => {
            router.back();
          }}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={isDark ? '#FAFAFA' : '#1B1B1B'}
          />
        </Pressable>
        <SearchBox
          searchKeyword={searchKeyword}
          setSearchKeyword={setSearchKeyword}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Slot />
      </View>
    </View>
  );
}

const getStyles = (isDark, primaryColor) => ({
  mainContainer: {
    flex: 1,
    backgroundColor: primaryColor.background,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 22,
    paddingLeft: 16,
    paddingRight: 27,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#A0A0A0',
  },
});
