import { openContractCall } from '@stacks/connect';
import { 
  uintCV, 
  standardPrincipalCV,
  PostConditionMode,
  type ClarityValue
} from '@stacks/transactions';
import { getStacksNetwork } from './network';
import type { ContractCallOptions, TransactionResult } from '@/types/stacks';

export async function depositToPool(
  poolAddress: string,
  amount: number,
  userAddress: string
): Promise<TransactionResult> {
  const network = getStacksNetwork();
  
  // Convert STX amount to microSTX (1 STX = 1,000,000 microSTX)
  const amountInMicroSTX: bigint = BigInt(Math.floor(amount * 1_000_000));

  try {
    const txId = await new Promise<string>((resolve, reject) => {
      openContractCall({
        network,
        contractAddress: poolAddress.split('.')[0],
        contractName: poolAddress.split('.')[1] || 'liquidity-pool',
        functionName: 'deposit',
        functionArgs: [
          uintCV(amountInMicroSTX),
          standardPrincipalCV(userAddress)
        ],
        postConditionMode: PostConditionMode.Allow,
        onFinish: (data: { txId: string }) => {
          resolve(data.txId);
        },
        onCancel: () => {
          reject(new Error('Transaction cancelled by user'));
        },
      });
    });

    return {
      txId,
      success: true,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      txId: '',
      success: false,
      error: errorMessage,
    };
  }
}

export async function withdrawFromPool(
  poolAddress: string,
  shares: number,
  userAddress: string
): Promise<TransactionResult> {
  const network = getStacksNetwork();
  
  const sharesAmount: bigint = BigInt(Math.floor(shares));

  try {
    const txId = await new Promise<string>((resolve, reject) => {
      openContractCall({
        network,
        contractAddress: poolAddress.split('.')[0],
        contractName: poolAddress.split('.')[1] || 'liquidity-pool',
        functionName: 'withdraw',
        functionArgs: [
          uintCV(sharesAmount),
          standardPrincipalCV(userAddress)
        ],
        postConditionMode: PostConditionMode.Allow,
        onFinish: (data: { txId: string }) => {
          resolve(data.txId);
        },
        onCancel: () => {
          reject(new Error('Transaction cancelled by user'));
        },
      });
    });

    return {
      txId,
      success: true,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      txId: '',
      success: false,
      error: errorMessage,
    };
  }
}
