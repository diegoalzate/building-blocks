import Head from "next/head";
import { useRouter } from "next/router";

import { ConnectButton } from "@rainbow-me/rainbowkit";

import Image from "next/image";
import bbLogo from "@/images/bb-logo.png";

import { ExternalLinkIcon } from "@heroicons/react/outline";

import contracts from "@/contracts/hardhat_contracts.json";
import { NETWORK_ID } from "@/config";

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
    <div className="bg-bbYellow-100 h-screen">
      <Head>
        <title>Building Blocks</title>
        <meta name="description" content="Building Blocks" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="flex justify-between h-28 py-4 pl-6 sticky top-0 bg-bbYellow-100 z-30">
        <Image
          className="cursor-pointer"
          onClick={() => router.push(`/`)}
          alt="Building Blocks"
          src={bbLogo}
          width={220}
        />
        <div></div>
        <div className="py-4 px-6">
          <ConnectButton />
        </div>
      </header>
      <main>{children}</main>
      <footer className="my-4 bottom-0">
        <div className="flex justify-center py-2 font-medium">
          Factory Contract
        </div>
        <div className="flex justify-center font-medium text-bbGray-100 hover:text-bbBlue-200">
          <a
            href={`https://mumbai.polygonscan.com/address/${multisigFactoryAddress}`}
            target="_blank"
            rel="noreferrer noopener"
            className="flex"
          >
            {multisigFactoryAddress}{" "}
            <ExternalLinkIcon className=" h-5 w-5 ml-4" />
          </a>
        </div>
      </footer>
    </div>
  );
};
