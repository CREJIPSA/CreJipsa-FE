import useThemedStyle from '@/app/hooks/use-themed-style';
import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function StoryboardStorageLayout() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { styles, primaryColors } = useThemedStyle(getStyles);

  const pathname = usePathname();

  const titleMap = {
    '/storyboard/storage': '스토리보드 보관함',
    '/storyboard/storage/chatting': '채팅 보관함',
  };

  const title = titleMap[pathname];

  return (
    <View style={[styles.mainContainer, { paddingTop: insets.top }]}>
      <View style={styles.headerContainer}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={primaryColors.color} />
        </Pressable>
        <Text style={styles.headerText}>{title}</Text>
      </View>
    </View>
  );
}

const getStyles = (isDark, primaryColors) => ({
  mainContainer: {
    flex: 1,
    backgroundColor: primaryColors.background,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderBottomWidth: 0.5,
    borderBottomColor: '#A0A0A0',
  },
  headerText: {
    fontSize: 18,
    color: primaryColors.color,
    marginLeft: 22,
  },
});
