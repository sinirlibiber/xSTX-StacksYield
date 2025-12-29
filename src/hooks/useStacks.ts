'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  connectWallet, 
  disconnectWallet, 
  checkWalletConnection,
  getAddresses,
  getBalance 
} from '@/lib/stacks/wallet';
import type { WalletConnection } from '@/types/stacks';

export function useStacks(): {
  wallet: WalletConnection;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  refreshBalance: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
} {
  const [wallet, setWallet] = useState<WalletConnection>({
    address: '',
    isConnected: false,
    balance: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await connectWallet({
        onFinish: async (payload) => {
          // Get the first address (primary address)
          const address = payload.addresses[0];
          if (!address) {
            throw new Error('No address returned from wallet');
          }

          const balance = await getBalance(address);
          
          setWallet({
            address,
            isConnected: true,
            balance,
          });

          // Store in localStorage for persistence
          if (typeof window !== 'undefined') {
            localStorage.setItem('stacks_address', address);
          }
        },
        onCancel: () => {
          console.log('Wallet connection cancelled');
          setIsLoading(false);
        },
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect wallet';
      setError(errorMessage);
      console.error('Connection error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disconnect = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      await disconnectWallet();
      
      setWallet({
        address: '',
        isConnected: false,
        balance: 0,
      });

      if (typeof window !== 'undefined') {
        localStorage.removeItem('stacks_address');
      }
    } catch (err) {
      console.error('Disconnect error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshBalance = useCallback(async (): Promise<void> => {
    if (wallet.address) {
      try {
        const balance = await getBalance(wallet.address);
        setWallet((prev) => ({ ...prev, balance }));
      } catch (err) {
        console.error('Balance refresh error:', err);
      }
    }
  }, [wallet.address]);

  // Auto-reconnect if session exists
  useEffect(() => {
    const checkConnection = async (): Promise<void> => {
      if (typeof window === 'undefined') return;

      try {
        // Check if @stacks/connect has an active session
        const isConnectedViaLib = checkWalletConnection();
        
        if (isConnectedViaLib) {
          const addresses = await getAddresses();
          if (addresses && addresses.length > 0) {
            const address = addresses[0];
            const balance = await getBalance(address);
            
            setWallet({
              address,
              isConnected: true,
              balance,
            });
            
            localStorage.setItem('stacks_address', address);
          }
        }
      } catch (err) {
        console.error('Auto-reconnect error:', err);
      }
    };

    checkConnection();
  }, []);

  return {
    wallet,
    connect,
    disconnect,
    refreshBalance,
    isLoading,
    error,
  };
}
