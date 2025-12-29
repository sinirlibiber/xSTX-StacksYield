'use client';

import { useState, useEffect } from 'react';
import sdk from '@farcaster/frame-sdk';

interface FarcasterContext {
  user: {
    fid: number;
    username?: string;
    displayName?: string;
    pfpUrl?: string;
  } | null;
  isSDKReady: boolean;
  isLoading: boolean;
}

export function useFarcaster(): FarcasterContext {
  const [context, setContext] = useState<FarcasterContext>({
    user: null,
    isSDKReady: false,
    isLoading: true,
  });

  useEffect(() => {
    const initFarcaster = async (): Promise<void> => {
      try {
        // Initialize Farcaster SDK
        await sdk.actions.ready();
        
        // Get user context
        const frameContext = await sdk.context;
        
        if (frameContext?.user) {
          setContext({
            user: {
              fid: frameContext.user.fid,
              username: frameContext.user.username,
              displayName: frameContext.user.displayName,
              pfpUrl: frameContext.user.pfpUrl,
            },
            isSDKReady: true,
            isLoading: false,
          });
        } else {
          setContext({
            user: null,
            isSDKReady: true,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error('Farcaster SDK initialization error:', error);
        setContext({
          user: null,
          isSDKReady: false,
          isLoading: false,
        });
      }
    };

    initFarcaster();
  }, []);

  return context;
}
