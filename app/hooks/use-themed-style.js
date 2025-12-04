import { useColorScheme } from 'react-native';

const useThemedStyle = getStyles => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = getStyles(isDark);

  return { isDark, styles };
};

export default useThemedStyle;
