import Head from "next/head";
import { useRouter } from "next/router";

import { ConnectButton } from "@rainbow-me/rainbowkit";

import Image from "next/image";
import bbLogo from "@/images/bb-logo.png";

type AppLayoutProps = {
  children: React.ReactNode;
};

export const AppLayout = ({ children }: AppLayoutProps) => {
  const router = useRouter();

  return (
    <div className="bg-bbYellow-100">
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
    </div>
  );
};
