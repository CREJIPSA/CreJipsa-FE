import useThemedStyle from '@/app/hooks/use-themed-style';
import CloseIcon from '@/assets/svgs/close.js';
import SearchIcon from '@/assets/svgs/home/search-icon.js';
import { Pressable, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function DrawerHeader({
  onClose,
  onFocusSearch,
  onBlurSearch,
  query,
  onChangeQuery,
  onSubmitEditing,
}) {
  const { styles, primaryColors } = useThemedStyle(getStyles);
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.drawerHeader, { paddingTop: insets.top }]}>
      <Pressable onPress={onClose}>
        <CloseIcon color={primaryColors.color} size={13} />
      </Pressable>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBox}
          placeholder="검색"
          placeholderTextColor="#959595"
          value={query}
          onChangeText={onChangeQuery}
          autoCapitalize="none"
          onFocus={() => {
            onFocusSearch();
          }}
          onBlur={() => {
            if (!query.trim()) {
              onBlurSearch();
            }
          }}
          returnKeyType="search"
          onSubmitEditing={onSubmitEditing}
        />
        <SearchIcon color="#141619" size={20} />
      </View>
    </View>
  );
}

const getStyles = (isDark, primaryColors) => ({
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: primaryColors.color,
    gap: 14,
  },
  searchContainer: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? '#FAFAFA' : '#E6E6E6',
    borderRadius: 100,
    paddingLeft: 13,
    paddingRight: 16,
  },
  searchBox: {
    flex: 1,
    minWidth: 0,
    color: '#141414',
    fontSize: 16,
  },
});
