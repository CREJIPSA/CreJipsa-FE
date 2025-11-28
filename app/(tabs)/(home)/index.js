import { format } from 'date-fns';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';

import TrendKeywordCard from '@/app/components/trend-keyword-card';
import RealTimeTrendCard, {
  getFirstTrendCardPath,
  getFourthTrendCardPath,
  getSecondTrendCardPath,
  getThirdTrendCardPath,
} from '../../components/realtime-trendcard';

export default function Home() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = getStyles(isDark);

  // (임시) 현재 시간을 마지막 업데이트로 설정
  const lastUpdateTime = format(new Date(), 'yyyy년 MM월 dd일 HH:mm');

  {
    /* 실시간 트렌드 */
  }
  const realTimeTrendData = [
    // 임의
    {
      rank: 1,
      tag: '음악',
      title: 'AOA 짧은 치마',
      width: Dimensions.get('window').width * 0.75,
      height: Dimensions.get('window').height * 0.43,
      path: getFirstTrendCardPath(
        Dimensions.get('window').width * 0.75,
        Dimensions.get('window').height * 0.43,
      ),
      imageUrl: 'trendRank1Image',
    },
    {
      rank: 4,
      tag: '음악',
      title: '샤넬 챌린지',
      width: Dimensions.get('window').width * 0.29,
      height: Dimensions.get('window').height * 0.22,
      path: getFourthTrendCardPath(
        Dimensions.get('window').width * 0.29,
        Dimensions.get('window').height * 0.22,
      ),
      imageUrl: 'trendRank4Image',
    },
    {
      rank: 2,
      tag: '게임',
      title: '배틀 그라운드',
      width: Dimensions.get('window').width * 0.6,
      height: Dimensions.get('window').height * 0.2,
      path: getSecondTrendCardPath(
        Dimensions.get('window').width * 0.6,
        Dimensions.get('window').height * 0.2,
      ),
      imageUrl: 'trendRank2Image',
    },
    {
      rank: 3,
      tag: '뷰티',
      title: '올리브영',
      width: Dimensions.get('window').width * 0.44,
      height: Dimensions.get('window').height * 0.2,
      path: getThirdTrendCardPath(
        Dimensions.get('window').width * 0.44,
        Dimensions.get('window').height * 0.2,
      ),
      imageUrl: 'trendRank3Image',
    },
  ];

  const renderCard = c => {
    return (
      <RealTimeTrendCard
        key={c.rank}
        width={c.width}
        height={c.height}
        path={c.path}
        imageUrl={c.imageUrl}
        contentStyle={c.contentStyle}
      >
        <View style={{ flex: 1, position: 'relative', height: c.height }}>
          <View
            style={
              c.rank === 3 && {
                position: 'absolute',
                left: c.width * 0.33,
              }
            }
          >
            <Text style={styles.rankText}>{c.rank}위</Text>
            {c.tag && (
              <View style={styles.tag}>
                <Text style={styles.tagText}>#{c.tag}</Text>
              </View>
            )}
          </View>
          <View
            style={{
              position: 'absolute',
              bottom: 20,
              left: 20,
              width: c.width - 30,
            }}
          >
            <Text
              style={styles.trendCardTitleText}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {c.title}
            </Text>
          </View>
        </View>
      </RealTimeTrendCard>
    );
  };

  {
    /* 트렌드 리포트 */
  }
  {
    /* 트렌드 키워드 카드 데이터 */
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
      <View style={styles.sectionHeader}>
        <Text style={styles.titleText}>실시간 트렌드</Text>
        <Text style={styles.lastUpdateText}>
          마지막 업데이트{'\n'}
          {lastUpdateTime}
        </Text>
      </View>
      <View style={{ justifyContent: 'flex-end' }}>
        <View style={styles.trendCardTopContainer}>
          {renderCard(realTimeTrendData[0])}
          <View style={styles.rank4TrendCard}>
            {renderCard(realTimeTrendData[1])}
          </View>
        </View>
        <View style={styles.trendCardBottomContainer}>
          {renderCard(realTimeTrendData[2])}
          <View style={styles.rank3TrendCard}>
            {renderCard(realTimeTrendData[3])}
          </View>
        </View>
      </View>
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
    rankText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#141414',
      paddingTop: 20,
      paddingLeft: 25,
    },
    tag: {
      marginTop: 8,
      marginLeft: 20,
      backgroundColor: '#141414',
      padding: 8,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    tagText: {
      fontSize: 16,
      color: '#FAFAFA',
    },
    trendCardTitleText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#141414',
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
