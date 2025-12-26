import { Text, View } from 'react-native';
import useThemedStyle from '../hooks/use-themed-style';

export default function Chip({ label }) {
  const { styles } = useThemedStyle(getStyles);

  return (
    <View style={styles.chip}>
      <Text style={styles.chipText}>{label}</Text>
    </View>
  );
}

const getStyles = (isDark, primaryColor) => ({
  chip: {
    backgroundColor: isDark ? '#454545' : '#D3D3D3',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  chipText: {
    fontSize: 14,
    color: primaryColor.color,
  },
});
