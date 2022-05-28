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
  const chainId = Number(NETWORK_ID);
  const [multisigInfo, setMultisigInfo] = useState<Array<multisigProps>>([]);

  const { data: signerData } = useSigner();

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
            <MultisigItem key={index} contract={multisig._contract} />
          ))}
        </Container>
      </div>
    </div>
  );
};

interface MultisigItemProps {
  contract: string;
}

const MultisigItem = ({ contract }: MultisigItemProps) => {
  const [showContract, setShowContract] = useState(false);
  const router = useRouter();
  const chainId = Number(NETWORK_ID);

  const allContracts = contracts as any;
  const multisigABI = allContracts[chainId][0].contracts.Multisig.abi;

  const { data: signerData } = useSigner();
  const { data: accountData } = useAccount();

  const multisigContract = useContract({
    addressOrName:
      (contract as string) || "0x0000000000000000000000000000000000000000",
    contractInterface: multisigABI,
    signerOrProvider: signerData || undefined,
  });

  useEffect(() => {
    if (multisigContract.signer) {
      const checkUser = async () => {
        const owner = await multisigContract.isOwner(accountData?.address);
        const member = await multisigContract.isNewMember(accountData?.address);
        if (owner || member) {
          setShowContract(true);
        }
      };
      checkUser();
    }
  }, [multisigContract]);

  if (!showContract) return null;
  return (
    <button
      className="cursor-pointer border-2 border-bbGray-100 my-2 py-2 rounded text-bbGray-100 hover:bg-bbBlue-100 font-medium w-full"
      onClick={() => router.push(`/multisig/${contract}`)}
    >
      <span className="hidden sm:block">{contract}</span>
      <span className="block sm:hidden">{addressShortener(contract)}</span>
    </button>
  );
};
