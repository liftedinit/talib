import type LinkTable from "lib/types/linkTable";

type Node = {
  node_name: string;
  node_ip: LinkTable;
  address: string;
  time: string;
  total_staked: string;
  total_rewards: string;
  total_computing_power: string;
  latency: string;
};
export default Node;
