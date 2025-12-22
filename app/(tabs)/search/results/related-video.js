import Video from '@/app/components/search/video';
import RELATED_VIDEOS from '@/app/constants/search/RELATED_VIDEOS';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, Text, useWindowDimensions, View } from 'react-native';
import useThemedStyle from '../../../hooks/use-themed-style';

export default function RelatedVideo() {
  const { styles } = useThemedStyle(getStyles);
  const { query } = useLocalSearchParams();

  // 비디오 가로 크기 계산
  const { width: windowWidth } = useWindowDimensions();
  const videoWidth = (windowWidth - 32 - 16) / 3;

  // 무한 스크롤
  const [currentPage, setCurrentPage] = useState(1);
  const videosPerPage = 15;
  const displayedVideos = useMemo(
    () => RELATED_VIDEOS.slice(0, currentPage * videosPerPage),
    [currentPage, videosPerPage],
  );
  const hasNext = displayedVideos.length < RELATED_VIDEOS.length;
  const handleLoadMore = useCallback(() => {
    if (!hasNext) return;
    setCurrentPage(prevPage => prevPage + 1);
  }, [hasNext]);

  const renderItem = useCallback(
    ({ item }) => (
      <Video
        title={item.title}
        views={item.views}
        thumbnailUrl={item.thumbnailUrl}
        width={videoWidth}
      />
    ),
    [videoWidth],
  );

  return (
    <View>
      <View style={[styles.relatedVideosContainer]}>
        <FlatList
          ListHeaderComponent={
            <View style={styles.titleContainer}>
              <Text style={styles.title}>
                {`'`}
                <Text style={styles.titleHighlight}>{query}</Text>
                {`'`}와 관련한 영상 링크
              </Text>
            </View>
          }
          data={displayedVideos}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          numColumns={3}
          columnWrapperStyle={{
            marginBottom: 24,
          }}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
        />
      </View>
    </View>
  );
}

const getStyles = (isDark, primaryColor) => ({
  titleContainer: {
    marginTop: 35,
    marginBottom: 25,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: primaryColor.color,
  },
  titleHighlight: {
    color: isDark ? '#CCFF66' : '#A3CC52',
  },
  relatedVideosContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
});
