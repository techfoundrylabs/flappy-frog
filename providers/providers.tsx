"use client";

import { type ReactNode } from "react";
import { base, baseSepolia } from "wagmi/chains";
import { MiniKitProvider } from "@coinbase/onchainkit/minikit";
import {
  ONCHAINKIT_PROJECT_NAME,
  ICON_URL,
  ONCHAINKIT_API_KEY,
} from "@/config/constants";
import { createConfig, http, WagmiProvider } from "wagmi";
import { farcasterFrame as miniAppConnector } from "@farcaster/frame-wagmi-connector";

const wagmiConfig = createConfig({
  chains: [baseSepolia, base],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
  connectors: [miniAppConnector()],
});

export function Providers(props: { children: ReactNode }) {
  return (
    <MiniKitProvider
      apiKey={ONCHAINKIT_API_KEY}
      chain={base}
      config={{
        appearance: {
          mode: "auto",
          theme: "mini-app-theme",
          name: ONCHAINKIT_PROJECT_NAME,
          logo: ICON_URL,
        },
      }}
    >
      <WagmiProvider config={wagmiConfig}>{props.children}</WagmiProvider>
    </MiniKitProvider>
  );
}
