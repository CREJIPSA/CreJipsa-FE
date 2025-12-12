import { View } from 'react-native';
import RealTimeTrend from '../../components/realtime-trend';
import useThemedStyle from '../../hooks/use-themed-style';

export default function Sports() {
  const { styles } = useThemedStyle(getStyles);

  const rankTrends = ['마라톤', '야구', '축구', '농구'];

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
