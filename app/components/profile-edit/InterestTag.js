import { Pressable, Text } from 'react-native';

export default function InterestTag({ label, onClick, isDark }) {
  const styles = getStyles(isDark);

  return (
    <Pressable style={styles.tag} onPress={onClick}>
      <Text style={styles.tagText}>{label}</Text>
    </Pressable>
  );
}

const getStyles = isDark => {
  const colors = {
    basicColor: isDark ? 'white' : 'black',
  };

  return {
    tag: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.basicColor,
    },
    tagText: {
      fontSize: 14,
      fontWeight: '500',
    },
  };
};
