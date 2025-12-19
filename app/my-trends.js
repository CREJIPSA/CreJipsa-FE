import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TrendKeywordCard from './components/trend-keyword-card';
import DUMMY_TRENDS from './constants/my/DUMMY_TRENDS';
import useThemedStyle from './hooks/use-themed-style';

export default function MyTrends() {
  const { styles } = useThemedStyle(getStyles);

  return (
    <SafeAreaView
      style={styles.safeArea}
      stickyHeader={[1]}
      showsVerticalScrollIndicator={false}
    >
      <ScrollView
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>내 트렌드함</Text>
        </View>
        <View style={styles.trendsContainer}>
          {DUMMY_TRENDS.map(group => (
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
          ))}
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
      fontWeight: 700,
      color: primaryColors.color,
    },

    trendsContainer: {
      marginTop: 60,
      marginLeft: 16,
      marginRight: 30,
      flexDirection: 'column',
      gap: 40,
    },

    dayGroup: {
      flexDirection: 'column',
      gap: 24,
    },

    dateText: {
      fontSize: 14,
      fontWeight: 500,
      height: 20,
      lineHeight: 20,
      color: primaryColors.color,
    },

    cardGroup: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      rowGap: 16,
    },
  });
};
