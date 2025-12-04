import { View } from 'react-native';
import RealTimeTrend from '../../components/realtime-trend';
import useThemedStyle from '../../hooks/use-themed-style';

export default function Music() {
  const { styles } = useThemedStyle(getStyles);

  const tagAndTitles = [
    {
      tag: '음악',
      title: '멜론',
    },
    {
      tag: '음악',
      title: '올데이프로젝트',
    },
    {
      tag: '음악',
      title: '화사',
    },
    {
      tag: '음악',
      title: '아이브',
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
