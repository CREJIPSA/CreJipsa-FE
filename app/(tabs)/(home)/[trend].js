import RelatedVideo from '@/app/components/search/related-video';
import AlarmIcon from '@/assets/svgs/home/alarm-icon.js';
import AddBtn from '@/assets/svgs/trend/add.js';
import ShareBtn from '@/assets/svgs/trend/share.js';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { ImageBackground } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import useThemedStyle from '../../hooks/use-themed-style';

import { AuthContext } from '@/app/_layout';

export default function Trend() {
  const router = useRouter();
  const { isDark, styles } = useThemedStyle(getStyles);
  const insets = useSafeAreaInsets();
  const { trend, id } = useLocalSearchParams();

  const { accessToken } = useContext(AuthContext);

  // (임시) 현재 시간을 마지막 업데이트로 설정
  const lastUpdateTime = format(new Date(), 'yyyy년 MM월 dd일 HH:mm');

  // 트렌드 상세 정보
  const [frequency, setFrequency] = useState(null); //흥행 가능성
  const [overallRank, setOverallRank] = useState(null); //실시간 트렌드 순위
  const [category, setCategory] = useState(null); //카테고리
  const [categoryRank, setCategoryRank] = useState(null); //카테고리 내 순위

  // 관련 영상 정보
  const [videoInfo, setVideoInfo] = useState([]);

  useEffect(() => {
    fetch(`https://dev.crezipsa.site/api/main/trend/detail/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then(async res => {
        const raw = await res.text();
        console.log('trend detail api status', res.status);
        console.log('trend detail api raw response', raw);

        let data = null;
        try {
          data = raw ? JSON.parse(raw) : null;
        } catch (e) {
          console.error('Failed to parse JSON response', e);
        }

        if (!res.ok)
          throw new Error(`Trend Detail API error: ${res.status}, raw=${raw}`);
        return data;
      })
      .then(data => {
        const result = data?.result;
        if (!result) {
          console.error('Invalid trend detail data format', data);
          return;
        }
        // 트렌드 상세 정보
        setFrequency(result.frequency);
        setOverallRank(result.overall_rank);
        setCategory(result.category);
        console.log('Category:', result.category);
        setCategoryRank(result.category_rank);
        // 관련 영상 정보
        setVideoInfo(result.urls || []);
      })
      .catch(error => {
        console.error('Failed to fetch trend detail data', error);
      });
  }, [accessToken, id]);

  // 관련 영상 데이터
  const relatedVideos = videoInfo.map(video => ({
    title: video.title,
    views: video.viewCount,
    thumbnailUrl: require('@/assets/images/thumbnail/video-thumbnail-1.png'), // 썸네일 추가 필요
    url: video.url,
  }));

  // 조회수 포맷팅 함수
  function formatViews(views) {
    // 1000회 이하는 n
    if (views < 1000) {
      return String(views);
    }
    // 1000~9999회는 n천
    if (views < 10000) {
      return `${Math.floor(views / 1000)}천`;
    }
    // 1만~9999만회는 n만
    if (views < 100000000) {
      return `${Math.floor(views / 10000)}만`;
    }
    return `${Math.floor(views / 10000)}만`;
  }

  return (
    <View style={[styles.mainContainer, { paddingTop: insets.top }]}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Pressable
          style={{ paddingVertical: 10 }}
          onPress={() => {
            router.push('/(tabs)/(home)/notifications');
          }}
        >
          <AlarmIcon size={20} color={isDark ? '#FAFAFA' : '#141414'} />
        </Pressable>
      </View>
      <View style={styles.body}>
        {/* 트렌드 분석 */}
        <ImageBackground
          source={require('@/assets/images/graphic/trend-report-bg.png')}
          style={styles.bgImage}
        >
          <View style={styles.trendReportContainer}>
            <View style={styles.trendContainer}>
              <Text style={styles.trendText}>{trend}</Text>
              <Text style={styles.lastUpdatedText}>
                마지막 업데이트{'\n'}
                {lastUpdateTime}
              </Text>
            </View>
            <View style={styles.buttonContainer}>
              <Pressable
                onPress={() => {
                  Toast.show({
                    type: 'addTrendToast',
                    text1: '저장이 완료되었습니다!',
                    position: 'top',
                    visibilityTime: 2000,
                    topOffset: 40,
                  });
                }}
              >
                <AddBtn size={24} />
              </Pressable>
              <Pressable>
                <ShareBtn size={24} />
              </Pressable>
            </View>
            <View style={styles.analysisContainer}>
              <View style={styles.analysisBox}>
                <View style={styles.labelContainer}>
                  <View style={styles.label}>
                    <Text style={styles.labelText}>흥행 가능성</Text>
                  </View>
                  <Text style={[styles.valueText, { fontSize: 24 }]}>
                    {frequency}%
                  </Text>
                </View>
              </View>
              <View style={styles.analysisBox}>
                <View style={styles.labelContainer}>
                  <View style={styles.label}>
                    <Text style={styles.labelText}>실시간 트렌드</Text>
                  </View>
                  <Text style={styles.valueText}>{overallRank}위</Text>
                </View>
                <View style={styles.labelContainer}>
                  <View style={styles.label}>
                    <Text style={styles.labelText}>{category} 분야</Text>
                  </View>
                  <Text style={styles.valueText}>{categoryRank}위</Text>
                </View>
              </View>
            </View>
          </View>
        </ImageBackground>
        {/* 관련 영상 */}
        <View style={styles.relatedVideosContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>관련 영상</Text>
            <Pressable
              style={styles.seeMoreContainer}
              onPress={() => {
                router.push({
                  pathname: '/search/results/related-video',
                  params: { query: trend },
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
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {relatedVideos.slice(0, 5).map((video, index) => (
              <RelatedVideo
                key={index}
                title={video.title}
                views={formatViews(video.views)}
                thumbnailUrl={video.thumbnailUrl}
                url={video.url}
              />
            ))}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

const getStyles = (isDark, primaryColors) => ({
  mainContainer: {
    flex: 1,
    backgroundColor: isDark ? '#141414' : '#FAFAFA',
  },
  header: {
    height: 45,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 20,
  },
  body: {
    flex: 1,
    backgroundColor: primaryColors.background,
  },
  bgImage: {
    overflow: 'hidden',
    resizeMode: 'cover',
    borderBottomRightRadius: 100,
  },
  trendReportContainer: {
    paddingTop: 20,
    paddingBottom: 35,
    paddingHorizontal: 18,
    borderBottomRightRadius: 100,
  },
  trendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  trendText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#141414',
  },
  lastUpdatedText: {
    fontSize: 12,
    color: '#454545',
    textAlign: 'right',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 10,
    marginBottom: 45,
  },
  analysisContainer: {
    gap: 8,
  },
  analysisBox: {
    width: '45%',
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 16,
    gap: 7,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    flexDirection: 'row',
    backgroundColor: '#141414',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 100,
  },
  labelText: {
    fontSize: 16,
    color: '#FAFAFA',
  },
  valueText: {
    fontSize: 20,
    color: '#141414',
    fontWeight: 'bold',
  },
  expectedViewsLabel: {
    alignItems: 'flex-start',
  },
  relatedVideosContainer: {
    marginTop: 30,
    paddingHorizontal: 15,
    gap: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: primaryColors.color,
  },
  seeMoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeMore: {
    fontSize: 14,
    color: isDark ? '#E6E6E6' : '#666666',
  },
  thumbnail: {
    width: 140,
    height: 245,
    borderRadius: 15,
    marginRight: 8,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    resizeMode: 'cover',
  },
  thumbnailGradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  videoInfoContainer: {
    paddingBottom: 15,
    paddingHorizontal: 17,
    gap: 2,
  },
  videoTitle: {
    fontSize: 14,
    color: '#F4F2F2',
  },
  videoViews: {
    fontSize: 12,
    color: '#F4F2F2',
    fontWeight: '200',
  },
});
