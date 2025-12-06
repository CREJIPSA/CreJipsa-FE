import Svg, { Ellipse } from 'react-native-svg';

export default function FashionIcon({ size, color }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Ellipse cx="14" cy="5.47826" rx="3.04348" ry="5.47826" fill={color} />
      <Ellipse cx="14" cy="22.5217" rx="3.04348" ry="5.47826" fill={color} />
      <Ellipse
        cx="5.47825"
        cy="14"
        rx="3.04348"
        ry="5.47826"
        transform="rotate(90 5.47825 14)"
        fill={color}
      />
      <Ellipse
        cx="22.5217"
        cy="14"
        rx="3.04348"
        ry="5.47826"
        transform="rotate(90 22.5217 14)"
        fill={color}
      />
      <Ellipse
        cx="8.06033"
        cy="8.06028"
        rx="2.8"
        ry="5.6"
        transform="rotate(-45 8.06033 8.06028)"
        fill={color}
      />
      <Ellipse
        cx="19.9397"
        cy="19.9397"
        rx="2.8"
        ry="5.6"
        transform="rotate(-45 19.9397 19.9397)"
        fill={color}
      />
      <Ellipse
        cx="8.06032"
        cy="19.9397"
        rx="2.8"
        ry="5.6"
        transform="rotate(45 8.06032 19.9397)"
        fill={color}
      />
      <Ellipse
        cx="19.9397"
        cy="8.0603"
        rx="2.8"
        ry="5.6"
        transform="rotate(45 19.9397 8.0603)"
        fill={color}
      />
    </Svg>
  );
}
