import Svg, { Path } from 'react-native-svg';

export default function SendIcon({ color, size }) {
  return (
    <Svg
      width={size}
      height={size * (18 / 14)}
      viewBox="0 0 14 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M6.75 16.75V0.75M6.75 0.75L12.75 6.75M6.75 0.75L0.75 6.75"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
