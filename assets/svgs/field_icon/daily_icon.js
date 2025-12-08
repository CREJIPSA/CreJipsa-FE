import Svg, { Rect } from 'react-native-svg';

export default function DailyIcon({ size, color }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Rect x="12.32" width="3.36" height="28" fill={color} />
      <Rect
        y="15.68"
        width="3.36"
        height="28"
        transform="rotate(-90 0 15.68)"
        fill={color}
      />
      <Rect
        x="5.44409"
        y="24.6831"
        width="2.94737"
        height="28"
        transform="rotate(-135 5.44409 24.6831)"
        fill={color}
      />
      <Rect
        width="2.94737"
        height="28"
        transform="matrix(0.707107 -0.707107 -0.707107 -0.707107 23.159 24.6831)"
        fill={color}
      />
    </Svg>
  );
}
