import useThemedStyle from '@/app/hooks/use-themed-style';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import RealTimeTrend from '../../components/realtime-trend';
import TrendKeywordCard from '../../components/trend-keyword-card';

export default function Home() {
  const { isDark, styles } = useThemedStyle(getStyles);

  {
    /* 실시간 트렌드 */
  }
  {
    /* 실시간 트렌드 더미 데이터  */
  }
  const tagAndTitles = [
    {
      tag: '음악',
      title: 'AOA 짧은 치마',
    },
    {
      tag: '음악',
      title: '샤넬 챌린지',
    },
    {
      tag: '게임',
      title: '배틀 그라운드',
    },
    {
      tag: '뷰티',
      title: '올리브영',
    },
  ];

  {
    /* 트렌드 리포트 */
  }
  {
    /* 트렌드 키워드 카드 더미 데이터 */
  }
  const trendData = [
    {
      items: [
        { tag: '음악', title: 'FaSHioN' },
        { tag: '게임', title: '페이커' },
        { tag: '음악', title: '샤이니' },
        { tag: '반려동물', title: '토끼' },
        { tag: '일상/밈', title: '아이폰 16 Pro' },
        { tag: '음악', title: 'AOA 짧은 치마' },
        { tag: '일상/밈', title: '졸업전시' },
        { tag: '뷰티', title: '올영세일' },
        { tag: '일상/밈', title: '샤넬챌린지' },
        { tag: '패션', title: '지방시' },
      ],
    },
    {
      items: {
        tag: '일상/밈',
        title: [
          '느좋카',
          '하룰라라',
          '각할모',
          '왼얼사',
          '듀 가나디',
          '붐따',
          '너 정말 핵심을 찔렀어',
          '듀벅듀벅',
          '칠가이',
          '챌린지',
        ],
      },
    },
    {
      items: {
        tag: '게임',
        title: [
          '리그오브레전드',
          '페이커',
          '메이플스토리',
          '롤드컵',
          '배틀그라운드',
          '마인크래프트',
          '로블록스',
          '구마유시',
          '오버워치',
          '카트라이더',
        ],
      },
    },
  ];

  const normalizedTrendData = section => {
    // 전체 트렌드 추천
    if (Array.isArray(section.items)) {
      return section.items;
    }
    // 분야별 트렌드 추천
    return section.items.title.map(t => ({ tag: section.items.tag, title: t }));
  };

  // 섹션 제목
  const getSectionTitle = section => {
    const { items } = section;
    if (Array.isArray(items)) {
      return '전체';
    }
    return items.tag;
  };

  // 스크롤뷰 데이터 다섯 개씩 렌더링
  const splitIntoTwoRows = items => {
    const firstRow = items.slice(0, 5);
    const secondRow = items.slice(5, 10);
    return { firstRow, secondRow };
  };

  return (
    <ScrollView style={styles.mainContainer}>
      {/* 실시간 트렌드 */}
      <RealTimeTrend tagAndTitles={tagAndTitles} />
      {/* 트렌드 리포트 */}
      <View style={styles.sectionHeader}>
        <Text style={styles.titleText}>트렌드 리포트</Text>
      </View>
      {trendData.map((section, sectionIndex) => {
        const showTag = Array.isArray(section.items);
        const { firstRow, secondRow } = splitIntoTwoRows(
          normalizedTrendData(section),
        );
        return (
          <View key={sectionIndex}>
            {/* 섹션 헤더 */}
            <View style={styles.fieldSectionHeader}>
              <Text style={styles.fieldText}>
                이번주{' '}
                <Text
                  style={{
                    fontWeight: 'bold',
                    color: isDark ? '#CCFF66' : '#C6E945',
                  }}
                >
                  {getSectionTitle(section)}
                </Text>{' '}
                분야의 트렌드 추천
              </Text>
            </View>
            <View style={styles.trendRecommendContainer}>
              {/* 첫 번째 스크롤뷰 */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.trendKeywordCardContainer}
              >
                {firstRow.map((item, index) => (
                  <TrendKeywordCard
                    key={index}
                    tag={item.tag}
                    title={item.title}
                    showTag={showTag} // 태그 표시 여부
                  />
                ))}
              </ScrollView>
              {/* 두 번째 스크롤뷰 */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.trendKeywordCardContainer}
              >
                {secondRow.map((item, index) => (
                  <TrendKeywordCard
                    key={index}
                    tag={item.tag}
                    title={item.title}
                    showTag={showTag} // 태그 표시 여부
                  />
                ))}
              </ScrollView>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

const getStyles = isDark => {
  const colors = {
    background: isDark ? '#202020' : '#FAFAFA',
    text: isDark ? '#FAFAFA' : '#141414',
  };

  return StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: colors.background,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingTop: 30,
      marginBottom: 20,
    },
    titleText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
    },
    lastUpdateText: {
      fontSize: 12,
      color: isDark ? '#D3D3D3' : '#666',
      textAlign: 'right',
    },
    trendCardTopContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      paddingHorizontal: 16,
      position: 'relative',
    },
    rank4TrendCard: {
      position: 'absolute',
      right: 16,
      borderRadius: 30,
    },
    trendCardBottomContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      paddingHorizontal: 16,
      marginTop: 15,
      marginBottom: 40,
      position: 'relative',
    },
    rank3TrendCard: {
      position: 'absolute',
      right: 16,
    },
    fieldSectionHeader: {
      paddingHorizontal: 16,
      paddingTop: 20,
    },
    fieldText: {
      fontSize: 20,
      color: colors.text,
    },
    trendRecommendContainer: {
      marginTop: 20,
      marginBottom: 50,
      gap: 16,
    },
    trendKeywordCardContainer: {
      paddingLeft: 16,
    },
  });
};
