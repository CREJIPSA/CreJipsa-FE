import RealTimeTrend from '@/app/components/realtime-trend';
import { View, useColorScheme } from 'react-native';

export default function Fashion() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = getStyles(isDark);

  const tagAndTitles = [
    {
      tag: '패션',
      title: '무신사',
    },
    {
      tag: '패션',
      title: '에이블리',
    },
    {
      tag: '패션',
      title: '블랙 프라이데이',
    },
    {
      tag: '패션',
      title: '지그재그',
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
