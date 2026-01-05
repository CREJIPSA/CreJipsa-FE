import DropdownInnerOption from '@/app/components/storyboard/dropdown-inner-option';
import ChattingStorageData from '@/app/constants/storyboard/CHATTING_STORAGE';
import useThemedStyle from '@/app/hooks/use-themed-style';
import { ScrollView, View } from 'react-native';

export default function ChattingStorage() {
  const { styles } = useThemedStyle(getStyles);

  return (
    <View style={styles.mainContainer}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 23, gap: 20 }}
      >
        {ChattingStorageData.map(item => (
          <DropdownInnerOption
            key={item.id}
            label="chatting"
            text={item.text}
            route={item.route}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const getStyles = (isDark, primaryColors) => ({
  mainContainer: {
    flex: 1,
    backgroundColor: primaryColors.background,
    paddingHorizontal: 16,
  },
});
