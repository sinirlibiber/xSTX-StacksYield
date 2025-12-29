'use client'
import { useFarcaster } from '@/hooks/useFarcaster';
import { useStacks } from '@/hooks/useStacks';
import { usePools } from '@/hooks/usePools';
import { WalletConnect } from '@/components/WalletConnect';
import { PoolTable } from '@/components/PoolTable';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Coins, User } from 'lucide-react';
import { useEffect } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import { useAddMiniApp } from "@/hooks/useAddMiniApp";
import { useQuickAuth } from "@/hooks/useQuickAuth";
import { useIsInFarcaster } from "@/hooks/useIsInFarcaster";

export default function HomePage(): JSX.Element {
    const { addMiniApp } = useAddMiniApp();
    const isInFarcaster = useIsInFarcaster()
    useQuickAuth(isInFarcaster)
    useEffect(() => {
      const tryAddMiniApp = async () => {
        try {
          await addMiniApp()
        } catch (error) {
          console.error('Failed to add mini app:', error)
        }

      }

    

      tryAddMiniApp()
    }, [addMiniApp])
    useEffect(() => {
      const initializeFarcaster = async () => {
        try {
          await new Promise(resolve => setTimeout(resolve, 100))
          
          if (document.readyState !== 'complete') {
            await new Promise<void>(resolve => {
              if (document.readyState === 'complete') {
                resolve()
              } else {
                window.addEventListener('load', () => resolve(), { once: true })
              }

            })
          }

    

          await sdk.actions.ready()
          console.log('Farcaster SDK initialized successfully - app fully loaded')
        } catch (error) {
          console.error('Failed to initialize Farcaster SDK:', error)
          
          setTimeout(async () => {
            try {
              await sdk.actions.ready()
              console.log('Farcaster SDK initialized on retry')
            } catch (retryError) {
              console.error('Farcaster SDK retry failed:', retryError)
            }

          }, 1000)
        }

      }

    

      initializeFarcaster()
    }, [])
  const { user, isSDKReady, isLoading: isFarcasterLoading } = useFarcaster();
  const { wallet } = useStacks();
  const { pools, isLoading: isPoolsLoading } = usePools();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Coins className="h-8 w-8 text-orange-500" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                  StacksYield
                </h1>
              </div>
            </div>

            {/* Farcaster User Badge */}
            {isSDKReady && user && (
              <Badge variant="outline" className="gap-2 hidden sm:flex">
                <User className="h-3 w-3" />
                {user.displayName || user.username || `FID: ${user.fid}`}
              </Badge>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="space-y-6">
          {/* Hero Section */}
          <div className="text-center space-y-3 py-8">
            <h2 className="text-4xl font-bold tracking-tight">
              Earn Yield on Your STX
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Stake your Stacks tokens in liquidity pools and earn competitive APY.
              Simple, secure, and powered by the Stacks blockchain.
            </p>
          </div>

          {/* Farcaster Loading State */}
          {isFarcasterLoading && (
            <Card className="border-blue-500/20 bg-blue-500/5">
              <CardContent className="flex items-center gap-3 p-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Wallet Connection */}
          <WalletConnect />

          {/* Stats Cards */}
          {wallet.isConnected && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm text-muted-foreground">Total Value Locked</div>
                  <div className="text-2xl font-bold mt-1">
                    ${pools.reduce((acc, pool) => acc + pool.tvl, 0).toLocaleString()}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm text-muted-foreground">Highest APY</div>
                  <div className="text-2xl font-bold mt-1 text-green-500">
                    {Math.max(...pools.map(p => p.apy)).toFixed(1)}%
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm text-muted-foreground">Active Pools</div>
                  <div className="text-2xl font-bold mt-1">
                    {pools.length}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Pool Table */}
          <PoolTable
            pools={pools}
            isLoading={isPoolsLoading}
            userAddress={wallet.address}
            userBalance={wallet.balance}
          />

          {/* Footer Info */}
          <Card className="border-muted">
            <CardContent className="p-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Built on <span className="font-semibold text-orange-500">Stacks</span> blockchain
                </p>
                <p className="text-xs text-muted-foreground">
                  Currently on Testnet. Use test STX for deposits.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
