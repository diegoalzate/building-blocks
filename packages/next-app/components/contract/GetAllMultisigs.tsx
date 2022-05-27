import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useContract, useSigner, useAccount } from "wagmi";

import contracts from "@/contracts/hardhat_contracts.json";
import { NETWORK_ID } from "@/config";

import { Container } from "@/components/elements";

import { addressShortener } from "@/utils/addressShortener";

interface multisigProps {
  _contract: string;
}

export const GetAllMultisigs = () => {
  const router = useRouter();
  const chainId = Number(NETWORK_ID);
  const [multisigInfo, setMultisigInfo] = useState<Array<multisigProps>>([]);

  const { data: signerData } = useSigner();
  const { data: accountData } = useAccount();

  const allContracts = contracts as any;
  const multisigFactoryAddress =
    allContracts[chainId][0].contracts.MultisigFactory.address;
  const multisigFactoryABI =
    allContracts[chainId][0].contracts.MultisigFactory.abi;

  const multisigFactoryContract = useContract({
    addressOrName: multisigFactoryAddress,
    contractInterface: multisigFactoryABI,
    signerOrProvider: signerData || undefined,
  });
  // console.log("multisigFactoryContract", multisigFactoryContract);

  const handleGetAllMultisig = async () => {
    const numMultisigs = await multisigFactoryContract.numMultisigs();
    const multisigInfo = [];
    for (let i = 0; i < numMultisigs.toNumber(); i++) {
      const getMultisigDetails =
        await multisigFactoryContract.getMultisigDetails(i);
      multisigInfo.push(getMultisigDetails);
    }
    setMultisigInfo(multisigInfo);
  };

  // const handleGetMultisigsForUser = async () => {
  //   const result = await multisigFactoryContract.getMultisigsWhereUserIsMember(
  //     accountData?.address
  //   );
  //   console.log("result", result);
  // };

  const refresh = async () => {
    await handleGetAllMultisig();
  };

  useEffect(() => {
    if (multisigFactoryContract.signer) {
      refresh();
    }
  }, [multisigFactoryContract]);

  return (
    <div className="p-2">
      <div className="flex justify-between">
        <span></span>
        <h1 className="text-bbGray-100 text-4xl font-bold text-center"></h1>
        <button
          className="py-1 px-2 border-2 border-bbGray-100 rounded text-sm font-medium"
          onClick={() => refresh()}
        >
          refresh
        </button>
      </div>

      <div className="mt-6">
        <Container>
          {multisigInfo.map((multisig, index) => (
            <div key={index} className="w-full">
              <button
                className="cursor-pointer border-2 border-bbGray-100 my-2 py-2 rounded text-bbGray-100 hover:bg-bbBlue-100 font-medium w-full"
                onClick={() => router.push(`/multisig/${multisig._contract}`)}
              >
                <span className="hidden sm:block">{multisig._contract}</span>
                <span className="block sm:hidden">
                  {addressShortener(multisig._contract)}
                </span>
              </button>
            </div>
          ))}
        </Container>
      </div>
    </div>
  );
};
