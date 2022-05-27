import Head from "next/head";
import { useRouter } from "next/router";

import { ConnectButton } from "@rainbow-me/rainbowkit";

import Image from "next/image";
import bbLogo from "@/images/bb-logo.png";

import { ExternalLinkIcon } from "@heroicons/react/outline";

import contracts from "@/contracts/hardhat_contracts.json";
import { NETWORK_ID } from "@/config";

import { addressShortener } from "@/utils/addressShortener";

type AppLayoutProps = {
  children: React.ReactNode;
};

export const AppLayout = ({ children }: AppLayoutProps) => {
  const router = useRouter();
  const chainId = Number(NETWORK_ID);

  const allContracts = contracts as any;
  const multisigFactoryAddress =
    allContracts[chainId][0].contracts.MultisigFactory.address;

  return (
    <div className="bg-bbYellow-100 h-screen flex flex-col overflow-y-hidden">
      <Head>
        <title>Building Blocks</title>
        <meta name="description" content="Building Blocks" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="flex justify-between h-28 py-4 sm:pl-6 sticky top-0 bg-bbYellow-100 z-30">
        <Image
          className="cursor-pointer"
          onClick={() => router.push(`/`)}
          alt="Building Blocks"
          src={bbLogo}
          width={220}
        />
        <div></div>
        <div className="py-4 sm:px-6">
          <ConnectButton />
        </div>
      </header>
      <main className="flex-grow overflow-y-auto">{children}</main>
      <footer className="m-2 h-12">
        <div className="flex justify-center font-medium">Factory Contract</div>
        <div className="flex justify-center font-medium text-bbGray-100 hover:text-bbBlue-200">
          <a
            href={`https://mumbai.polygonscan.com/address/${multisigFactoryAddress}`}
            target="_blank"
            rel="noreferrer noopener"
            className="flex"
          >
            <span className="hidden sm:block">{multisigFactoryAddress}</span>
            <span className="block sm:hidden">
              {addressShortener(multisigFactoryAddress)}
            </span>{" "}
            <ExternalLinkIcon className="mt-0.5 h-5 w-5 ml-4" />
          </a>
        </div>
      </footer>
    </div>
  );
};
