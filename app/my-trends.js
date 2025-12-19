import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TrendKeywordCard from './components/trend-keyword-card';
import useThemedStyle from './hooks/use-themed-style';

export default function MyTrends() {
  const { styles } = useThemedStyle(getStyles);

  const myTrendsDummyData = [
    {
      date: '25.01.05',
      items: [
        { id: 1, title: 'FaSHioN', tag: '음악' },
        { id: 2, title: '페이커', tag: '게임' },
        { id: 3, title: '샤이니', tag: '음악' },
        { id: 4, title: '토끼', tag: '반려동물' },
        { id: 5, title: '고프코어', tag: '패션' },
      ],
    },
    {
      date: '25.01.04',
      items: [
        { id: 6, title: 'AOA 짧은 치마', tag: '음악' },
        { id: 7, title: '졸업전시', tag: '일상/밈' },
        { id: 8, title: '올영세일', tag: '뷰티' },
        { id: 9, title: '겨울 패션 추천', tag: '패션' },
        { id: 10, title: 'F1', tag: '스포츠' },
      ],
    },
    {
      date: '25.01.03',
      items: [
        { id: 11, title: '두바이쫀득쿠키', tag: '일상/밈' },
        { id: 12, title: '슬릭백 챌린지', tag: '음악' },
        { id: 13, title: '도쿄 브이로그', tag: '일상/밈' },
      ],
    },
    {
      date: '25.01.02',
      items: [
        { id: 14, title: '두바이쫀득쿠키', tag: '일상/밈' },
        { id: 15, title: '슬릭백 챌린지', tag: '음악' },
        { id: 16, title: '도쿄 브이로그', tag: '일상/밈' },
      ],
    },
  ];

  return (
    <SafeAreaView
      style={styles.safeArea}
      stickyHeader={[1]}
      showsVerticalScrollIndicator={false}
    >
      <ScrollView
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>내 트렌드함</Text>
        </View>
        <View style={styles.trendsContainer}>
          {myTrendsDummyData.map(group => (
            <View key={group.date} style={styles.dayGroup}>
              <Text style={styles.dateText}>{group.date}</Text>
              <View style={styles.cardGroup}>
                {group.items.map(item => (
                  <TrendKeywordCard
                    key={item.id}
                    tag={item.tag}
                    title={item.title}
                    showTag={true}
                  />
                ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (isDark, primaryColors) => {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: primaryColors.background,
    },

    headerContainer: {
      paddingVertical: 10,
      paddingLeft: 16,
      paddingRight: 10,
      backgroundColor: primaryColors.background,
    },

    headerText: {
      fontSize: 20,
      fontWeight: 700,
      color: primaryColors.color,
    },

    trendsContainer: {
      marginTop: 60,
      marginLeft: 16,
      marginRight: 30,
      flexDirection: 'column',
      gap: 40,
    },

    dayGroup: {
      flexDirection: 'column',
      gap: 24,
    },

    dateText: {
      fontSize: 14,
      fontWeight: 500,
      height: 20,
      lineHeight: 20,
      color: primaryColors.color,
    },

    cardGroup: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      rowGap: 16,
    },
  });
};
