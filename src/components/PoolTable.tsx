'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { DepositModal } from './DepositModal';
import { TrendingUp, Droplet } from 'lucide-react';
import type { Pool } from '@/types/pool';

interface PoolTableProps {
  pools: Pool[];
  isLoading: boolean;
  userAddress: string;
  userBalance: number;
}

export function PoolTable({
  pools,
  isLoading,
  userAddress,
  userBalance,
}: PoolTableProps): JSX.Element {
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleDeposit = (pool: Pool): void => {
    setSelectedPool(pool);
    setIsModalOpen(true);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1_000_000) {
      return `$${(num / 1_000_000).toFixed(2)}M`;
    }
    if (num >= 1_000) {
      return `$${(num / 1_000).toFixed(0)}K`;
    }
    return `$${num.toFixed(0)}`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Liquidity Pools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Liquidity Pools
            </CardTitle>
            <Badge variant="outline" className="gap-1">
              <Droplet className="h-3 w-3" />
              {pools.length} Pools
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset</TableHead>
                  <TableHead className="text-right">APY</TableHead>
                  <TableHead className="text-right hidden sm:table-cell">TVL</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pools.map((pool) => (
                  <TableRow key={pool.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{pool.assetIcon}</div>
                        <div>
                          <div className="font-semibold">{pool.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {pool.protocol}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="font-bold text-green-500 text-lg">
                        {pool.apy.toFixed(1)}%
                      </div>
                    </TableCell>
                    <TableCell className="text-right hidden sm:table-cell">
                      <div className="text-muted-foreground">
                        {formatNumber(pool.tvl)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        onClick={() => handleDeposit(pool)}
                        disabled={!userAddress}
                        className="bg-orange-500 hover:bg-orange-600"
                      >
                        Deposit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <DepositModal
        pool={selectedPool}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userAddress={userAddress}
        userBalance={userBalance}
      />
    </>
  );
}
