import { STACKS_MAINNET, STACKS_TESTNET } from '@stacks/network';
import type { StacksNetwork } from '@stacks/network';

// Use Testnet for development
export const NETWORK_MODE: 'testnet' | 'mainnet' = 'testnet';

export function getStacksNetwork(): StacksNetwork {
  return NETWORK_MODE === 'mainnet' 
    ? STACKS_MAINNET 
    : STACKS_TESTNET;
}

export const STACKS_API_URL = 
  NETWORK_MODE === 'mainnet' 
    ? 'https://api.hiro.so' 
    : 'https://api.testnet.hiro.so';

export const EXPLORER_URL = 
  NETWORK_MODE === 'mainnet'
    ? 'https://explorer.hiro.so'
    : 'https://explorer.hiro.so/?chain=testnet';
