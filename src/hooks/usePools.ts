'use client';

import { useState, useEffect } from 'react';
import type { Pool } from '@/types/pool';

// Mock pool data - BitFlow benzeri
const MOCK_POOLS: Pool[] = [
  {
    id: 'stx-xbtc',
    name: 'STX-xBTC',
    asset: 'STX',
    assetIcon: '₿',
    pairedAsset: 'xBTC',
    apy: 42.5,
    tvl: 2_450_000,
    protocol: 'BitFlow',
    contractAddress: 'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.stx-xbtc-pool',
    minDeposit: 10,
  },
  {
    id: 'stx-usda',
    name: 'STX-USDA',
    asset: 'STX',
    assetIcon: '💵',
    pairedAsset: 'USDA',
    apy: 28.3,
    tvl: 1_850_000,
    protocol: 'Arkadiko',
    contractAddress: 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.arkadiko-stx-usda-pool',
    minDeposit: 10,
  },
  {
    id: 'stx-welsh',
    name: 'STX-WELSH',
    asset: 'STX',
    assetIcon: '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
    pairedAsset: 'WELSH',
    apy: 156.8,
    tvl: 680_000,
    protocol: 'Velar',
    contractAddress: 'SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1.stx-welsh-pool',
    minDeposit: 5,
  },
  {
    id: 'stx-ststx',
    name: 'STX-stSTX',
    asset: 'STX',
    assetIcon: '🔥',
    pairedAsset: 'stSTX',
    apy: 18.2,
    tvl: 3_200_000,
    protocol: 'StackingDAO',
    contractAddress: 'SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG.stx-ststx-pool',
    minDeposit: 20,
  },
  {
    id: 'stx-ordi',
    name: 'STX-ORDI',
    asset: 'STX',
    assetIcon: '🟠',
    pairedAsset: 'ORDI',
    apy: 89.4,
    tvl: 420_000,
    protocol: 'Bitflow',
    contractAddress: 'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.stx-ordi-pool',
    minDeposit: 5,
  },
];

export function usePools(): {
  pools: Pool[];
  isLoading: boolean;
  error: string | null;
  refreshPools: () => Promise<void>;
} {
  const [pools, setPools] = useState<Pool[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPools = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // In production, this would fetch from Stacks API
      // const response = await fetch('/api/pools');
      // const data = await response.json();
      
      setPools(MOCK_POOLS);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch pools';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPools();

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchPools, 30_000);

    return () => clearInterval(interval);
  }, []);

  return {
    pools,
    isLoading,
    error,
    refreshPools: fetchPools,
  };
}
