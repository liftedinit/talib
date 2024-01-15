interface LocationProps {
  radius: number;
  fillColor: string;
  strokeColor: string;
}

export function Location ({ radius, fillColor, strokeColor}: LocationProps) {
  
  return (
    <circle
      r={radius}
      fill={fillColor}
      fillOpacity="0.03"
      stroke={strokeColor}
      strokeWidth="0.5"
      strokeOpacity="0.4"
    />
  );
};
