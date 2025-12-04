import { View } from 'react-native';
import RealTimeTrend from '../../components/realtime-trend';
import useThemedStyle from '../../hooks/use-themed-style';

export default function DailyMeme() {
  const { styles } = useThemedStyle(getStyles);

  {
    /* 실시간 트렌드 더미 데이터  */
  }
  const tagAndTitles = [
    {
      tag: '일상/밈',
      title: '아이폰 16 pro',
    },
    {
      tag: '일상/밈',
      title: '듀 가나디',
    },
    {
      tag: '일상/밈',
      title: '쉐이칸샹',
    },
    {
      tag: '일상/밈',
      title: '오징어 게임',
    },
  ];

  return (
    <View style={styles.mainContainer}>
      {/* 실시간 트렌드 */}
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
