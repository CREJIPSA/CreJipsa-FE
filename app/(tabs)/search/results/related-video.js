import { AuthContext } from '@/app/_layout';
import { authFetch } from '@/app/api/authFetch';
import Video from '@/app/components/search/related-video';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { FlatList, Text, useWindowDimensions, View } from 'react-native';
import useThemedStyle from '../../../hooks/use-themed-style';

export default function RelatedVideo() {
  const { styles } = useThemedStyle(getStyles);
  const { query } = useLocalSearchParams();
  const { accessToken } = useContext(AuthContext);

  const [relatedVideos, setRelatedVideos] = useState([]);

  useEffect(() => {
    const encodedQuery = encodeURIComponent(
      Array.isArray(query) ? (query[0] ?? '') : (query ?? ''),
    );
    authFetch(
      `https://dev.crezipsa.site/api/main/trend/search/${encodedQuery}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    )
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
        const result = data?.result;
        if (!result) {
          console.warn('No result found in search API response');
          return;
        }
        setRelatedVideos(Array.isArray(result.videos) ? result.videos : []);
      })
      .catch(error => {
        console.error('Error during search API request:', error);
      });
  }, [accessToken, query]);

  // 비디오 가로 크기 계산
  const { width: windowWidth } = useWindowDimensions();
  const videoWidth = (windowWidth - 32 - 16) / 3;

  // 무한 스크롤
  const [currentPage, setCurrentPage] = useState(1);
  const videosPerPage = 15;
  const displayedVideos = useMemo(
    () => relatedVideos.slice(0, currentPage * videosPerPage),
    [currentPage, videosPerPage, relatedVideos],
  );
  const hasNext = displayedVideos.length < relatedVideos.length;
  const handleLoadMore = useCallback(() => {
    if (!hasNext) return;
    setCurrentPage(prevPage => prevPage + 1);
  }, [hasNext]);

  const renderItem = useCallback(
    ({ item, index }) => (
      <Video
        key={index}
        title={item.title}
        views={item.viewCount}
        url={item.url}
        width={videoWidth}
        height={216}
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
