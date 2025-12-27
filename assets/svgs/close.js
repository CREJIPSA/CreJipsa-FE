import Svg, { Path } from 'react-native-svg';

export default function RemoveChannelIcon({ color, size }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M13.5 0.5L0.5 13.5M0.5 0.5L13.5 13.5"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
