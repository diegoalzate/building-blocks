import Head from "next/head";
import type { NextPage } from "next";
import { CreateMultisig } from "@/components/contract";

// import { useConnect } from "wagmi";

// import { Connect, Disconnect, SwitchNetwork } from "@/components/wallet";

// import { useNetwork } from "wagmi";
// import { NETWORK_ID } from "@/config";

const CreateMultisigPage: NextPage = () => {
  //   const { activeChain } = useNetwork();
  //   const { activeConnector } = useConnect();

  return (
    <div className={"h-screen"}>
      <CreateMultisig />
    </div>
  );
};

export default CreateMultisigPage;
