export type StacksNetworkType = 'testnet' | 'mainnet' | 'devnet' | 'mocknet';

export interface WalletConnection {
  address: string;
  isConnected: boolean;
  balance: number;
}

export interface ContractCallOptions {
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: unknown[];
  network: StacksNetworkType;
}

export interface TransactionResult {
  txId: string;
  success: boolean;
  error?: string;
}
