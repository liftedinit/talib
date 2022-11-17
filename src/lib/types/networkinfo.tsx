type NetworkInfo = {
  id: number;
  neighborhood: string;
  serverName: string;
  address: string;
  attributes: number[];
  serverVersion: string;
  protocolVersion: number;
  timeDeltaInSecs: number;
  publicKey: JSON;
  networkData: JSON;
  created_at: Date;
  updated_at: Date;
};

export default NetworkInfo;
