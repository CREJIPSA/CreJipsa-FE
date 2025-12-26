import Svg, { Path } from 'react-native-svg';
import useThemedStyle from '../../app/hooks/use-themed-style';

export default function RankNone() {
  const { isDark } = useThemedStyle(getStyles);

  return (
    <Svg
      width="5"
      height="1"
      viewBox="0 0 5 1"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M0 0.416667V0H5V0.416667H0Z"
        fill={isDark ? '#FAFAFA' : '#141414'}
      />
    </Svg>
  );
}

const getStyles = () => ({});
