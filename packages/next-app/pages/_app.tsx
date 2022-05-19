import "@/styles/globals.css";
import type { AppProps } from "next/app";
import NextHead from "next/head";
import { AppLayout } from "@/components/layout/AppLayout";

// Imports
import { chain, createClient, WagmiProvider } from "wagmi";

import "@rainbow-me/rainbowkit/styles.css";

import {
  apiProvider,
  configureChains,
  getDefaultWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";

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
  rpcUrls: {
    default: "http://127.0.0.1:8545",
  },
  blockExplorers: {},
  testnet: true,
};

const { chains, provider } = configureChains(
  [chain.polygon, chain.polygonMumbai, hardhatChain],
  [apiProvider.alchemy(alchemyId), apiProvider.fallback()]
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

const App = ({ Component, pageProps }: AppProps) => {
  const isMounted = useIsMounted();

  if (!isMounted) return null;
  return (
    <WagmiProvider client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <NextHead>
          <title>Building Blocks</title>
        </NextHead>
        <AppLayout>
          <Component {...pageProps} />
        </AppLayout>
      </RainbowKitProvider>
    </WagmiProvider>
  );
};

export default App;
