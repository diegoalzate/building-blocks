import { useState } from "react";
import { useContract, useSigner } from "wagmi";

import contracts from "@/contracts/hardhat_contracts.json";
import { NETWORK_ID } from "@/config";

export const CreateMultisig = () => {
  const chainId = Number(NETWORK_ID);
  const [name, setName] = useState("");
  const [deposit, setDeposit] = useState(0);

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

  const handleCreateMultisig = async () => {
    console.log("handleCreateMultisig");
    console.log("name", name);
    console.log("deposit", deposit);
    const tx = multisigFactoryContract.createMultisig(name, deposit);
    //   console.log("tx", tx);
    // try {
    //   const receipt = await tx.wait();
    //   console.log("receipt", receipt);
    // } catch (e) {
    //   console.log("error", e);
    // }
  };

  return (
    <div>
      <h1 className="text-red-700 text-3xl">Create Multisig</h1>

      <div className="border p-2">
        <input
          className="border m-1 p-1 w-full"
          placeholder="Society Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border m-1 p-1 w-full"
          placeholder="Deposit Amount"
          value={deposit}
          type="number"
          onChange={(e) => setDeposit(Number(e.target.value))}
        />
        <button
          onClick={() => handleCreateMultisig()}
          className="border m-1 p-2"
        >
          New Multisig
        </button>
      </div>
    </div>
  );
};
