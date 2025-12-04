import { View } from 'react-native';
import RealTimeTrend from '../../components/realtime-trend';
import useThemedStyle from '../../hooks/use-themed-style';

export default function Sports() {
  const { styles } = useThemedStyle(getStyles);

  const tagAndTitles = [
    {
      tag: '스포츠',
      title: '마라톤',
    },
    {
      tag: '스포츠',
      title: '야구',
    },
    {
      tag: '스포츠',
      title: '축구',
    },
    {
      tag: '스포츠',
      title: '농구',
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
