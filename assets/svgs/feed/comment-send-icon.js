import Svg, { Path, Rect } from 'react-native-svg';

export default function CommentSendIcon({
  size = 40,
  bgColor = '#CCFF66',
  iconColor = '#141414',
}) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 배경 원형 박스 */}
      <Rect width="40" height="40" rx="20" fill={bgColor} />

      {/* 종이비행기 아이콘 */}
      <Path
        d="M28.7117 14.544C29.1437 13.349 27.9857 12.191 26.7907 12.624L12.1857 17.906C10.9867 18.34 10.8417 19.976 11.9447 20.615L16.6067 23.314L20.7697 19.151C20.9583 18.9688 21.2109 18.868 21.4731 18.8703C21.7353 18.8726 21.9861 18.9778 22.1715 19.1632C22.357 19.3486 22.4621 19.5994 22.4644 19.8616C22.4667 20.1238 22.3659 20.3764 22.1837 20.565L18.0207 24.728L20.7207 29.39C21.3587 30.493 22.9947 30.347 23.4287 29.149L28.7117 14.544Z"
        fill={iconColor}
      />
    </Svg>
  );
}
