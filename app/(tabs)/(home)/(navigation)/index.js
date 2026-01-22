import useThemedStyle from '@/app/hooks/use-themed-style';
import { authFetch } from '@/lib/authFetch';
import { LinearGradient } from 'expo-linear-gradient';
import { useContext, useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AuthContext } from '../../../_layout';
import RealTimeTrend from '../../../components/realtime-trend';
import TrendKeywordCard from '../../../components/trend-keyword-card';

export default function Home({ platform }) {
  const { isDark, styles } = useThemedStyle(getStyles);

  const { accessToken } = useContext(AuthContext);

  const [rankTrends, setRankTrends] = useState([]);
  useEffect(() => {
    const url = `https://dev.crezipsa.site/api/main/trend?platform=${platform}`;
    // 플랫폼과 카테고리에 따른 실시간 트렌드 데이터 가져오기
    authFetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then(async res => {
        const raw = await res.text();
        console.log('trend api status', res.status);
        console.log('trend api raw response', raw);

        let data = null;
        try {
          data = raw ? JSON.parse(raw) : null;
        } catch (e) {
          console.error('Failed to parse JSON response', e);
        }

        if (!res.ok) throw new Error(`Trend API error: ${res.status}`);
        return data;
      })
      .then(data => {
        const result = data?.result;
        if (!result || !Array.isArray(result)) {
          console.error('Invalid trend data format', data);
          return;
        }
        const top4 = result
          .slice(0, 4)
          .map(({ id, keyword }) => ({ id, keyword }));
        setRankTrends(top4);
      })
      .catch(error => {
        console.error('Failed to fetch trend data', error);
      });
  }, [platform, accessToken]);

  const [overallTrendData, setOverallTrendData] = useState([]);
  useEffect(() => {
    authFetch(
      `https://dev.crezipsa.site/api/main/trend/recommendations/by-platform`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )
      .then(async res => {
        const raw = await res.text();
        console.log('overall trend api status', res.status);
        console.log('overall trend api raw response', raw);

        let data = null;
        try {
          data = raw ? JSON.parse(raw) : null;
        } catch (e) {
          console.error('Failed to parse JSON response', e);
        }

        if (!res.ok) throw new Error(`Overall Trend API error: ${res.status}`);
        return data;
      })
      .then(data => {
        const result = data?.result;
        if (!result || !Array.isArray(result)) {
          console.error('Invalid overall trend data format', data);
          return;
        }
        setOverallTrendData(result);
      })
      .catch(error => {
        console.error('Failed to fetch overall trend data', error);
      });
  }, [accessToken]);

  const [interestTrendData, setInterestTrendData] = useState([]);
  useEffect(() => {
    authFetch(
      `https://dev.crezipsa.site/api/main/trend/recommendations/by-interests`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )
      .then(async res => {
        const raw = await res.text();
        console.log('interest trend api status', res.status);
        console.log('interest trend api raw response', raw);

        let data = null;
        try {
          data = raw ? JSON.parse(raw) : null;
        } catch (e) {
          console.error('Failed to parse JSON response', e);
        }

        if (!res.ok) throw new Error(`Interest Trend API error: ${res.status}`);
        return data;
      })
      .then(data => {
        const result = data?.result;
        if (!result || !Array.isArray(result)) {
          console.error('Invalid interest trend data format', data);
          return;
        }
        setInterestTrendData(result);
      })
      .catch(error => {
        console.error('Failed to fetch interest trend data', error);
      });
  }, [accessToken]);

  // 스크롤뷰 데이터 다섯 개씩 렌더링
  const splitIntoTwoRows = items => {
    const firstRow = items.slice(0, 5);
    const secondRow = items.slice(5, 10);
    return { firstRow, secondRow };
  };

  // 분야별 트렌츠 추천 섹션 렌더링
  const renderSection = items => {
    const showTag = overallTrendData === items; // 전체 트렌드일 때 태그 표시
    const { firstRow, secondRow } = splitIntoTwoRows(items);
    return (
      <View key={items === overallTrendData ? 'overall' : items[0]?.category}>
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
              {items === overallTrendData ? '전체' : items[0]?.category}
            </Text>{' '}
            분야의 트렌드 추천
          </Text>
        </View>
        <View style={styles.trendRecommendContainer}>
          {/* 첫 번째 스크롤뷰 */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 16 }}
            style={styles.trendKeywordCardContainer}
          >
            {firstRow.map(item => (
              <TrendKeywordCard
                key={item.id}
                tag={item.category}
                title={item.keyword}
                showTag={showTag} // 태그 표시 여부
              />
            ))}
          </ScrollView>
          {/* 두 번째 스크롤뷰 */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 16 }}
            style={styles.trendKeywordCardContainer}
          >
            {secondRow.map(item => (
              <TrendKeywordCard
                key={item.id}
                tag={item.category}
                title={item.keyword}
                showTag={showTag} // 태그 표시 여부
              />
            ))}
          </ScrollView>
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
      {renderSection(overallTrendData)}
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
      <View
        style={{
          flexDirection: 'column-reverse',
          marginBottom: 20,
        }}
      >
        {/* 관심분야 트렌드 추천 */}
        {interestTrendData
          .filter((_, index) => index % 10 === 0)
          .map((_, groupIndex) => {
            const chunk = interestTrendData.slice(
              groupIndex * 10,
              groupIndex * 10 + 10,
            );
            return renderSection(chunk);
          })}
        <View style={{ height: 50 }} />
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
      marginBottom: 40,
      gap: 16,
    },
    trendKeywordCardContainer: {
      paddingLeft: 16,
      paddingRight: 16,
    },
    tipContainer: {
      paddingHorizontal: 16,
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
  });
};
