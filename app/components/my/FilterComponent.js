import useThemedStyle from '@/app/hooks/use-themed-style';
import FilterIcon from '@/assets/svgs/my/filter-icon';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function FilterComponent({ text, isOpen, onPress, options }) {
  const { isDark, styles } = useThemedStyle(getStyles);

  return (
    <View>
      <Pressable style={styles.container} onPress={onPress}>
        <Text style={styles.text}>{text}</Text>
        <FilterIcon isDark={isDark} isUp={isOpen} />
      </Pressable>

      {isOpen && (
        <View style={styles.dropdownContainer}>
          {options.map((option, index) => (
            <Pressable key={index} style={styles.optionItem} onPress={onPress}>
              <Text style={styles.optionText}>{option}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const getStyles = (isDark, primaryColors) => {
  const color = isDark ? '#CCFF66' : '#293314';

  return StyleSheet.create({
    wrapper: {
      position: 'relative',
      zIndex: 10,
    },
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

    dropdownContainer: {
      position: 'absolute',
      top: 35,
      left: 0,
      minWidth: 106,
      minHeight: 76,
      backgroundColor: isDark ? '#323232' : '#D9D9D9',
      borderRadius: 10,
      elevation: 5,
    },

    optionItem: {
      paddingTop: 4,
      paddingBottom: 4,
      paddingLeft: 12,
      flexDirection: 'row',
      gap: 10,
    },

    optionText: {
      color: primaryColors.color,
      fontSize: 14,
    },
  });
};
