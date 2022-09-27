import type LinkTable from "lib/types/linkTable";

type AddressDetail = {
  block_hash: LinkTable;
  time: string;
  from: LinkTable;
  to: LinkTable;
  type: string;
};

export default AddressDetail;
