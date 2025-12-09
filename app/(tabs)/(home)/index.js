import useThemedStyle from '@/app/hooks/use-themed-style';
import Comments from '@/assets/svgs/feed/comment.js';
import Likes from '@/assets/svgs/feed/like.js';
import { LinearGradient } from 'expo-linear-gradient';
import { Fragment } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import RealTimeTrend from '../../components/realtime-trend';
import TrendKeywordCard from '../../components/trend-keyword-card';

export default function Home() {
  const { isDark, styles } = useThemedStyle(getStyles);

  // 실시간 트렌드 더미 데이터
  const rankTrends = [
    'AOA 짧은 치마',
    '배틀 그라운드',
    '올영 세일',
    '샤넬 챌린지',
  ];

  // 분야별 트렌드 추천 더미 데이터
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

  // 최근 피드 더미 데이터
  const latestFeeds = [
    { title: '어도비 프리미어 도와주세요', likes: 120, comments: 45 },
    { title: '프리미어 영상 미디어가 이상해요', likes: 85, comments: 30 },
    { title: '혹시 프리미어 쓰시는 분 계신가요?', likes: 60, comments: 15 },
    { title: '프리미어 임포트', likes: 40, comments: 10 },
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

  // 분야별 트렌츠 추천 섹션 렌더링
  const renderSection = (section, sectionIndex) => {
    const showTag = Array.isArray(section.items);
    const { firstRow, secondRow } = splitIntoTwoRows(
      normalizedTrendData(section),
    );
    return (
      <View key={sectionIndex}>
        {/* 섹션 헤더 */}
        <View style={styles.fieldSectionHeader}>
          <Text style={styles.headerText}>
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
  };

  // 최근 피드 컴포넌트
  const latestFeed = feed => {
    return (
      <View style={styles.latestFeed}>
        <Text style={styles.feedTitleText}>{feed.title}</Text>
        <View style={styles.feedInfoContainer}>
          <View style={styles.feedInfo}>
            <Likes size={12} color={isDark ? '#D3D3D3' : '#666666'} />
            <Text style={styles.feedInfoText}>{feed.likes}</Text>
          </View>
          <View style={styles.feedInfo}>
            <Comments size={13} color={isDark ? '#D3D3D3' : '#666666'} />
            <Text style={styles.feedInfoText}>{feed.comments}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.mainContainer}>
      {/* 실시간 트렌드 */}
      <RealTimeTrend rankTrends={rankTrends} />
      {/* 분야별 트렌드 추천 */}
      {/* 전체 트렌드 추천 */}
      {renderSection(trendData[0], 0)}
      {/* 이번주 팁 */}
      <View style={styles.tipContainer}>
        <Text style={styles.headerText}>이번주 팁</Text>
        <View style={styles.tipContent}>
          <Image
            source={require('@/assets/images/this_week_tip.png')}
            style={styles.tipImage}
          />
          <LinearGradient
            colors={['rgba(102, 102, 102, 0.06)', '#252525']}
            style={styles.tipContentGradient}
          />
          <View style={styles.authorContainer}>
            <Image
              source={require('@/assets/images/this_week_tip_author.png')}
              style={styles.authorImage}
            />
            <Text style={styles.authorText}>김동률</Text>
          </View>
          <View style={styles.tipTitleContainer}>
            <Text style={styles.tipTitleText}>
              멋진 영상을 촬영하는{'\n'}
              10가지 방법
            </Text>
          </View>
        </View>
      </View>
      {/* 관심분야 트렌드 추천 */}
      {trendData
        .slice(1)
        .map((section, sectionIndex) =>
          renderSection(section, sectionIndex + 1),
        )}
      {/* 최근 피드 */}
      <View style={styles.latestFeedContainer}>
        <Text style={styles.headerText}>최근 피드</Text>
        <View style={styles.latestFeedContents}>
          {/* 최근 피드 콘텐츠 더미 */}
          {latestFeeds.map((feed, index) => (
            <Fragment key={index}>
              {latestFeed(feed)}
              {index !== latestFeeds.length - 1 && (
                <View style={styles.divider} />
              )}
            </Fragment>
          ))}
        </View>
      </View>
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
    headerText: {
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
    tipContainer: {
      paddingHorizontal: 16,
      marginBottom: 40,
      gap: 20,
    },
    tipContent: {
      flex: 1,
      position: 'relative',
      aspectRatio: 1,
      borderRadius: 10,
    },
    tipImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    tipContentGradient: {
      width: '100%',
      height: '100%',
      position: 'absolute',
    },
    authorContainer: {
      flexDirection: 'row',
      position: 'absolute',
      top: 20,
      right: 18,
      gap: 4,
      alignItems: 'center',
      justifyContent: 'center',
    },
    authorImage: {
      width: 24,
      height: 24,
      borderRadius: 12,
    },
    authorText: {
      fontSize: 16,
      color: '#FFFFFF',
    },
    tipTitleContainer: {
      position: 'absolute',
      bottom: 20,
      left: 0,
      right: 0,
      alignItems: 'center',
    },
    tipTitleText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#FFFFFF',
      textAlign: 'center',
    },
    latestFeedContainer: {
      paddingHorizontal: 16,
      marginTop: 30,
      marginBottom: 80,
    },
    latestFeedContents: {
      gap: 16,
      marginTop: 35,
    },
    latestFeed: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    feedTitleText: {
      fontSize: 14,
      color: colors.text,
      marginLeft: 3,
    },
    feedInfoContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 20,
    },
    feedInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    feedInfoText: {
      fontSize: 14,
      color: isDark ? '#D3D3D3' : '#666666',
    },
    divider: {
      height: 1,
      backgroundColor: isDark ? '#323232' : '#E6E6E6',
    },
  });
};
