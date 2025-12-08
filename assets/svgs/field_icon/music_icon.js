import Svg, { Path } from 'react-native-svg';

export default function MusicIcon({ size, color }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M14 0C21.732 0 28 6.26801 28 14C28 21.732 21.732 28 14 28C6.26801 28 0 21.732 0 14C0 6.26801 6.26801 0 14 0ZM11.9873 8.07812C10.7429 7.35974 9.18763 8.25751 9.1875 9.69434V18.8887C9.1875 20.3255 10.7429 21.224 11.9873 20.5059L19.9502 15.9082C21.1945 15.1897 21.1946 13.3933 19.9502 12.6748L11.9873 8.07812Z"
        fill={color}
      />
    </Svg>
  );
}
