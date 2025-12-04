import { StyleSheet, Text, View } from 'react-native';
import useThemedStyle from '../hooks/use-themed-style';

const TrendKeywordCard = ({ icon, data }) => {
  const { styles } = useThemedStyle(getStyles);

  return (
    <View style={styles.trendKeywordCard}>
      <View style={styles.trendKeywordIcon}>
        {/* 추후 아이콘 경로 받도록 변경 */}
        <Text style={{ fontSize: 40 }}>{icon}</Text>
      </View>
      <View style={styles.trendKeywordContents}>
        {/* 키워드 */}
        <Text style={styles.trendKeywordTitleText}>{data.title}</Text>
        {/* 태그 */}
        <View style={styles.trendKeywordTag}>
          <Text style={styles.trendKeywordTagText}>#{data.tag}</Text>
        </View>
      </View>
    </View>
  );
};
export default TrendKeywordCard;

const getStyles = isDark => {
  return StyleSheet.create({
    trendKeywordCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? '#FAFAFA' : '#FAFFF0',
      borderRadius: 10,
      paddingVertical: 14,
      paddingHorizontal: 12,
      gap: 16,
      marginRight: 8,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: isDark ? '#141414' : '#D3D3D3',
    },
    trendKeywordIcon: {
      width: 60,
      height: 60,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isDark ? '#141414' : '#F4F2F2',
      borderRadius: 8,
    },
    trendKeywordContents: {
      gap: 6,
      alignItems: 'flex-start',
    },
    trendKeywordTitleText: {
      fontSize: 18,
      color: isDark ? '#141414' : '#000',
    },
    trendKeywordTag: {
      paddingVertical: 5,
      paddingHorizontal: 10,
      backgroundColor: isDark ? '#202020' : '#A3CC52',
      borderRadius: 20,
    },
    trendKeywordTagText: {
      fontSize: 14,
      color: isDark ? '#FAFAFA' : '#FAFFF0',
    },
  });
};
