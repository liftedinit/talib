import { Stat as BaseStat, StatLabel, StatNumber } from "@liftedinit/ui";
import { useBgColor } from "utils";

interface StatProps {
  label: string;
  value: string | number | undefined;
}

export function Stat({ label, value }: StatProps) {

  const bg = useBgColor();

  return (
    <BaseStat p={6} bg={bg}>
      <StatLabel>{label}</StatLabel>
      <StatNumber>{value ?? "N/A"}</StatNumber>
    </BaseStat>
  );
}
