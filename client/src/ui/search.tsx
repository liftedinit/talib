import {
  CheckIcon,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  SearchIcon,
} from "@liftedinit/ui";
import { FormEvent, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";

const validTerms = [
  { path: "blocks", regex: /^\d+$/ },
  { path: "transactions", regex: /^[0-9a-f]{64}$/ },
  { path: "address", regex: /^m[0-9a-zA-Z]{49,54}$/ },
];

function isValid(term: string) {
  return validTerms.some((t) => t.regex.test(term));
}

function maybeNavigate(term: string, navigate: NavigateFunction) {
  return function (e: FormEvent) {
    e.preventDefault();
    for (let t of validTerms) {
      if (t.regex.test(term)) {
        navigate(`/${t.path}/${term}`);
      }
    }
  };
}

export function Search() {
  const [term, setTerm] = useState("");
  const navigate = useNavigate();

  return (
    <form onSubmit={maybeNavigate(term, navigate)}>
      <InputGroup bg="white">
        <InputLeftElement children={<SearchIcon />} />
        <Input
          placeholder="Search by block height, transaction hash, or address"
          onChange={(e) => setTerm(e.target.value)}
        />
        {isValid(term) && (
          <InputRightElement children={<CheckIcon color="brand.teal.500" />} />
        )}
      </InputGroup>
    </form>
  );
}
