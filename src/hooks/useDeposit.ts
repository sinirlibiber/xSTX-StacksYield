'use client';

import { useState, useCallback } from 'react';
import { depositToPool } from '@/lib/stacks/contracts';
import type { DepositState } from '@/types/pool';

export function useDeposit(): {
  depositState: DepositState;
  deposit: (poolAddress: string, amount: number, userAddress: string) => Promise<boolean>;
  reset: () => void;
} {
  const [depositState, setDepositState] = useState<DepositState>({
    isLoading: false,
    txId: null,
    error: null,
  });

  const deposit = useCallback(
    async (poolAddress: string, amount: number, userAddress: string): Promise<boolean> => {
      setDepositState({
        isLoading: true,
        txId: null,
        error: null,
      });

      try {
        const result = await depositToPool(poolAddress, amount, userAddress);

        if (result.success && result.txId) {
          setDepositState({
            isLoading: false,
            txId: result.txId,
            error: null,
          });
          return true;
        } else {
          setDepositState({
            isLoading: false,
            txId: null,
            error: result.error || 'Transaction failed',
          });
          return false;
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setDepositState({
          isLoading: false,
          txId: null,
          error: errorMessage,
        });
        return false;
      }
    },
    []
  );

  const reset = useCallback((): void => {
    setDepositState({
      isLoading: false,
      txId: null,
      error: null,
    });
  }, []);

  return {
    depositState,
    deposit,
    reset,
  };
}
