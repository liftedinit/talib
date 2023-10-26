import { Button, ButtonGroup, Center } from "@liftedinit/ui";
import { useButtonBg } from "utils";

interface PagerProps {
  page: number;
  setPage: (p: number) => void;
  totalPages: number;
}

export function Pager({ page, setPage, totalPages }: PagerProps) {
  const buttonBg = useButtonBg();

  return (
    <Center my={6}>
      <ButtonGroup isAttached>
        <Button onClick={() => setPage(page - 1)} isDisabled={page === 1} bg={buttonBg}>
          Previous
        </Button>
        <Button
          onClick={() => setPage(page + 1)}
          isDisabled={page >= totalPages}
          bg={buttonBg}
        >
          Next
        </Button>
      </ButtonGroup>
    </Center>
  );
}
