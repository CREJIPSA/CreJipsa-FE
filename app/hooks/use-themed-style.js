import { useColorScheme } from 'react-native';

const useThemedStyle = getStyles => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const primaryColors = {
    background: isDark ? '#202020' : '#FCFCFC',
    color: isDark ? '#FAFAFA' : '#141414',
    pointColor: isDark ? '#CCFF66' : '#B8E65C',
    iconPrimaryColor: isDark ? '#323232' : '#141414', // svg 내부 아이콘 속성 색상
  };

  const styles = getStyles(isDark, primaryColors);

  return { isDark, styles, primaryColors };
};

export default useThemedStyle;
