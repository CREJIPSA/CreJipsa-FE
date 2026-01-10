import SearchIcon from '@/assets/svgs/feed/search-icon';
import { Pressable, TextInput, View } from 'react-native';

export default function SearchBar({
  value,
  onChangeText,
  onSubmit,
  styles,
  searchIconColor,
}) {
  return (
    <View style={styles.inputWrapper}>
      <TextInput
        style={styles.searchInput}
        onChangeText={onChangeText}
        value={value}
        placeholder="검색어를 입력해주세요."
        placeholderTextColor="#959595"
        autoCapitalize="none"
        autoCorrect={false}
        onSubmitEditing={onSubmit}
        returnKeyType="search"
      />
      <View style={styles.searchIconContainer}>
        <Pressable onPress={onSubmit}>
          <SearchIcon color={searchIconColor} />
        </Pressable>
      </View>
    </View>
  );
}
