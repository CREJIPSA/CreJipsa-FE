import RelatedVideo from '@/app/components/search/related-video';
import AddBtn from '@/assets/svgs/trend/add.js';
import ShareBtn from '@/assets/svgs/trend/share.js';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { ImageBackground } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useThemedStyle from '../../hooks/use-themed-style';

export default function Trend() {
  const router = useRouter();
  const { isDark, styles, primaryColors } = useThemedStyle(getStyles);
  const insets = useSafeAreaInsets();
  const { trend } = useLocalSearchParams();
  const [toastVisible, setToastVisible] = useState(false);

  // (임시) 현재 시간을 마지막 업데이트로 설정
  const lastUpdateTime = format(new Date(), 'yyyy년 MM월 dd일 HH:mm');

  // 관련 영상 더미 데이터
  const relatedVideos = [
    {
      title: '신상 가나디 행사',
      views: '18만',
      thumbnailUrl: require('@/assets/images/thumbnail/video-thumbnail-1.png'),
    },
    {
      title: '우린 이별했다고',
      views: '25만',
      thumbnailUrl: require('@/assets/images/thumbnail/video-thumbnail-2.png'),
    },
    {
      title: '10점짜리 소리 찾기',
      views: '32만',
      thumbnailUrl: require('@/assets/images/thumbnail/video-thumbnail-3.png'),
    },
    {
      title: '가나디 케이크',
      views: '41만',
      thumbnailUrl: require('@/assets/images/thumbnail/video-thumbnail-4.png'),
    },
    {
      title: '오븐 없이 초초간편 가나디 케이크',
      views: '12만',
      thumbnailUrl: require('@/assets/images/thumbnail/video-thumbnail-5.png'),
    },
  ];

  // 타이머 정리
  const toastTimeoutRef = useRef(null);
  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  // 토스트
  const showToast = () => {
    setToastVisible(true);
    toastTimeoutRef.current = setTimeout(() => {
      setToastVisible(false);
    }, 1500);
  };

  return (
    <View style={[styles.mainContainer, { paddingTop: insets.top }]}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Ionicons
          name="chevron-back"
          size={20}
          color={primaryColors.color}
          onPress={() => router.back()}
        />
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
                  showToast();
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
                <View style={styles.expectedViewsLabel}>
                  <View style={styles.label}>
                    <Text style={styles.labelText}>예상 조회수</Text>
                  </View>
                </View>
                <Text
                  style={[
                    styles.valueText,
                    { fontSize: 24, textAlign: 'right' },
                  ]}
                >
                  3,049회
                </Text>
              </View>
              <View style={[styles.analysisBox, { paddingVertical: 16 }]}>
                <View style={styles.labelContainer}>
                  <View style={styles.label}>
                    <Text style={styles.labelText}>실시간 키워드</Text>
                  </View>
                  <Text style={styles.valueText}>1위</Text>
                </View>
                <View style={styles.labelContainer}>
                  <View style={styles.label}>
                    <Text style={styles.labelText}>음악 분야</Text>
                  </View>
                  <Text style={styles.valueText}>1위</Text>
                </View>
              </View>
            </View>
          </View>
        </ImageBackground>
        {/* 관련 영상 */}
        <View style={styles.relatedVideosContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>관련 영상</Text>
            <Pressable style={styles.seeMoreContainer}>
              <Text style={styles.seeMore}>더보기</Text>
              <Ionicons
                name="chevron-forward"
                size={14}
                color={isDark ? '#E6E6E6' : '#666666'}
              />
            </Pressable>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {relatedVideos.map((video, index) => (
              <RelatedVideo
                key={index}
                title={video.title}
                views={video.views}
                thumbnailUrl={video.thumbnailUrl}
              />
            ))}
          </ScrollView>
        </View>
      </View>
      {toastVisible && (
        <View style={styles.toastBg}>
          <View style={styles.toast}>
            <Text style={styles.toastText}>저장이 완료되었습니다!</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const getStyles = (isDark, primaryColors) => ({
  mainContainer: {
    flex: 1,
    backgroundColor: isDark ? '#141414' : '#FAFAFA',
  },
  header: {
    paddingVertical: 10,
    paddingLeft: 15,
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
    paddingBottom: 25,
    paddingHorizontal: 18,
    borderBottomRightRadius: 100,
    gap: 20,
  },
  trendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  },
  analysisContainer: {
    gap: 8,
  },
  analysisBox: {
    width: '45%',
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 12,
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
  toastBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  toast: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#202020',
    borderRadius: 20,
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 20,
    textAlign: 'center',
  },
});
