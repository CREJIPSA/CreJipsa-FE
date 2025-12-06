import Svg, { Path } from 'react-native-svg';

export default function DeleteIcon({ size = 9, color = '#141414' }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 9 9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M7.92857 0.5L0.5 7.92857M0.5 0.5L7.92857 7.92857"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
