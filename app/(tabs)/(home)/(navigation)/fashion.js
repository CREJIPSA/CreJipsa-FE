import RealTimeTrend from '@/app/components/realtime-trend';
import { View } from 'react-native';
import useThemedStyle from '../../../hooks/use-themed-style';

export default function Fashion() {
  const { styles } = useThemedStyle(getStyles);

  const rankTrends = ['무신사', '에이블리', '블랙 프라이데이', '지그재그'];

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
