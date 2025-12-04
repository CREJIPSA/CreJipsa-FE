import { View } from 'react-native';
import RealTimeTrend from '../../components/realtime-trend';
import useThemedStyle from '../../hooks/use-themed-style';

export default function Pet() {
  const { styles } = useThemedStyle(getStyles);

  const tagAndTitles = [
    {
      tag: '반려동물',
      title: '고양이',
    },
    {
      tag: '반려동물',
      title: '고양이',
    },
    {
      tag: '반려동물',
      title: '킹율',
    },
    {
      tag: '반려동물',
      title: '우유',
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
