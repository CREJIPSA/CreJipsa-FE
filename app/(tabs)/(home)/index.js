import { ScrollView, StyleSheet, Text, View } from 'react-native';
import RealTimeTrend from '../../components/realtime-trend';
import TrendKeywordCard from '../../components/trend-keyword-card';
import useThemedStyle from '../../hooks/use-themed-style';

export default function Home() {
  const { styles } = useThemedStyle(getStyles);

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
  const fieldData = [
    {
      field: '전체',
      icon: '🔥',
      data: [
        {
          title: '아이폰 16 pro',
          tag: '일상/밈',
        },
        {
          title: '듀 가나디',
          tag: '일상/밈',
        },
        {
          title: '쉐이칸샹',
          tag: '일상/밈',
        },
        {
          title: '퉁퉁퉁퉁퉁퉁퉁퉁퉁 사후르',
          tag: '일상/밈',
        },
      ],
    },
    {
      field: '일상/밈',
      icon: '😂',
      data: [
        {
          title: '샤넬 챌린지',
          tag: '일상/밈',
        },
        {
          title: '듀 가나디',
          tag: '일상/밈',
        },
        {
          title: '아이폰 16 pro',
          tag: '일상/밈',
        },
      ],
    },
    {
      field: '게임',
      icon: '🎮',
      data: [
        {
          title: '배틀그라운드',
          tag: '게임',
        },
        {
          title: '오버워치',
          tag: '게임',
        },
        {
          title: '롤',
          tag: '게임',
        },
      ],
    },
    {
      field: '패션',
      icon: '👗',
      data: [
        {
          title: '무신사',
          tag: '패션',
        },
        {
          title: '에이블리',
          tag: '패션',
        },
        {
          title: '블랙 프라이데이',
          tag: '패션',
        },
      ],
    },
    {
      field: '음악',
      icon: '🎵',
      data: [
        {
          title: '멜론',
          tag: '음악',
        },
        {
          title: '올데이프로젝트',
          tag: '음악',
        },
        {
          title: '화사',
          tag: '음악',
        },
      ],
    },
    {
      field: '반려동물',
      icon: '🐶',
      data: [
        {
          title: '고양이',
          tag: '반려동물',
        },
        {
          title: '강아지',
          tag: '반려동물',
        },
        {
          title: '킹율',
          tag: '반려동물',
        },
      ],
    },
    {
      field: '뷰티',
      icon: '💄',
      data: [
        {
          title: '올영 블프',
          tag: '뷰티',
        },
        {
          title: '롬앤',
          tag: '뷰티',
        },
        {
          title: '다이소 뷰티템',
          tag: '뷰티',
        },
      ],
    },
    {
      field: '스포츠',
      icon: '⚽',
      data: [
        {
          title: '마라톤',
          tag: '스포츠',
        },
        {
          title: '야구',
          tag: '스포츠',
        },
        {
          title: '축구',
          tag: '스포츠',
        },
      ],
    },
  ];

  return (
    <ScrollView style={styles.mainContainer}>
      {/* 실시간 트렌드 */}
      <RealTimeTrend tagAndTitles={tagAndTitles} />
      {/* 트렌드 리포트 */}
      <View style={styles.sectionHeader}>
        <Text style={styles.titleText}>트렌드 리포트</Text>
      </View>
      {fieldData.map(fieldData => (
        <View key={fieldData.field}>
          <View style={styles.fieldSectionHeader}>
            <Text style={styles.fieldText}>
              이번주{' '}
              <Text style={{ fontWeight: 'bold' }}>{fieldData.field}</Text>{' '}
              분야의 트렌드 추천
            </Text>
          </View>
          {/* FlexWrap Layout */}
          <View style={styles.trendReportCardContainer}>
            {/* 트렌드 키워드 카드 매핑 */}
            {fieldData.data.map((data, index) => (
              <TrendKeywordCard key={index} icon={fieldData.icon} data={data} />
            ))}
          </View>
        </View>
      ))}
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
    trendReportCardContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
      paddingHorizontal: 16,
      marginTop: 20,
    },
  });
};
