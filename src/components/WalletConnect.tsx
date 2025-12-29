'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useStacks } from '@/hooks/useStacks';
import { Wallet, LogOut, Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SUPPORTED_WALLETS } from '@/lib/stacks/wallet';

export function WalletConnect(): JSX.Element {
  const { wallet, connect, disconnect, isLoading, error } = useStacks();

  if (wallet.isConnected) {
    return (
      <Card className="border-green-500/20 bg-green-500/5">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium">Wallet Connected</CardTitle>
            <Badge variant="outline" className="border-green-500 text-green-500">
              ✓ Active
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-col gap-2">
            <div className="text-sm text-muted-foreground">Address</div>
            <div className="font-mono text-sm bg-background/50 p-2 rounded border">
              {wallet.address.slice(0, 12)}...{wallet.address.slice(-8)}
            </div>
          </div>
          
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-muted-foreground">Balance</span>
            <span className="text-2xl font-bold">
              {wallet.balance.toFixed(2)} <span className="text-base text-muted-foreground">STX</span>
            </span>
          </div>

          <Button 
            variant="outline" 
            size="sm"
            onClick={disconnect}
            className="w-full gap-2 mt-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="h-4 w-4" />
            )}
            Disconnect
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-purple-500/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-orange-500" />
          Connect Wallet
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Connect any Stacks wallet to start earning yield on your assets
        </div>

        {error && (
          <Alert variant="destructive" className="py-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">{error}</AlertDescription>
          </Alert>
        )}

        {/* Supported Wallets Display */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Supported Wallets
          </div>
          <div className="grid grid-cols-2 gap-2">
            {Object.values(SUPPORTED_WALLETS).map((walletInfo) => (
              <div 
                key={walletInfo.name}
                className="flex items-center gap-2 p-2 rounded-lg bg-background/50 border border-border/50"
              >
                <span className="text-lg">{walletInfo.icon}</span>
                <span className="text-xs font-medium">{walletInfo.name}</span>
              </div>
            ))}
          </div>
        </div>

        <Button 
          onClick={connect}
          size="lg"
          className="w-full gap-2 bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Wallet className="h-4 w-4" />
              Connect Wallet
            </>
          )}
        </Button>

        <div className="text-xs text-center text-muted-foreground">
          Wallet selector will open automatically
        </div>
      </CardContent>
    </Card>
  );
}
