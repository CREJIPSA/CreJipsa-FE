import { Pressable, Text } from 'react-native';
import DeleteIcon from '../../../assets/svgs/delete.svg';

export default function MyInterestTag({ label, onRemove, isDark }) {
  const styles = getStyles(isDark);

  return (
    <Pressable style={styles.tag} onPress={onRemove}>
      <Text style={styles.tagText}>{label}</Text>
      <DeleteIcon width={12} height={12} />
    </Pressable>
  );
}

const getStyles = isDark => {
  const colors = {
    textColor: isDark ? 'white' : 'black',
    backgroundColor: isDark ? '#CCFF66' : '#B8E65C',
  };

  return {
    tag: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 20,
      backgroundColor: colors.backgroundColor,
    },
    tagText: {
      fontSize: 14,
      fontWeight: '500',
    },
  };
};
