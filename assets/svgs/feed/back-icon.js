import Svg, { Path } from 'react-native-svg';

const BackIcon = ({ color = 'white' }) => {
  return (
    <Svg width="9" height="15" viewBox="0 0 9 15" fill="none">
      <Path
        d="M7.5 0.75L0.75 7.5L7.5 14.25"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default BackIcon;
