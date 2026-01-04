import DropdownInnerOption from '@/app/components/storyboard/dropdown-inner-option';
import StoryboardStorageData from '@/app/constants/storyboard/STORYBOARD_STORAGE';
import useThemedStyle from '@/app/hooks/use-themed-style';
import { ScrollView, View } from 'react-native';

export default function StoryboardStorage() {
  const { styles } = useThemedStyle(getStyles);

  return (
    <View style={styles.mainContainer}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 23, gap: 20 }}
      >
        {StoryboardStorageData.map((item, index) => (
          <DropdownInnerOption
            key={index}
            label="storyboard"
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
