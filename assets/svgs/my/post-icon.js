import Svg, { Path } from 'react-native-svg';

const PostIcon = ({ size = 40, color = '#454545' }) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 연필 본체 */}
      <Path
        d="M0 28C0 28.7364 0.596954 29.3333 1.33333 29.3333H5.73322C6.08684 29.3333 6.42598 29.1929 6.67603 28.9428L28.3905 7.22837C28.9112 6.70765 28.9112 5.86338 28.3904 5.34269L23.9899 0.942714C23.4692 0.422061 22.625 0.422092 22.1043 0.942784L0.39051 22.6573C0.14047 22.9074 0 23.2465 0 23.6001V28Z"
        fill={color}
      />
      {/* 연필 촉 부분 */}
      <Path d="M16.762 6.28528L23.0475 12.5708L16.762 6.28528Z" fill={color} />
      {/* 연필 구분선 */}
      <Path
        d="M16.762 6.28528L23.0475 12.5708"
        stroke="black"
        strokeWidth="0.666667"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default PostIcon;
