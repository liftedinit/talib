import { Stat as BaseStat, StatLabel, StatNumber } from '@liftedinit/ui';

interface StatProps {
  label: string;
  value: string | number | undefined;
}

export function Stat({ label, value }: StatProps) {
  return (
    <BaseStat bg="white" p={6}>
      <StatLabel>{label}</StatLabel>
      <StatNumber>{value ?? 'N/A'}</StatNumber>
    </BaseStat>
  );
}
