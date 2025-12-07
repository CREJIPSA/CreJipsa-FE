import Svg, { Circle, ClipPath, Defs, G, Path, Rect } from 'react-native-svg';

export default function EditIcon({ size = 24, isDark }) {
  const circleColor = isDark ? '#959595' : '#D3D3D3'; // 배경 원 색상
  const iconColor = isDark ? '#454545' : '#666666'; // 연필 본체 색상

  // 연필 끝 선(Stroke) 처리:
  const strokeColor = isDark ? iconColor : 'black';

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <G clipPath="url(#clip0_1046_3560)">
        {/* 배경 원 */}
        <Circle cx="12" cy="12" r="12" fill={circleColor} />

        {/* 연필 본체 */}
        <Path
          d="M5.2168 17.7971C5.2168 18.5335 5.81375 19.1304 6.55013 19.1304H7.64578C7.9994 19.1304 8.33854 18.99 8.58859 18.7399L18.187 9.14154C18.7077 8.62081 18.7077 7.77655 18.1869 7.25586L17.091 6.16012C16.5703 5.63947 15.7261 5.6395 15.2055 6.16019L5.60731 15.7587C5.35727 16.0087 5.2168 16.3478 5.2168 16.7014V17.7971Z"
          fill={iconColor}
        />

        {/* 연필 끝 부분 채우기 */}
        <Path
          d="M13.167 8.19861L16.1483 11.1799L13.167 8.19861Z"
          fill={iconColor}
        />

        {/* 연필 끝 부분 선 */}
        <Path
          d="M13.167 8.19861L16.1483 11.1799"
          stroke={strokeColor} // ⭐️ 동적 색상 적용
          strokeWidth="0.666667"
          strokeLinejoin="round"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_1046_3560">
          <Rect width="24" height="24" fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
