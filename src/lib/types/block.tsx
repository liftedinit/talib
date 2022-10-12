import type LinkTable from "lib/types/linkTable";

type Block = {
  id: number;
  block_hash: LinkTable;
  time: string;
  num_of_txs: string;
};

export default Block;
