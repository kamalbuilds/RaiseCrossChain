import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ChainId, ThirdwebProvider, paperWallet } from "@thirdweb-dev/react";
import { createEmotionCache, MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { StateProvider } from "../context";
import { WagmiConfig } from "wagmi";
import { Goerli, ArbitrumGoerli, AvalancheFuji, Ethereum, Polygon , Mumbai } from "@thirdweb-dev/chains";
import Navbar from "../../components/Navbar";
import Header from "../../components/Header";
import { metamaskWallet, safeWallet, localWallet, smartWallet, coinbaseWallet } from '@thirdweb-dev/react';
import { AppShell } from '@mantine/core';
const myCache = createEmotionCache({
  key: "mantine",
  prepend: false,
});

// livepeer
import {
  LivepeerConfig,
  createReactClient,
  studioProvider,
} from "@livepeer/react";
import { Web3NameContextProvider } from '@/context/Web3NameContext';

const apiKey = process.env.NEXT_PUBLIC_APP_LIVEPEER_API_KEY || "";
// console.log({ apiKey });
const livepeerClient = createReactClient({
  provider: studioProvider({
    apiKey
  }),
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <LivepeerConfig client={livepeerClient}>
        <ThirdwebProvider
          activeChain={Mumbai}
          clientId="1907611a66678e4abbe5ec7d99e5c160"
          supportedChains={[ArbitrumGoerli, AvalancheFuji, Ethereum, Polygon , Mumbai , Goerli]}
          supportedWallets={[
            metamaskWallet(),
            coinbaseWallet(),
            safeWallet(),
          ]}
        >
          <MantineProvider
            emotionCache={myCache}
            withGlobalStyles
            theme={{
              colorScheme: "dark",
              primaryColor: "blue",
              defaultGradient: {
                from: "blue",
                to: "green",
                deg: 10,
              },
            }}
          >
            <NotificationsProvider position="top-right">
              <StateProvider>
                <Web3NameContextProvider>
                  <AppShell padding="md" navbar={<Navbar />} header={<Header />}>
                    <Component {...pageProps} />
                  </AppShell>
                </Web3NameContextProvider>
              </StateProvider>
            </NotificationsProvider>
          </MantineProvider>
        </ThirdwebProvider>
      </LivepeerConfig>
    </>
  );
}
