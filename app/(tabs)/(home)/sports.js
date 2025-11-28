import { View, useColorScheme } from 'react-native';
import RealTimeTrend from '../../components/realtime-trend';

export default function Sports() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = getStyles(isDark);

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
