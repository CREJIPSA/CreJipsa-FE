import { AuthContext } from '@/app/_layout';
import useThemedStyle from '@/app/hooks/use-themed-style';
import { useFocusEffect } from 'expo-router';
import { useCallback, useContext, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchMyTrends } from './api/my';
import TrendKeywordCard from './components/trend-keyword-card';

export default function MyTrends() {
  const { accessToken } = useContext(AuthContext);
  const { isDark, styles, primaryColors } = useThemedStyle(getStyles);

  const [groupedTrends, setGroupedTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  const transformData = flatList => {
    const groups = flatList.reduce((acc, item) => {
      const date = item.createdAt;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push({
        id: item.keywordStoragedId,
        tag: item.category,
        title: item.keyword,
      });
      return acc;
    }, {});

    return Object.keys(groups)
      .sort((a, b) => b.localeCompare(a))
      .map(date => ({
        date: date.replaceAll('-', '.'),
        items: groups[date],
      }));
  };

  const loadTrends = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchMyTrends(accessToken);

      if (res.success) {
        const processedData = transformData(res.result);
        setGroupedTrends(processedData);
      }
    } catch (error) {
      console.error('트렌드 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useFocusEffect(
    useCallback(() => {
      if (accessToken) {
        loadTrends();
      }
    }, [accessToken, loadTrends]),
  );

  if (loading) {
    return (
      <SafeAreaView
        style={[
          styles.safeArea,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <ActivityIndicator size="large" color={primaryColors.pointColor} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>내 트렌드함</Text>
        </View>

        <View style={styles.trendsContainer}>
          {groupedTrends.length > 0 ? (
            groupedTrends.map(group => (
              <View key={group.date} style={styles.dayGroup}>
                <Text style={styles.dateText}>{group.date}</Text>
                <View style={styles.cardGroup}>
                  {group.items.map(item => (
                    <TrendKeywordCard
                      key={item.id}
                      tag={item.tag}
                      title={item.title}
                      showTag={true}
                    />
                  ))}
                </View>
              </View>
            ))
          ) : (
            <View style={{ alignItems: 'center', marginTop: 100 }}>
              <Text style={{ color: '#999' }}>저장된 트렌드가 없습니다.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (isDark, primaryColors) => {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: primaryColors.background,
    },
    headerContainer: {
      paddingVertical: 10,
      paddingLeft: 16,
      paddingRight: 10,
      backgroundColor: primaryColors.background,
    },
    headerText: {
      fontSize: 20,
      fontWeight: '700',
      color: primaryColors.color,
    },
    trendsContainer: {
      marginTop: 20,
      paddingLeft: 16,
      paddingRight: 30,
      flexDirection: 'column',
      gap: 40,
    },
    dayGroup: {
      flexDirection: 'column',
      gap: 24,
    },
    dateText: {
      fontSize: 14,
      fontWeight: '500',
      color: primaryColors.color,
    },
    cardGroup: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      rowGap: 16,
    },
  });
};
