import type LinkTable from "lib/types/linkTable";

type Block = {
  id: number;
  block_hash: LinkTable;
  time: string;
  num_of_txs: string;
  mined_by: LinkTable;
};

export default Block;
