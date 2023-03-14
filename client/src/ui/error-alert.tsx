import { TimesCircleIcon, Tooltip } from "@liftedinit/ui";

export function ErrorAlert({ error }: { error: Error }) {
  return (
    <Tooltip label={error.message} placement="top" hasArrow>
      <span>
        <TimesCircleIcon color="red" boxSize={6} />
      </span>
    </Tooltip>
  );
}
