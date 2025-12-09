import { View } from 'react-native';
import RealTimeTrend from '../../components/realtime-trend';
import useThemedStyle from '../../hooks/use-themed-style';

export default function Pet() {
  const { styles } = useThemedStyle(getStyles);

  const rankTrends = ['고양이', '강아지', '킹율', '우유'];

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
