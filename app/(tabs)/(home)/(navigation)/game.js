import { View } from 'react-native';
import RealTimeTrend from '../../../components/realtime-trend';
import useThemedStyle from '../../../hooks/use-themed-style';

export default function Game() {
  const { styles } = useThemedStyle(getStyles);

  const rankTrends = ['배틀 그라운드', '롤', '오버워치', 'RPG'];

  return (
    <View style={styles.mainContainer}>
      <RealTimeTrend rankTrends={rankTrends} />
    </View>
  );
}

const getStyles = isDark => ({
  mainContainer: {
    flex: 1,
    backgroundColor: isDark ? '#202020' : '#FAFAFA',
  },
});
