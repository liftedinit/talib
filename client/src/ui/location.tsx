import { FaCircle } from '@react-icons/all-files/fa/FaCircle';

interface LocationProps {
  radius: number;
  borderColor: string;
  fillColor: string;
}

export function Location ({ radius, borderColor, fillColor}: LocationProps) {
  
  return (
    <FaCircle 
      size={radius}
      color={fillColor}
      style={{ position: 'absolute'}}
    />
      
  );
};