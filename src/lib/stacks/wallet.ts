import { connect, disconnect as stacksDisconnect, isConnected, getLocalStorage } from '@stacks/connect';
import { getStacksNetwork, NETWORK_MODE } from './network';

export interface ConnectWalletOptions {
  onFinish: (payload: { addresses: string[] }) => void;
  onCancel?: () => void;
}

export interface WalletInfo {
  name: string;
  icon: string;
  supported: boolean;
}

// Supported Stacks wallets - all WBIP-compliant wallets are auto-detected
export const SUPPORTED_WALLETS: Record<string, WalletInfo> = {
  xverse: {
    name: 'Xverse',
    icon: '🟣',
    supported: true,
  },
  hiro: {
    name: 'Hiro Wallet',
    icon: '🟠',
    supported: true,
  },
  leather: {
    name: 'Leather',
    icon: '🟤',
    supported: true,
  },
  asigna: {
    name: 'Asigna',
    icon: '🔵',
    supported: true,
  },
  okx: {
    name: 'OKX Wallet',
    icon: '⚫',
    supported: true,
  },
};

/**
 * Connect to any Stacks wallet (Xverse, Hiro, Leather, Asigna, OKX, etc.)
 * Opens native wallet selector modal that auto-detects installed wallets
 * 
 * @stacks/connect v8 API - uses Promise-based connect() instead of callbacks
 */
export async function connectWallet(options: ConnectWalletOptions): Promise<void> {
  try {
    // Ensure we're in browser environment
    if (typeof window === 'undefined') {
      throw new Error('Wallet connection can only be initiated in browser environment');
    }

    // @stacks/connect v8 API - Promise-based
    const response = await connect({
      forceWalletSelect: true, // Always show wallet selector
    });

    // v8 response structure: { addresses: { stx: [{ address: 'SP...' }], btc: [...] } }
    if (response && response.addresses && response.addresses.stx) {
      const stxAddresses = response.addresses.stx;
      
      if (stxAddresses && stxAddresses.length > 0) {
        // Get the first STX address
        const address = stxAddresses[0].address;
        
        options.onFinish({ addresses: [address] });
      } else {
        throw new Error('No STX addresses returned from wallet');
      }
    } else {
      throw new Error('Invalid response from wallet connection');
    }
  } catch (error) {
    console.error('Wallet connection error:', error);
    if (options.onCancel) {
      options.onCancel();
    }
    throw error;
  }
}

/**
 * Disconnect from current wallet
 * @stacks/connect v8 API - uses disconnect() function
 */
export async function disconnectWallet(): Promise<void> {
  try {
    if (typeof window !== 'undefined') {
      stacksDisconnect();
    }
  } catch (error) {
    console.error('Wallet disconnect error:', error);
  }
}

/**
 * Check if wallet is currently connected
 * @stacks/connect v8 API - uses isConnected() function
 */
export function checkWalletConnection(): boolean {
  if (typeof window === 'undefined') return false;
  return isConnected();
}

/**
 * Get user addresses from connected wallet
 * @stacks/connect v8 API - uses getLocalStorage() to retrieve addresses
 */
export async function getAddresses(): Promise<string[]> {
  try {
    if (typeof window === 'undefined') return [];
    
    if (!isConnected()) {
      return [];
    }

    // Get addresses from localStorage (v8 stores them there)
    const data = getLocalStorage();
    
    if (data && data.addresses && data.addresses.stx) {
      const stxAddresses = data.addresses.stx;
      return stxAddresses.map((addr: { address: string }) => addr.address);
    }

    return [];
  } catch (error) {
    console.error('Error getting addresses:', error);
    return [];
  }
}

/**
 * Get STX balance for an address
 */
export async function getBalance(address: string): Promise<number> {
  try {
    const response = await fetch(`/api/stacks-balance?address=${address}`);
    if (!response.ok) {
      throw new Error('Failed to fetch balance');
    }
    const data = await response.json();
    return data.balance || 0;
  } catch (error) {
    console.error('Error fetching balance:', error);
    return 0;
  }
}
