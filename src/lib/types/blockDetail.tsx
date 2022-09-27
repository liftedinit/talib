import type LinkTable from "lib/types/linkTable";

type BlockDetail = {
  id: number;
  block_hash: LinkTable;
  time: string;
  from: LinkTable;
  to: LinkTable;
  type: string;
};

export default BlockDetail;
