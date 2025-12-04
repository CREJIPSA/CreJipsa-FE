import Svg, { Path } from 'react-native-svg';

export default function SignupGenderFemaleIcon({ size, color }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 49 79"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M24.5 0C38.031 0 49 10.969 49 24.5C49 36.4936 40.3814 46.4718 29 48.585V60H38C40.2091 60 42 61.7909 42 64C42 66.2091 40.2091 68 38 68H29V75C29 77.2091 27.2091 79 25 79C22.7909 79 21 77.2091 21 75V68H12C9.79086 68 8 66.2091 8 64C8 61.7909 9.79086 60 12 60H21V48.749C9.12717 47.0505 0 36.8425 0 24.5C0 10.969 10.969 0 24.5 0ZM24.5 8C15.3873 8 8 15.3873 8 24.5C8 33.6127 15.3873 41 24.5 41C33.6127 41 41 33.6127 41 24.5C41 15.3873 33.6127 8 24.5 8Z"
        fill={color}
      />
    </Svg>
  );
}
