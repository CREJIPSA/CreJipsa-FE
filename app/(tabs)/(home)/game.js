import { View } from 'react-native';
import RealTimeTrend from '../../components/realtime-trend';
import useThemedStyle from '../../hooks/use-themed-style';

export default function Game() {
  const { styles } = useThemedStyle(getStyles);

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
