import { Client, IFrame } from "@stomp/stompjs";
import SockJS from "sockjs-client";

declare module "sockjs-client" {
  export interface Options {
    withCredentials?: boolean;
  }
}

interface StompConfig {
  wsUrl: string;
  onConnect?: (frame: IFrame) => void;
  onDisconnect?: () => void;
  onStompError?: (frame: IFrame) => void;
}

export function createStompClient({
  wsUrl,
  onConnect,
  onDisconnect,
  onStompError,
}: StompConfig) {
  return new Client({
    webSocketFactory: () => {
      return new SockJS(wsUrl, null, {
        withCredentials: true,
        transports: ["xhr-streaming", "xhr-polling"],
      });
    },

    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,

    debug:
      process.env.NODE_ENV === "development"
        ? (str) => console.log(`[WS]: ${str}`)
        : undefined,

    onConnect: (frame) => onConnect?.(frame),
    onDisconnect: () => onDisconnect?.(),
    onStompError: (frame) => {
      console.error(
        "[WS Error]:",
        frame.headers?.["message"] || "Unknown error"
      );
      onStompError?.(frame);
    },
  });
}
