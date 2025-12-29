export interface Pool {
  id: string;
  name: string;
  asset: string;
  assetIcon: string;
  pairedAsset: string;
  apy: number;
  tvl: number;
  protocol: string;
  contractAddress: string;
  minDeposit: number;
}

export interface DepositState {
  isLoading: boolean;
  txId: string | null;
  error: string | null;
}

export interface UserPosition {
  poolId: string;
  amount: number;
  shares: number;
  earnedRewards: number;
}
