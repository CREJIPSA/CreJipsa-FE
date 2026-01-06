import useThemedStyle from '@/app/hooks/use-themed-style';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
// 드롭다운 내부 옵션 컴포넌트
export default function DropdownInnerOption({ label, text, route }) {
  const { styles } = useThemedStyle(getStyles);
  const router = useRouter();

  return (
    <View style={styles.drawerInnerOption}>
      <Text style={styles.drawerInnerOptionText}>{text}</Text>
      <Pressable
        style={styles.drawerInnerOptionButton}
        onPress={() => {
          // 라벨에 따라 다른 화면으로 이동하도록 수정
          router.push('/storyboard/edit');
        }}
      >
        <Text style={styles.drawerInnerOptionButtonText}>
          {label === 'storyboard' ? '편집' : '이동'}
        </Text>
      </Pressable>
    </View>
  );
}

const getStyles = (isDark, primaryColors) => ({
  drawerInnerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  drawerInnerOptionText: {
    fontSize: 16,
    color: primaryColors.color,
  },
  drawerInnerOptionButton: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 100,
  },
  drawerInnerOptionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: isDark ? '#B7B7B7' : '#8A8A8A',
  },
});
