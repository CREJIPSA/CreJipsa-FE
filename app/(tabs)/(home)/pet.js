import { View, useColorScheme } from 'react-native';
import RealTimeTrend from '../../components/realtime-trend';

export default function Pet() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = getStyles(isDark);

  const tagAndTitles = [
    {
      tag: '반려동물',
      title: '고양이',
    },
    {
      tag: '반려동물',
      title: '고양이',
    },
    {
      tag: '반려동물',
      title: '킹율',
    },
    {
      tag: '반려동물',
      title: '우유',
    },
  ];

  return (
    <View style={styles.mainContainer}>
      <RealTimeTrend tagAndTitles={tagAndTitles} />
    </View>
  );
}

const getStyles = isDark => ({
  mainContainer: {
    flex: 1,
    backgroundColor: isDark ? '#202020' : '#FAFAFA',
  },
});
