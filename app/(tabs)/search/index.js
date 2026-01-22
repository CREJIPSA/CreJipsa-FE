import { AuthContext } from '@/app/_layout';
import RankDown from '@/assets/search/rank-down.js';
import RankNone from '@/assets/search/rank-none.js';
import RankUp from '@/assets/search/rank-up.js';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useFocusEffect } from 'expo-router';
import { memo, useCallback, useContext, useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Chip from '../../components/chip';
import SearchBox from '../../components/search/search-box';
import useThemedStyle from '../../hooks/use-themed-style';

export default function SearchTrend() {
  const insets = useSafeAreaInsets();
  const { styles, primaryColors } = useThemedStyle(getStyles);
  const { accessToken } = useContext(AuthContext);

  const [searchKeyword, setSearchKeyword] = useState('');

  // 최근 검색어
  const [recentSearchKeywords, setRecentSearchKeywords] = useState([]);
  const fetchRecentSearchKeywords = useCallback(() => {
    let aborted = false;
    (async () => {
      try {
        const res = await fetch(
          `https://dev.crezipsa.site/api/main/trend/search-history`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        const raw = await res.text();
        console.log('search history api status', res.status);
        console.log('search history api raw response', raw);

        if (!res.ok) {
          console.error(
            `Fetch Search History API error: ${res.status} raw=${raw}`,
          );
          return;
        }

        const data = raw ? JSON.parse(raw) : null;
        const result = data?.result;
        if (!Array.isArray(result)) return;

        if (!aborted) setRecentSearchKeywords(result);
      } catch (e) {
        console.error(e);
      }
    })();

    return () => {
      aborted = true;
    };
  }, [accessToken]);

  useFocusEffect(fetchRecentSearchKeywords);

  // 채널 기반 키워드 추천 리스트
  const [keywordRecommendations, setKeywordRecommendations] = useState([]);
  useEffect(() => {
    const controller = new AbortController();
    let mounted = true;
    fetch(
      `https://dev.crezipsa.site/api/main/trend/recommendations/by-platform`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        signal: controller.signal,
      },
    )
      .then(async res => {
        const raw = await res.text();
        console.log('keyword recommendations api status', res.status);
        console.log('keyword recommendations api raw response', raw);

        let data = null;
        try {
          data = raw ? JSON.parse(raw) : null;
        } catch (e) {
          console.error(
            'Failed to parse keyword recommendations API response',
            e,
          );
        }

        if (!res.ok)
          throw new Error(
            `Keyword Recommendations API error: ${res.status} raw=${raw}`,
          );
        return data;
      })
      .then(data => {
        const result = data?.result;
        if (!result || !Array.isArray(result)) {
          console.error('Invalid keyword recommendations data format');
          return;
        }
        if (mounted) setKeywordRecommendations(result);
      })
      .catch(error => {
        if (controller.signal.aborted) return;
        console.error('Error fetching keyword recommendations:', error);
      });
    return () => {
      mounted = false;
      controller.abort();
    };
  }, [accessToken]);

  // 실시간 키워드 순위
  const [keywordRanking, setKeywordRanking] = useState([]);
  useEffect(() => {
    const controller = new AbortController();
    let mounted = true;
    fetch(`https://dev.crezipsa.site/api/main/trend`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      signal: controller.signal,
    })
      .then(async res => {
        const raw = await res.text();
        console.log('keyword ranking api status', res.status);
        console.log('keyword ranking api raw response', raw);

        let data = null;
        try {
          data = raw ? JSON.parse(raw) : null;
        } catch (e) {
          console.error('Failed to parse keyword ranking API response', e);
        }

        if (!res.ok)
          throw new Error(`Keyword Ranking API error: ${res.status}`);
        return data;
      })
      .then(data => {
        const result = data?.result;
        if (!result || !Array.isArray(result)) {
          console.error('Invalid keyword ranking data format');
          return;
        }
        if (mounted) setKeywordRanking(result);
      })
      .catch(error => {
        if (controller.signal.aborted) return;
        console.error('Error fetching keyword ranking:', error);
      });
    return () => {
      mounted = false;
      controller.abort();
    };
  }, [accessToken]);

  // 최근 검색어 칩 컴포넌트
  const RecentSearchChip = memo(function Chip({ keyword, onPressDelete }) {
    return (
      <View style={styles.recentSearchChip}>
        <Text style={styles.recentSearchChipText}>{keyword}</Text>
        <Pressable onPress={onPressDelete}>
          <Ionicons
            name="close-outline"
            size={16}
            color={primaryColors.color}
          />
        </Pressable>
      </View>
    );
  });

  // (임시) 현재 시간을 랭킹 업데이트 시간으로 설정
  const updateTime = format(new Date(), 'HH:mm');

  // 키워드 순위 컴포넌트
  const KeywordRankingItem = memo(function KeywordRankingItem({
    rank,
    label,
    state,
  }) {
    return (
      <View style={styles.keywordRankingItemContainer}>
        <View style={styles.keywordRankingItemInfo}>
          <Text style={styles.keywordRankingItemRank}>{rank}</Text>
          <Text style={styles.keywordRankingItemLabel}>{label}</Text>
        </View>
        {state === '상승' && <RankUp />}
        {state === '하락' && <RankDown />}
        {state === '유지' && <RankNone />}
      </View>
    );
  });

  return (
    <View style={[styles.mainContainer, { paddingTop: insets.top }]}>
      {/* 검색창 */}
      <View style={styles.header}>
        <Text style={styles.titleText}>검색</Text>
        <View style={styles.searchContainer}>
          <SearchBox
            searchKeyword={searchKeyword}
            setSearchKeyword={setSearchKeyword}
          />
          <Pressable
            style={styles.cancelButton}
            onPress={() => setSearchKeyword('')}
          >
            <Text style={styles.cancelButtonText}>취소</Text>
          </Pressable>
        </View>
      </View>
      {/* 최근 검색어 */}
      <View style={styles.recentSearchContainer}>
        <View style={styles.recentSearchHeader}>
          <Text style={styles.headerTitleText}>최근 검색어</Text>
          <Pressable
            onPress={async () => {
              try {
                const res = await fetch(
                  `https://dev.crezipsa.site/api/main/trend/all-history`,
                  {
                    method: 'DELETE',
                    headers: {
                      Authorization: `Bearer ${accessToken}`,
                    },
                  },
                );

                if (res.ok) {
                  setRecentSearchKeywords([]);
                } else {
                  console.error(
                    `Delete All Search History API error: ${res.status}`,
                  );
                }
              } catch (e) {
                console.error(e);
              }
            }}
          >
            <Text style={styles.clearAllText}>전체 삭제</Text>
          </Pressable>
        </View>
        <ScrollView
          horizontal
          style={styles.recentSearchList}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          {recentSearchKeywords.length === 0 ? (
            <View style={{ height: 35 }} />
          ) : (
            recentSearchKeywords.map(keyword => (
              <RecentSearchChip
                key={keyword.historyId}
                keyword={keyword.history}
                onPressDelete={async () => {
                  try {
                    const res = await fetch(
                      `https://dev.crezipsa.site/api/main/trend/${keyword.historyId}`,
                      {
                        method: 'DELETE',
                        headers: {
                          Authorization: `Bearer ${accessToken}`,
                        },
                      },
                    );
                    const raw = await res.text();
                    console.log('delete search history api status', res.status);
                    console.log('delete search history api raw response', raw);
                    if (res.ok) {
                      setRecentSearchKeywords(prev =>
                        prev.filter(
                          item => item.historyId !== keyword.historyId,
                        ),
                      );
                    } else {
                      console.error(
                        `Delete Search History API error: ${res.status}`,
                      );
                    }
                  } catch (e) {
                    console.error(e);
                  }
                }}
              />
            ))
          )}
        </ScrollView>
      </View>
      {/* 채널 기반 키워드 추천 */}
      <View style={styles.keywordRecommendationContainer}>
        <Text style={[styles.headerTitleText, { marginBottom: 20 }]}>
          채널 기반 키워드 추천
        </Text>
        <View style={styles.keywordRecommendations}>
          {keywordRecommendations.slice(0, 5).map(keyword => (
            <Chip key={keyword.id} label={keyword.keyword} />
          ))}
        </View>
      </View>
      {/* 실시간 키워드 순위 */}
      <View style={styles.keywordRankingContainer}>
        <View style={styles.keywordRankingHeader}>
          <Text style={styles.headerTitleText}>실시간 키워드 순위</Text>
          <Text style={styles.timeStampText}>{updateTime} 기준</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <View style={styles.keywordRankingList}>
            {keywordRanking.slice(0, 4).map(item => (
              <KeywordRankingItem
                key={item.id}
                rank={item.rank}
                label={item.keyword}
                state={item.trendDirection}
              />
            ))}
          </View>
          <View style={styles.keywordRankingList}>
            {keywordRanking.slice(4, 8).map(item => (
              <KeywordRankingItem
                key={item.id}
                rank={item.rank}
                label={item.keyword}
                state={item.trendDirection}
              />
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

const getStyles = (isDark, primaryColors) => ({
  mainContainer: {
    flex: 1,
    backgroundColor: primaryColors.background,
  },
  header: {
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderColor: '#A0A0A0',
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: primaryColors.color,
    paddingVertical: 7,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  cancelButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 18,
    color: isDark ? '#E6E6E6' : '#323232',
    textAlign: 'center',
  },
  recentSearchContainer: {
    marginTop: 30,
  },
  recentSearchHeader: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitleText: {
    fontSize: 16,
    color: primaryColors.color,
  },
  clearAllText: {
    fontSize: 12,
    color: isDark ? '#E6E6E6' : '#323232',
  },
  recentSearchList: {
    marginTop: 15,
  },
  recentSearchChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 15,
    gap: 10,
    borderRadius: 100,
    borderColor: primaryColors.color,
    borderWidth: 1,
    marginRight: 10,
  },
  recentSearchChipText: {
    fontSize: 14,
    color: isDark ? '#F4F2F2' : '#1B1B1B',
  },
  keywordRecommendationContainer: {
    paddingHorizontal: 16,
    marginTop: 50,
  },
  keywordRecommendations: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  keywordRankingContainer: {
    paddingHorizontal: 16,
    marginTop: 40,
  },
  keywordRankingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  timeStampText: {
    fontSize: 12,
    color: '#DADADA',
  },
  keywordRankingList: {
    width: '50%',
    gap: 3,
  },
  keywordRankingItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  keywordRankingItemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  keywordRankingItemRank: {
    fontSize: 14,
    color: isDark ? '#E3FFAB' : '#141414',
  },
  keywordRankingItemLabel: {
    fontSize: 12,
    color: primaryColors.color,
  },
});
