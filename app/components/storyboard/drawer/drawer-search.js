import { AuthContext } from '@/app/_layout';
import useThemedStyle from '@/app/hooks/use-themed-style';
import { router } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

export default function DrawerSearch({ query, isSubmitted }) {
  const { styles, isDark } = useThemedStyle(getStyles);

  const { accessToken } = useContext(AuthContext);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const encodedQuery = encodeURIComponent(
      Array.isArray(query) ? (query[0] ?? '') : (query ?? ''),
    );
    if (query === '' || query == null) {
      setSearchResults([]);
      return;
    }
    fetch(`https://dev.crezipsa.site/api/search?keyword=${encodedQuery}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })
      .then(async res => {
        const raw = await res.text();
        console.log('drawer search api status', res.status);
        console.log('drawer search api response', raw);

        let data = null;
        try {
          data = raw ? JSON.parse(raw) : null;
        } catch (e) {
          console.error('Error parsing drawer search API response JSON:', e);
        }

        if (!res.ok) throw new Error('Drawer search API request failed');
        return data;
      })
      .then(data => {
        const result = data?.result;
        if (!result) {
          console.warn('No result found in drawer search API response');
          return;
        }
        setSearchResults(Array.isArray(result.items) ? result.items : []);
      })
      .catch(error => {
        console.error('Error during drawer search API request:', error);
      });
  }, [accessToken, query]);

  const storyboardResults = searchResults.filter(
    item => item.type === 'STORYBOARD',
  );
  const chatResults = searchResults.filter(item => item.type === 'CHAT_ROOM');

  return (
    <View>
      {!isSubmitted ? (
        <View />
      ) : (
        <ScrollView>
          {storyboardResults.length > 0 && (
            // 스토리보드 검색 결과
            <View style={styles.resultContainer}>
              <Text style={styles.resultLabel}>스토리보드</Text>
              <View style={styles.resultList}>
                {storyboardResults.map((storyboard, sbIndex) => (
                  <Pressable
                    key={sbIndex}
                    onPress={() =>
                      router.push(`/storyboard/edit/${storyboard.id}`)
                    }
                  >
                    <Text style={styles.resultText}>{storyboard.title}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}
          {chatResults.length > 0 && (
            // 채팅 검색 결과
            <View style={styles.resultContainer}>
              <Text style={styles.resultLabel}>채팅</Text>
              <View style={styles.resultList}>
                {chatResults.map((chat, chatIndex) => (
                  <Pressable
                    key={chatIndex}
                    onPress={() => router.push(`/storyboard/${chat.id}`)}
                  >
                    <Text style={styles.resultText}>{chat.title}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}
          {!storyboardResults.length && !chatResults.length && (
            // 검색 결과 없음
            <View>
              <Text style={styles.noResultText}>
                <Text style={{ color: isDark ? '#CCFF66' : '#A3CC52' }}>
                  {query}
                </Text>
                에 대한 검색 결과가 존재하지 않습니다.
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const getStyles = (isDark, primaryColors) => ({
  resultContainer: {
    gap: 16,
    marginBottom: 50,
  },
  resultLabel: {
    color: primaryColors.color,
    fontSize: 14,
    fontWeight: '100',
  },
  resultList: {
    gap: 24,
  },
  resultText: {
    color: primaryColors.color,
    fontSize: 16,
  },
  noResultText: {
    color: primaryColors.color,
    fontSize: 14,
    fontWeight: '100',
  },
});
