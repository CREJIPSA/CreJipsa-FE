import useThemedStyle from '@/app/hooks/use-themed-style';
import { StyleSheet, Text, View } from 'react-native';

export default function CategoryBadge({ text }) {
  const { styles } = useThemedStyle(getStyles);

  return (
    <View style={styles.badgeContainer}>
      <Text style={styles.badgeText}>{text}</Text>
    </View>
  );
}

const getStyles = isDark => {
  const pointColor = isDark ? '#CCFF66' : '#141414';

  return StyleSheet.create({
    badgeContainer: {
      borderWidth: 1,
      borderColor: pointColor,
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 20,
      backgroundColor: isDark ? 'transparent' : '#B8E65C',
    },

    badgeText: {
      fontSize: 14,
      lineHeight: 14,
      color: pointColor,
      fontWeight: '500',
    },
  });
};
