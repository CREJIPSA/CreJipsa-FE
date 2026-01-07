import Svg, { Circle, Path } from 'react-native-svg';

const WriteButtonIcon = ({
  size = 60,
  backgroundColor = '#B8E65C',
  color = '#323232',
}) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 60 60" // 그림자 영역 제외하고 순수 아이콘 영역만 설정
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 배경 원 */}
      <Circle cx="30" cy="30" r="30" fill={backgroundColor} />

      {/* 연필 모양 아이콘 */}
      <Path
        d="M17 43.3987H22.6567L43.3987 22.6567L37.7413 17L17 37.742V43.3987Z"
        stroke={color}
        strokeWidth="2.66667"
        strokeLinejoin="round"
      />
      <Path
        d="M32.085 22.6567L37.7416 28.3134"
        stroke="#323232"
        strokeWidth="2.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default WriteButtonIcon;
