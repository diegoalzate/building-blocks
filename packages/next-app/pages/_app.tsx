import "@/styles/globals.css";
import type { AppProps } from "next/app";
import NextHead from "next/head";
import { AppLayout } from "@/components/layout/AppLayout";

// Imports
import { chain, createClient, WagmiConfig, configureChains } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

import "@rainbow-me/rainbowkit/styles.css";

import {
  getDefaultWallets,
  RainbowKitProvider,
  Theme,
  lightTheme,
  Chain,
} from "@rainbow-me/rainbowkit";
import merge from "lodash.merge";

import { useIsMounted } from "@/hooks";

// Get environment variables
const alchemyId = process.env.NEXT_PUBLIC_ALCHEMY_ID as string;
// const infuraId = process.env.NEXT_PUBLIC_INFURA_ID as string;

const hardhatChain: Chain = {
  id: 31337,
  name: "Hardhat",
  nativeCurrency: {
    decimals: 18,
    name: "Hardhat",
    symbol: "HARD",
  },
  network: "hardhat",
  rpcUrls: {
    default: "http://127.0.0.1:8545",
  },
  testnet: true,
};

const { chains, provider } = configureChains(
  // [chain.polygon, chain.polygonMumbai, hardhatChain],
  [chain.polygonMumbai],
  [alchemyProvider({ alchemyId }), publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "Building Blocks",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

const customTheme: Theme = merge(lightTheme(), {
  colors: {
    accentColor: "#009379",
  },
});

const App = ({ Component, pageProps }: AppProps) => {
  const isMounted = useIsMounted();

  if (!isMounted) return null;
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider coolMode chains={chains} theme={customTheme}>
        <NextHead>
          <title>Building Blocks</title>
        </NextHead>
        <AppLayout>
          <Component {...pageProps} />
        </AppLayout>
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default App;
