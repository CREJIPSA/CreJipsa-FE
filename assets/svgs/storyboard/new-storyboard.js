import Svg, { Path } from 'react-native-svg';

export default function NewStoryboardIcon({ color, size }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M2 21.9463H6.27406L21.9463 6.27406L17.6717 2L2 17.6722L2 21.9463Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <Path
        d="M13.3967 6.27344L17.6708 10.5475"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
