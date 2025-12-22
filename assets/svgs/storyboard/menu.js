import Svg, { Path } from 'react-native-svg';

export default function MenuIcon({ color, size }) {
  return (
    <Svg
      width={size}
      height={size * 0.7}
      viewBox="0 0 20 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M0.75 0.75H18.75M0.75 6.75H18.75M0.75 12.75H18.75"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
