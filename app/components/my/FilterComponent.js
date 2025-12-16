import useThemedStyle from '@/app/hooks/use-themed-style';
import FilterIcon from '@/assets/svgs/my/filter-icon';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function FilterComponent({ text }) {
  const { isDark, styles } = useThemedStyle(getStyles);

  const [isOpened, setIsOpened] = useState(false);
  const options = ['전체', '일반', '팁', '같이 촬영해요'];

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
      <FilterIcon isDark={isDark} />
    </View>
  );
}

const getStyles = (isDark, primaryColors) => {
  const color = isDark ? '#CCFF66' : '#293314';

  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      borderColor: color,
      backgroundColor: primaryColors.background,
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderWidth: 1,
      gap: 10,
      borderRadius: 20,
      alignItems: 'center',
    },

    text: {
      color: color,
      fontSize: 14,
      fontWeight: 500,
    },
  });
};
