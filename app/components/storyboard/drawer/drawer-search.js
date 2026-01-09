import useThemedStyle from '@/app/hooks/use-themed-style';
import { Pressable, ScrollView, Text, View } from 'react-native';

export default function DrawerSearch({ query, isSubmitted }) {
  const { styles, isDark } = useThemedStyle(getStyles);

  // 더미 데이터
  const searchResultsDummy = [
    {
      // // 스토리보드와 채팅 모두 존재
      // storyboards: ['스토리보드1', '스토리보드2'],
      // chats: ['채팅1', '채팅2'],
      // // 스토리보드만 존재
      // storyboards: ['스토리보드1', '스토리보드2'],
      // chats: [],
      // // 채팅만 존재
      // storyboards: [],
      // chats: ['채팅1', '채팅2'],
      // 검색 결과 없음
      storyboards: [],
      chats: [],
    },
  ];

  return (
    <View>
      {!isSubmitted ? (
        <View />
      ) : (
        <ScrollView>
          {searchResultsDummy.map((result, index) => (
            <View key={index}>
              {result.storyboards.length > 0 && (
                // 스토리보드 검색 결과
                <View style={styles.resultContainer}>
                  <Text style={styles.resultLabel}>스토리보드</Text>
                  <View style={styles.resultList}>
                    {result.storyboards.map((storyboard, sbIndex) => (
                      <Pressable
                        key={sbIndex}
                        // 라우팅
                      >
                        <Text style={styles.resultText}>{storyboard}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              )}
              {result.chats.length > 0 && (
                // 채팅 검색 결과
                <View style={styles.resultContainer}>
                  <Text style={styles.resultLabel}>채팅</Text>
                  <View style={styles.resultList}>
                    {result.chats.map((chat, chatIndex) => (
                      <Pressable
                        key={chatIndex}
                        // 라우팅
                      >
                        <Text style={styles.resultText}>{chat}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              )}
              {!result.storyboards.length && !result.chats.length && (
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
            </View>
          ))}
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
