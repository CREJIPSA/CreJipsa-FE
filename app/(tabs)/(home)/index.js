import { format } from 'date-fns';
import { Dimensions, SectionList, Text, View, useColorScheme } from "react-native";
import TrendCard, { getFirstTrendCardPath, getFourthTrendCardPath, getSecondTrendCardPath, getThirdTrendCardPath } from '../../../components/trendcard';

export default function Home() {

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = getStyles(isDark);

  const realTimeTrendData = [ // 임의
      {
        rank: 1,
        tag: "#음악",
        title: "AOA 짧은 치마",
        width: Dimensions.get('window').width * 0.75,
        height: Dimensions.get('window').height * 0.43,
        path: getFirstTrendCardPath(Dimensions.get('window').width * 0.75, Dimensions.get('window').height * 0.43),
        fill: "#CCFF66"
      },
      {
        rank: 4,
        tag: "#음악",
        title: "00 챌린지",
        width: Dimensions.get('window').width * 0.29,
        height: Dimensions.get('window').height * 0.22,
        path: getFourthTrendCardPath(Dimensions.get('window').width * 0.29, Dimensions.get('window').height * 0.22),
        fill: "#ED7658"
      },
      {
        rank: 2,
        tag: "#게임",
        title: "배틀 그라운드",
        width: Dimensions.get('window').width * 0.60,
        height: Dimensions.get('window').height * 0.2, 
        path: getSecondTrendCardPath(Dimensions.get('window').width * 0.60, Dimensions.get('window').height * 0.2),
        fill: "#4B4AEE"
      }, 
      {
        rank: 3,
        tag: "#게임",
        title: "배틀 그라운드",
        width: Dimensions.get('window').width * 0.44,
        height: Dimensions.get('window').height * 0.2,
        path: getThirdTrendCardPath(Dimensions.get('window').width * 0.44, Dimensions.get('window').height * 0.2),
        fill: "#E1FFA4"
      },
  ];
  const rawData = [
    { title: "실시간 트렌드", data: [ null ] },
    { title: "트렌드 리포트", data: ["Item 4", "Item 5", "Item 6"] },
  ]
  const DATA = rawData.map(section => ({
    title: section.title,
    data: section.data,
  }));

  const renderCard = (c) => {
    return (
      <TrendCard
        key={c.rank}
        width={c.width}
        height={c.height}
        path={c.path}
        fill={c.fill}
        contentStyle={c.contentStyle}
      >
        <View style={{ flex: 1, position: 'relative', height: c.height }}>  
          <View style={c.rank === 3 && {
            position: 'absolute',
            left: c.width * 0.33
          }}>
            <Text style={styles.rankText}>{c.rank}위</Text>
            {c.tag && (
              <View style={styles.tag}>
                <Text style={styles.tagText}>{c.tag}</Text>
              </View>
            )}
          </View>
          <View style={{ position: 'absolute', bottom: 20, left: 20, width: c.width - 30 }}>
            <Text 
              style={styles.trendCardTitleText}
              numberOfLines={2}
              ellipsizeMode='tail'
            >{c.title}</Text>
          </View>
        </View>
      </TrendCard>
    );
  };

  // (임시) 현재 시간을 마지막 업데이트로 설정
  const lastUpdateTime = format(new Date(), 'yyyy년 MM월 dd일 HH:mm');

  return (
    <View style={styles.mainContainer}>
      <SectionList 
        sections={DATA}
        keyExtractor={(item, index) => item + index}
        renderItem={({item, section}) => {
          if (section.title === "실시간 트렌드") {
            return (
              <View style={{ justifyContent: 'flex-end' }}>
                <View style={styles.trendCardTopContainer}>
                  {renderCard(realTimeTrendData[0])}
                  <View style={styles.rank4TrendCard}>
                    {renderCard(realTimeTrendData[1])}
                  </View>
                </View>
                <View style={styles.trendCardBottomContainer}>
                  {renderCard(realTimeTrendData[2])}
                  <View style={styles.rank3TrendCard}>
                    {renderCard(realTimeTrendData[3])}
                  </View>
                </View>
              </View>
            )
          } else { // 트렌드 리포트
            return (
              <Text>{item}</Text>
            )
          }
        }}
        renderSectionHeader={({section: {title}}) => (
          <View style={styles.header}>
            <Text style={styles.titleText}>{title}</Text>
            {title === "실시간 트렌드" && (
              <Text style={styles.lastUpdateText}>마지막 업데이트{'\n'}{lastUpdateTime}</Text>
            )}
          </View>
        )}
      />
    </View>
  );
}

const getStyles = (isDark) => ({
  mainContainer: {
    flex: 1,
    backgroundColor: isDark ? '#202020' : '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 30,
    marginBottom: 20,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: isDark ? '#FAFAFA' : '#000',
  },
  lastUpdateText: {
    fontSize: 12,
    color: isDark ? '#D3D3D3' : '#555',
    textAlign: 'right',
  },
  trendCardTopContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    position: 'relative',
  },
  rank4TrendCard: {
    position: 'absolute',
    right: 16,
    borderRadius: 30,
  },
  trendCardBottomContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    marginTop: 15,
    position: 'relative',
  },
  rank3TrendCard: {
    position: 'absolute',
    right: 16,
  },
  rankText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: isDark ? '#141414' : '#FFF',
    paddingTop: 20,
    paddingLeft: 25,
  },
  tag: {
    marginTop: 8,
    marginLeft: 20,
    backgroundColor: '#141414',
    padding: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagText: {
    fontSize: 16,
    color: '#FAFAFA',
  },
  trendCardTitleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#141414',
  },
});