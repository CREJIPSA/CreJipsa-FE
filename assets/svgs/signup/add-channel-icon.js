import Svg, { Path } from 'react-native-svg';
export default function AddChannelIcon({ size, color }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M5.75 10.75V0.75M0.75 5.75H10.75"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </Svg>
  );
}
