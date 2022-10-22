type BlockInformation = {
  id: number;
  tsx_per_sec: number;
  tsx_tps: number;
  block_height: string;
  hash_rate: number;
  computer_power_used: number;
  computer_power_available: string;
  active_nodes: number;
  total_nodes: string;
};

export default BlockInformation;
