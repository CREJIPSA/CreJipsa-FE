import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { Dimensions, Image, Text, View } from 'react-native';
import Svg, { ClipPath, Defs, Path, Image as SvgImage } from 'react-native-svg';
import useThemedStyle from '../hooks/use-themed-style';

const images = {
  trendRank1Image: require('../../assets/images/graphic/trend_rank1.png'),
  trendRank2Image: require('../../assets/images/graphic/trend_rank2.png'),
  trendRank3Image: require('../../assets/images/graphic/trend_rank3.png'),
  trendRank4Image: require('../../assets/images/graphic/trend_rank4.png'),
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
  const cutY = height * 0.4;
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
  const cutX = width * 0.73;
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

export const getThirdTrendCardPath = (width, height) => {
  const cutX = width * 0.36;
  const cutY = height * 0.53;
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

const RealTimeTrendCard = ({
  rank,
  width,
  height,
  path,
  imageUrl,
  contentStyle,
  inputTitle,
  styles,
}) => {
  const [title, setTitle] = useState('');

  useEffect(() => {
    setTitle(inputTitle);
  }, [inputTitle]);

  return (
    <TrendCard
      key={rank}
      width={width}
      height={height}
      path={path}
      imageUrl={imageUrl}
      contentStyle={contentStyle}
    >
      <View style={{ flex: 1, position: 'relative', height: height }}>
        <View
          style={
            rank === 3 && {
              position: 'absolute',
              left: width * 0.36,
            }
          }
        >
          <Text style={styles.rankText}>{rank}위</Text>
        </View>
        <View style={[styles.trendCardTitleContainer, { width: width - 30 }]}>
          <Text
            style={[styles.trendCardTitleText, rank === 2 && { width: '80%' }]}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {title}
          </Text>
        </View>
      </View>
    </TrendCard>
  );
};

const RealTimeTrend = ({ rankTrends }) => {
  const { styles } = useThemedStyle(getStyles);

  const viewWidth = Dimensions.get('window').width;
  const viewHeight = Dimensions.get('window').height;

  // (임시) 현재 시간을 마지막 업데이트로 설정
  const lastUpdateTime = format(new Date(), 'yyyy년 MM월 dd일 HH:mm');

  const realTimeTrendData = [
    {
      rank: 1,
      width: viewWidth * 0.75,
      height: viewHeight * 0.32,
      path: getFirstTrendCardPath(viewWidth * 0.75, viewHeight * 0.32),
      imageUrl: 'trendRank1Image',
    },
    {
      rank: 2,
      width: viewWidth * 0.6,
      height: viewHeight * 0.22,
      path: getSecondTrendCardPath(viewWidth * 0.6, viewHeight * 0.22),
      imageUrl: 'trendRank2Image',
    },
    {
      rank: 3,
      width: viewWidth * 0.45,
      height: viewHeight * 0.22,
      path: getThirdTrendCardPath(viewWidth * 0.45, viewHeight * 0.22),
      imageUrl: 'trendRank3Image',
    },
    {
      rank: 4,
      width: viewWidth * 0.29,
      height: viewHeight * 0.18,
      path: getFourthTrendCardPath(viewWidth * 0.29, viewHeight * 0.18),
      imageUrl: 'trendRank4Image',
    },
  ];

  return (
    <>
      <View style={{ justifyContent: 'flex-end' }}>
        <View style={styles.sectionHeader}>
          <Text style={styles.titleText}>실시간 트렌드</Text>
          <Text style={styles.lastUpdateText}>
            마지막 업데이트{'\n'}
            {lastUpdateTime}
          </Text>
        </View>
        <View style={styles.trendCardTopContainer}>
          <RealTimeTrendCard
            {...realTimeTrendData[0]}
            inputTitle={rankTrends[0]}
            styles={styles}
          />
          <View style={styles.rank4TrendCard}>
            <RealTimeTrendCard
              {...realTimeTrendData[3]}
              inputTitle={rankTrends[3]}
              styles={styles}
            />
          </View>
        </View>
        <View style={styles.trendCardBottomContainer}>
          <RealTimeTrendCard
            {...realTimeTrendData[1]}
            inputTitle={rankTrends[1]}
            styles={styles}
          />
          <View style={styles.rank3TrendCard}>
            <RealTimeTrendCard
              {...realTimeTrendData[2]}
              inputTitle={rankTrends[2]}
              styles={styles}
            />
          </View>
        </View>
      </View>
    </>
  );
};

export default RealTimeTrend;

const getStyles = isDark => {
  const colors = {
    text: isDark ? '#FAFAFA' : '#141414',
  };

  return {
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingTop: 20,
      marginBottom: 40,
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
      paddingTop: 18,
      paddingLeft: 20,
    },
    trendCardTitleContainer: {
      position: 'absolute',
      bottom: 20,
      left: 20,
    },
    trendCardTitleText: {
      width: '100%',
      paddingRight: 20,
      fontSize: 24,
      lineHeight: 30,
      color: '#141414',
    },
  };
};
