import { Alert, AlertIcon, AlertTitle } from '@liftedinit/ui';

export function ErrorAlert({ error }: { error: Error }) {
  return (
    <Alert status="error">
      <AlertIcon />
      <AlertTitle>{error.message}</AlertTitle>
    </Alert>
  );
}
