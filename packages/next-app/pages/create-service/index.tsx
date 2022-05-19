import Head from "next/head";
import type { NextPage } from "next";
import { CreateService } from "@/components/contract/CreateService";
// import { useConnect } from "wagmi";

// import { Connect, Disconnect, SwitchNetwork } from "@/components/wallet";

// import { useNetwork } from "wagmi";
// import { NETWORK_ID } from "@/config";

const CreateServicePage: NextPage = () => {
  //   const { activeChain } = useNetwork();
  //   const { activeConnector } = useConnect();

  return (
    <div className={"h-screen"}>
      <CreateService />
    </div>
  );
};

export default CreateServicePage;
