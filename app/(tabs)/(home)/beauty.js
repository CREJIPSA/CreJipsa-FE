import { View } from 'react-native';
import RealTimeTrend from '../../components/realtime-trend';
import useThemedStyle from '../../hooks/use-themed-style';

export default function Beauty() {
  const { styles } = useThemedStyle(getStyles);

  const tagAndTitles = [
    {
      tag: '뷰티',
      title: '올리브영',
    },
    {
      tag: '뷰티',
      title: '롬앤',
    },
    {
      tag: '뷰티',
      title: '다이소 뷰티템',
    },
    {
      tag: '뷰티',
      title: '올영 블프',
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
