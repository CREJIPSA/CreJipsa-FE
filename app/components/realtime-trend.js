import { format } from 'date-fns';
import { Image, Text, useColorScheme, View } from 'react-native';
import Svg, { ClipPath, Defs, Path, Image as SvgImage } from 'react-native-svg';

const images = {
  trendRank1Image: require('../../assets/images/trend_rank1.png'),
  trendRank2Image: require('../../assets/images/trend_rank2.png'),
  trendRank3Image: require('../../assets/images/trend_rank3.png'),
  trendRank4Image: require('../../assets/images/trend_rank4.png'),
};

function TrendCard({ width, height, path, children, imageUrl, contentStyle }) {
  const image = images[imageUrl];
  const imageSource = Image.resolveAssetSource(image);

  return (
    <View style={{ overflow: 'hidden' }}>
      <Svg width={width} height={height}>
        <Defs>
          <ClipPath id="clip">
            <Path d={path} />
          </ClipPath>
        </Defs>
        <SvgImage
          href={imageSource}
          width={width}
          height={height}
          preserveAspectRatio="xMidYMid slice"
          clipPath="url(#clip)"
        />
      </Svg>
      <View
        style={[
          {
            position: 'absolute',
            insets: 0,
          },
          contentStyle,
        ]}
      >
        {children}
      </View>
    </View>
  );
}

export const getFirstTrendCardPath = (width, height) => {
  const cutX = width * 0.8;
  const cutY = height * 0.47;
  const r = 30;

  return `
    M0 ${r}
    Q0 0 ${r} 0
    H${width - r}
    Q${width} 0 ${width} ${r}
    V${cutY - r}
    Q${width} ${cutY} ${width - r} ${cutY}
    H${cutX + r}
    Q${cutX} ${cutY} ${cutX} ${cutY + r}
    V${height - r}
    Q${cutX} ${height} ${cutX - r} ${height}
    H${r}
    Q0 ${height} 0 ${height - r}
    Z
  `;
};

export const getSecondTrendCardPath = (width, height) => {
  const cutX = width * 0.75;
  const cutY = height * 0.48;
  const r = 30;

  return `
    M0 ${r}
    Q0 0 ${r} 0
    H${width - r}
    Q${width} 0 ${width} ${r}
    V${cutY - r}
    Q${width} ${cutY} ${width - r} ${cutY}
    H${cutX + r}
    Q${cutX} ${cutY} ${cutX} ${cutY + r}
    V${height - r}
    Q${cutX} ${height} ${cutX - r} ${height}
    H${r}
    Q0 ${height} 0 ${height - r}
    Z
  `;
};

export const getThirdTrendCardPath = (width, height) => {
  const cutX = width * 0.34;
  const cutY = height * 0.52;
  const r = 30;

  return `
    M${cutX + r} 0
    H${width - r}
    Q${width} 0 ${width} ${r}
    V${height - r}
    Q${width} ${height} ${width - r} ${height}
    H${r}
    Q0 ${height} 0 ${height - r}
    V${cutY + r}
    Q0 ${cutY} ${r} ${cutY}
    H${cutX - r}
    Q${cutX} ${cutY} ${cutX} ${cutY - r}
    V${r}
    Q${cutX} 0 ${cutX + r} 0
    Z
  `;
};

export const getFourthTrendCardPath = (width, height) => {
  const r = 30;

  return `
    M${r} 0
    H${width - r}
    Q${width} 0 ${width} ${r}
    V${height - r}
    Q${width} ${height} ${width - r} ${height}
    H${r}
    Q0 ${height} 0 ${height - r}
    V${r}
    Q0 0 ${r} 0
    Z
  `;
};

const RealTimeTrend = ({ realTimeTrendData }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = getStyles(isDark);

  // (임시) 현재 시간을 마지막 업데이트로 설정
  const lastUpdateTime = format(new Date(), 'yyyy년 MM월 dd일 HH:mm');

  const RealTimeTrendCard = c => {
    return (
      <TrendCard
        key={c.rank}
        width={c.width}
        height={c.height}
        path={c.path}
        imageUrl={c.imageUrl}
        contentStyle={c.contentStyle}
      >
        <View style={{ flex: 1, position: 'relative', height: c.height }}>
          <View
            style={
              c.rank === 3 && {
                position: 'absolute',
                left: c.width * 0.33,
              }
            }
          >
            <Text style={styles.rankText}>{c.rank}위</Text>
            {c.tag && (
              <View style={styles.tag}>
                <Text style={styles.tagText}>#{c.tag}</Text>
              </View>
            )}
          </View>
          <View
            style={{
              position: 'absolute',
              bottom: 20,
              left: 20,
              width: c.width - 30,
            }}
          >
            <Text
              style={styles.trendCardTitleText}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {c.title}
            </Text>
          </View>
        </View>
      </TrendCard>
    );
  };

  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.titleText}>실시간 트렌드</Text>
        <Text style={styles.lastUpdateText}>
          마지막 업데이트{'\n'}
          {lastUpdateTime}
        </Text>
      </View>
      <View style={{ justifyContent: 'flex-end' }}>
        <View style={styles.trendCardTopContainer}>
          <RealTimeTrendCard {...realTimeTrendData[0]} />
          <View style={styles.rank4TrendCard}>
            <RealTimeTrendCard {...realTimeTrendData[1]} />
          </View>
        </View>
        <View style={styles.trendCardBottomContainer}>
          <RealTimeTrendCard {...realTimeTrendData[2]} />
          <View style={styles.rank3TrendCard}>
            <RealTimeTrendCard {...realTimeTrendData[3]} />
          </View>
        </View>
      </View>
    </>
  );
};

export default RealTimeTrend;

const getStyles = isDark => {
  const colors = {
    background: isDark ? '#202020' : '#FAFAFA',
    text: isDark ? '#FAFAFA' : '#141414',
  };

  return {
    sectionHeader: {
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
      color: colors.text,
    },
    lastUpdateText: {
      fontSize: 12,
      color: isDark ? '#D3D3D3' : '#666',
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
      marginBottom: 40,
      position: 'relative',
    },
    rank3TrendCard: {
      position: 'absolute',
      right: 16,
    },
    rankText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#141414',
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
  };
};
