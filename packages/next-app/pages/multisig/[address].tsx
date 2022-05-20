import Head from "next/head";
import { useRouter } from "next/router";
import type { NextPage } from "next";
import { GetMultiSig } from "@/components/contract";
// import { useConnect } from "wagmi";

// import { Connect, Disconnect, SwitchNetwork } from "@/components/wallet";

// import { useNetwork } from "wagmi";
// import { NETWORK_ID } from "@/config";

const MultisigPage: NextPage = () => {
  return (
    <GetMultiSig />
  );
};

export default MultisigPage;
