import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useContract, useSigner } from "wagmi";

import contracts from "@/contracts/hardhat_contracts.json";
import { NETWORK_ID } from "@/config";

export const GetMultiSig = () => {
  const router = useRouter();
  const { address } = router.query;
  const chainId = Number(NETWORK_ID);
  const { data: signerData } = useSigner();
  const [societyName, setSocietyName] = useState("");

  const allContracts = contracts as any;
  const multisigABI = allContracts[chainId][0].contracts.Multisig.abi;

  const multisigContract = useContract({
    addressOrName:
      (address as string) || "0x0000000000000000000000000000000000000000",
    contractInterface: multisigABI,
    signerOrProvider: signerData || undefined,
  });
  //   console.log("multisigContract", multisigContract);

  useEffect(() => {
    const getSocietyName = async () => {
      if (multisigContract.signer) {
        const name = await multisigContract.societyName();
        setSocietyName(name);
      }
    };
    getSocietyName();
  }, [multisigContract]);

  return (
    <main className="flex flex-col space-y-10 px-4 md:px-40 lg:px-52 xl:px-96 h-screen">
      <h1 className="text-bbGray-100 text-4xl font-bold text-center">
        {societyName}
      </h1>
      <div className="bg-white border-2 rounded-md border-black flex flex-col space-y-24 p-8 items-center">
        <div className="flex flex-col space-y-2">
          <p>Your address: {address}</p>
          <p>Society balance: $100</p>
        </div>
        <div className="flex flex-col space-y-4">
          <button className="border-4 border-bbGray-100 bg-bbYellow-300 rounded-md py-2 px-4 font-bold text-xl">
            Invite Member
          </button>
          <button
            onClick={() => router.push(`/create-service?contract=${address}`)}
            className="border-4 border-bbGray-100 bg-bbBlue-200 rounded-md py-2 px-4 font-bold text-xl text-white"
          >
            Pay for service
          </button>
        </div>
      </div>
    </main>
  );
};
