'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RouteVisualizer } from './RouteVisualizer';
import { useDeposit } from '@/hooks/useDeposit';
import { Loader2, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';
import type { Pool } from '@/types/pool';
import { EXPLORER_URL } from '@/lib/stacks/network';

interface DepositModalProps {
  pool: Pool | null;
  isOpen: boolean;
  onClose: () => void;
  userAddress: string;
  userBalance: number;
}

export function DepositModal({
  pool,
  isOpen,
  onClose,
  userAddress,
  userBalance,
}: DepositModalProps): JSX.Element {
  const [amount, setAmount] = useState<string>('');
  const { depositState, deposit, reset } = useDeposit();

  const handleDeposit = async (): Promise<void> => {
    if (!pool || !amount || parseFloat(amount) <= 0) return;

    const numAmount = parseFloat(amount);
    if (numAmount < pool.minDeposit) {
      return;
    }

    const success = await deposit(pool.contractAddress, numAmount, userAddress);
    
    if (success) {
      setTimeout(() => {
        handleClose();
      }, 3000);
    }
  };

  const handleClose = (): void => {
    setAmount('');
    reset();
    onClose();
  };

  if (!pool) return <></>;

  const numAmount = parseFloat(amount) || 0;
  const isAmountValid = numAmount >= pool.minDeposit && numAmount <= userBalance;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Deposit to {pool.name}
          </DialogTitle>
          <DialogDescription>
            Earn {pool.apy}% APY on your STX
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Route Visualizer */}
          <RouteVisualizer
            steps={[
              { label: 'Your STX', value: `${numAmount || 0} STX`, icon: '💰' },
              { label: 'Auto-swap', value: '50/50 split', icon: '🔄' },
              { label: pool.name, value: `${pool.apy}% APY`, icon: pool.assetIcon },
            ]}
          />

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (STX)</Label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={depositState.isLoading || !!depositState.txId}
                step="0.01"
                min={pool.minDeposit}
                max={userBalance}
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 text-xs"
                onClick={() => setAmount(userBalance.toString())}
                disabled={depositState.isLoading || !!depositState.txId}
              >
                MAX
              </Button>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Min: {pool.minDeposit} STX</span>
              <span>Balance: {userBalance.toFixed(2)} STX</span>
            </div>
          </div>

          {/* Error Display */}
          {depositState.error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{depositState.error}</AlertDescription>
            </Alert>
          )}

          {/* Success Display */}
          {depositState.txId && (
            <Alert className="border-green-500 bg-green-500/10">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-500">
                Transaction submitted successfully!
                <a
                  href={`${EXPLORER_URL}/txid/${depositState.txId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 mt-2 text-sm underline hover:no-underline"
                >
                  View on Explorer
                  <ExternalLink className="h-3 w-3" />
                </a>
              </AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={depositState.isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeposit}
              className="flex-1 bg-orange-500 hover:bg-orange-600"
              disabled={
                !isAmountValid ||
                depositState.isLoading ||
                !!depositState.txId
              }
            >
              {depositState.isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Processing...
                </>
              ) : depositState.txId ? (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Deposited
                </>
              ) : (
                'Deposit'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
