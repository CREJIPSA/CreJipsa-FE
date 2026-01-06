import Svg, { Path, Rect } from 'react-native-svg';

const TrendIcon = ({ size = 40, color }) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Rect
        x="3.3335"
        y="3.33337"
        width="15.3845"
        height="15.3437"
        rx="1.33333"
        fill="#C9C9C9"
      />
      <Path
        d="M3.3335 21.323H18.718V36.6667H10.0002C6.31827 36.6667 3.3335 33.6819 3.3335 30V21.323Z"
        fill="#C9C9C9"
      />
      <Rect
        x="21.282"
        y="3.33337"
        width="15.3845"
        height="15.3437"
        rx="1.33333"
        fill={color}
      />
      <Rect
        x="21.282"
        y="21.323"
        width="15.3845"
        height="15.3437"
        rx="1.33333"
        fill="#C9C9C9"
      />
    </Svg>
  );
};

export default TrendIcon;
