'use client';

import { Client, IMessage } from '@stomp/stompjs';
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

import { createStompClient } from './stomp-client';

type UnsubscribeFn = () => void;
type SubscribeFn = (destination: string, cb: (msg: IMessage) => void) => UnsubscribeFn;

interface WSContextValue {
  connected: boolean;
  subscribe: SubscribeFn;
}

const WSContext = createContext<WSContextValue | null>(null);

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const [connected, setConnected] = useState(false);
  const clientRef = useRef<Client | null>(null);

  const wsUrl = process.env.NEXT_PUBLIC_WS_URL || '';

  useEffect(() => {
    if (typeof window === 'undefined' || !wsUrl) return;

    if (clientRef.current?.active) return;

    const client = createStompClient({
      wsUrl,
      onConnect: () => setConnected(true),
      onDisconnect: () => setConnected(false),
      onStompError: () => setConnected(false),
    });

    clientRef.current = client;
    client.activate();

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
        clientRef.current = null;
        setConnected(false);
      }
    };
  }, [wsUrl]);

  const subscribe: SubscribeFn = useCallback((destination, cb) => {
    const client = clientRef.current;

    if (!client || !client.connected) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          `[WS Warning]: Cannot subscribe to ${destination}. WebSocket is not connected.`,
        );
      }
      return () => {};
    }

    const sub = client.subscribe(destination, cb);

    return () => sub.unsubscribe();
  }, []);

  return <WSContext.Provider value={{ connected, subscribe }}>{children}</WSContext.Provider>;
}

export function useWS() {
  const ctx = useContext(WSContext);
  if (!ctx) {
    throw new Error('useWS must be used within WebSocketProvider');
  }
  return ctx;
}
