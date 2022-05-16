import { useState } from "react";
import { useContract, useSigner } from "wagmi";

import contracts from "@/contracts/hardhat_contracts.json";
import { NETWORK_ID } from "@/config";

export const GetAllMultisigs = () => {
  const chainId = Number(NETWORK_ID);
  const [totalMultiSigs, setTotalMultiSigs] = useState(0);
  const [multisigs, setMultisigs] = useState(0);

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
  //   console.log("multisigFactoryContract", multisigFactoryContract);

  const handleGetAllMultisig = async () => {
    const numMultisigs = await multisigFactoryContract.numMultisigs();
    setTotalMultiSigs(numMultisigs.toNumber());
  };

  const handleGetMultisig = async (multisigIndex: number) => {
    const getMultisigDetails = await multisigFactoryContract.getMultisigDetails(
      multisigIndex
    );
    console.log("getMultisigDetails", getMultisigDetails);
  };

  return (
    <div className="border p-2">
      <h1 className="text-red-700 text-3xl">Get All Multisig</h1>
      <div>Total number of multisigs: {totalMultiSigs + 1}</div>
      <div>
        <button
          onClick={() => handleGetAllMultisig()}
          className="border m-1 p-2"
        >
          Get All Multisig
        </button>
      </div>
      <div className="my-4">
        <input
          className="border m-1 p-1 w-full"
          placeholder="Multisig Index"
          type="number"
          min={0}
          max={totalMultiSigs}
          value={multisigs}
          onChange={(e) => setMultisigs(Number(e.target.value))}
        />
        <button
          onClick={() => handleGetMultisig(multisigs)}
          className="border m-1 p-2"
        >
          Get Multisig Info
        </button>
        <div className="text-sm px-2">multisig info in console log</div>
      </div>
    </div>
  );
};
