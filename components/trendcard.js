import { View } from "react-native";
import Svg, { ClipPath, Defs, Path, Rect, Image as SvgImage } from 'react-native-svg';

export default function TrendCard({ width, height, path, children, imageUrl, fill, contentStyle }) {
  
  return (
    <View style={{ overflow: 'hidden' }}>
      <Svg width={width} height={height}>
        <Defs>
          <ClipPath id="clip">
            <Path d={path} />
          </ClipPath>
        </Defs>
        {imageUrl 
        ? ( 
          <SvgImage 
            href={{uri: imageUrl}} 
            width={width} 
            height={height} 
            clipPath="url(#clip)" 
          /> ) 
        : ( 
          <Rect 
            width={width} 
            height={height} 
            fill={fill} 
            clipPath="url(#clip)" 
          /> )}
      </Svg>
      <View
        style={[
        {
          position: 'absolute',
          insets: 0,
        },
        contentStyle,]}
      >
        {children}
      </View>
    </View>
  )
};

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
}

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
}

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
}

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
}