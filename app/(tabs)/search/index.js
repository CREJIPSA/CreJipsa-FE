import RankDown from '@/assets/search/rank-down.js';
import RankNone from '@/assets/search/rank-none.js';
import RankUp from '@/assets/search/rank-up.js';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { memo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Chip from '../../components/chip';
import SearchBox from '../../components/search/search-box';
import useThemedStyle from '../../hooks/use-themed-style';

export default function SearchTrend() {
  const insets = useSafeAreaInsets();
  const { styles, primaryColors } = useThemedStyle(getStyles);

  const [searchKeyword, setSearchKeyword] = useState('');

  // 최근 검색어
  const [recentSearchKeywords, setRecentSearchKeywords] = useState([
    'Text',
    '듀 가나디 키링',
    '밈',
    '아이폰 17',
    '두바이 쫀득 쿠키',
  ]);

  // 채널 기반 키워드 추천 리스트
  const keywordRecommendations = [
    '듀 가나디 키링',
    '요즘 BGM',
    '듀 가나디',
    '아이폰 17',
    '밈',
  ];

  // 실시간 트렌드 순위
  const keywordRanking = [
    { rank: 1, label: '주토피아', state: 'up' },
    { rank: 2, label: '두바이 쫀득 쿠키', state: null },
    { rank: 3, label: '힙사사돈', state: null },
    { rank: 4, label: '방어회', state: 'down' },
    { rank: 5, label: '크리스마스', state: 'up' },
    { rank: 6, label: '첫눈', state: null },
    { rank: 7, label: '싱숭생숭', state: null },
    { rank: 8, label: 'zoo', state: 'up' },
  ];

  // 최근 검색어 칩 컴포넌트
  const RecentSearchChip = memo(function RecentSearchChip({
    keyword,
    onPressDelete,
  }) {
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
        {state === 'up' && <RankUp />}
        {state === 'down' && <RankDown />}
        {state === null && <RankNone />}
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
          <Pressable onPress={() => setRecentSearchKeywords([])}>
            <Text style={styles.clearAllText}>전체 삭제</Text>
          </Pressable>
        </View>
        <ScrollView
          horizontal
          style={styles.recentSearchList}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          {recentSearchKeywords.map((keyword, index) => (
            <RecentSearchChip
              key={index}
              keyword={keyword}
              onPressDelete={() => {
                setRecentSearchKeywords(prev =>
                  prev.filter((item, i) => i !== index),
                );
              }}
            />
          ))}
        </ScrollView>
      </View>
      {/* 채널 기반 키워드 추천 */}
      <View style={styles.keywordRecommendationContainer}>
        <Text style={[styles.headerTitleText, { marginBottom: 20 }]}>
          채널 기반 키워드 추천
        </Text>
        <View style={styles.keywordRecommendations}>
          {keywordRecommendations.map((keyword, index) => (
            <Chip key={index} label={keyword} />
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
            {keywordRanking.slice(0, 4).map(({ rank, label, state }) => (
              <KeywordRankingItem
                key={rank}
                rank={rank}
                label={label}
                state={state}
              />
            ))}
          </View>
          <View style={styles.keywordRankingList}>
            {keywordRanking.slice(4, 8).map(({ rank, label, state }) => (
              <KeywordRankingItem
                key={rank}
                rank={rank}
                label={label}
                state={state}
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
