import Svg, { Path } from 'react-native-svg';

export default function FilterIcon({
  width = 13,
  height = 7,
  isDark,
  isUp = false,
  ...props
}) {
  const color = isDark ? '#CCFF66' : '#293314';

  const transformStyle = isUp
    ? {
        transform: [{ rotate: '180deg' }],
      }
    : {};

  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 13 7"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={transformStyle} // 회전 스타일 적용
      {...props}
    >
      <Path
        d="M6.06226 6.75L7.87914e-05 -1.14193e-06L12.1244 -8.1987e-08L6.06226 6.75Z"
        fill={color}
      />
    </Svg>
  );
}
