import { AuthContext } from '@/app/_layout';
import RelatedVideo from '@/app/components/search/video';
import TrendKeywordCard from '@/app/components/trend-keyword-card';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import useThemedStyle from '../../../hooks/use-themed-style';

export default function SearchKeyword() {
  const { query } = useLocalSearchParams();
  const { styles, isDark } = useThemedStyle(getStyles);

  const { accessToken } = useContext(AuthContext);

  const [trendSearchData, setTrendSearchData] = useState([]);

  useEffect(() => {
    fetch(`https://dev.crezipsa.site/api/main/trend/search/${query}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })
      .then(async res => {
        const raw = await res.text();
        console.log('search api status', res.status);
        console.log('search api response', raw);

        let data = null;
        try {
          data = raw ? JSON.parse(raw) : null;
        } catch (e) {
          console.error('Error parsing search API response JSON:', e);
        }

        if (!res.ok) throw new Error('Search API request failed');
        return data;
      })
      .then(data => {
        const result = data?.result.trends;
        if (!result) {
          console.warn('No result found in search API response');
          return;
        }
        setTrendSearchData(result);
      })
      .catch(error => {
        console.error('Error during search API request:', error);
      });
  }, [accessToken, query]);

  // 관련 영상 더미 데이터
  const relatedVideos = [
    {
      title: '오븐 없이 초초간편 가나디 케이크',
      views: '12만',
      thumbnailUrl: require('@/assets/images/thumbnail/video-thumbnail-5.png'),
    },
    {
      title: '가나디 잠옷!!!',
      views: '8만',
      thumbnailUrl: require('@/assets/images/thumbnail/video-thumbnail-6.png'),
    },
    {
      title: '가나디 티셔츠 사이즈 팁',
      views: '15만',
      thumbnailUrl: require('@/assets/images/thumbnail/video-thumbnail-7.png'),
    },
    {
      title: '듀 가나디와 함께하는 브이로그',
      views: '20만',
      thumbnailUrl: require('@/assets/images/thumbnail/video-thumbnail-8.png'),
    },
    {
      title: '듀 가나디 굿즈 언박싱!',
      views: '30만',
      thumbnailUrl: require('@/assets/images/thumbnail/video-thumbnail-9.png'),
    },
  ];

  // 스크롤뷰 데이터 다섯 개씩 렌더링
  const splitIntoTwoRows = items => {
    const firstRow = items.slice(0, 5);
    const secondRow = items.slice(5, 10);
    return { firstRow, secondRow };
  };
  const { firstRow, secondRow } = splitIntoTwoRows(trendSearchData);

  return (
    <>
      {/* 검색 결과 */}
      <View style={styles.searchResultsContainer}>
        <Text style={styles.titleText}>
          {`'`}
          <Text style={styles.highlightedText}>{query}</Text>
          {`'`}에 대한 검색 결과
        </Text>
        {trendSearchData.length === 0 ? (
          <View style={styles.dimmedTextContainer}>
            <Text style={styles.dimmedText}>
              검색 결과가 존재하지 않습니다.
            </Text>
          </View>
        ) : (
          <View style={styles.trendRecommendContainer}>
            {/* 첫 번째 스크롤뷰 */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {firstRow.map((item, index) => (
                <TrendKeywordCard
                  key={index}
                  tag={item.category}
                  title={item.keyword}
                  showTag={true} // 태그 표시 여부
                />
              ))}
            </ScrollView>
            {/* 두 번째 스크롤뷰 */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {secondRow.map((item, index) => (
                <TrendKeywordCard
                  key={index}
                  tag={item.category}
                  title={item.keyword}
                  showTag={true} // 태그 표시 여부
                />
              ))}
            </ScrollView>
          </View>
        )}
      </View>
      {/* 관련 영상 링크 */}
      <View style={styles.relatedVideosContainer}>
        <View style={styles.relatedVideosHeader}>
          <Text style={styles.titleText}>
            {`'`}
            <Text style={styles.highlightedText}>{query}</Text>
            {`'`}와 관련한 영상 링크
          </Text>
          <Pressable
            style={styles.seeMoreContainer}
            onPress={() => {
              router.push({
                pathname: '/search/results/related-video',
                params: { query },
              });
            }}
          >
            <Text style={styles.seeMore}>더보기</Text>
            <Ionicons
              name="chevron-forward"
              size={14}
              color={isDark ? '#E6E6E6' : '#666666'}
            />
          </Pressable>
        </View>
        {relatedVideos.length === 0 ? (
          <View style={[styles.dimmedTextContainer, { paddingHorizontal: 16 }]}>
            <Text style={styles.dimmedText}>
              검색 결과가 존재하지 않습니다.
            </Text>
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, marginTop: 20 }}
          >
            {relatedVideos.map((video, index) => (
              <RelatedVideo
                key={index}
                title={video.title}
                views={video.views}
                thumbnailUrl={video.thumbnailUrl}
              />
            ))}
          </ScrollView>
        )}
      </View>
    </>
  );
}

const getStyles = (isDark, primaryColor) => ({
  searchResultsContainer: {
    paddingLeft: 16,
    marginTop: 35,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: primaryColor.color,
  },
  highlightedText: {
    color: isDark ? '#CCFF66' : '#A3CC52',
  },
  dimmedTextContainer: {
    height: 200,
    marginTop: 20,
  },
  dimmedText: {
    color: primaryColor.color,
  },
  trendRecommendContainer: {
    marginTop: 20,
    gap: 16,
  },
  relatedVideosContainer: {
    marginTop: 25,
  },
  relatedVideosHeader: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  seeMoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeMore: {
    fontSize: 14,
    color: isDark ? '#E6E6E6' : '#323232',
  },
});
