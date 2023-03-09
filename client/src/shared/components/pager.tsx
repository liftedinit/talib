import { Button, ButtonGroup, Center } from "@liftedinit/ui";

interface PagerProps {
  page: number;
  setPage: (p: number) => void;
  totalPages: number;
}

export function Pager({ page, setPage, totalPages }: PagerProps) {
  return (
    <Center my={6}>
      <ButtonGroup isAttached>
        <Button onClick={() => setPage(page - 1)} isDisabled={page === 1}>
          Previous
        </Button>
        <Button
          onClick={() => setPage(page + 1)}
          isDisabled={page >= totalPages}
        >
          Next
        </Button>
      </ButtonGroup>
    </Center>
  );
}
