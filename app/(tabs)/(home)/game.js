import { View, useColorScheme } from 'react-native';
import RealTimeTrend from '../../components/realtime-trend';

export default function Game() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = getStyles(isDark);

  const tagAndTitles = [
    {
      tag: '게임',
      title: '배틀 그라운드',
    },
    {
      tag: '게임',
      title: '롤',
    },
    {
      tag: '게임',
      title: '오버워치',
    },
    {
      tag: '게임',
      title: 'RPG',
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
