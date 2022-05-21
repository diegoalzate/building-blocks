import { useState } from "react";
import { useAccount, useContract, useSigner } from "wagmi";

import contracts from "@/contracts/hardhat_contracts.json";
import { NETWORK_ID } from "@/config";

type CreateMultisigProps = {
  refetch: () => void;
};

export const CreateMultisig = ({ refetch }: CreateMultisigProps) => {
  const chainId = Number(NETWORK_ID);
  const [name, setName] = useState("");
  const [deposit, setDeposit] = useState(0);
  const [creatingMultisig, setCreatingMultisig] = useState(false);

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
    setCreatingMultisig(true);

    try {
      const tx = await multisigFactoryContract.createMultisig(name, deposit, "0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada");
      tx.wait(1).then(() => {
        setName("");
        setDeposit(0);
        refetch();
        setCreatingMultisig(false);
      });
    } catch (e) {
      console.log("error", e);
      setCreatingMultisig(false);
    }
  };

  return (
    <div>
      <h1 className="text-bbGray-100 text-4xl font-bold text-center">
        Create Society
      </h1>
      {!creatingMultisig ? (
        <div className="py-12 px-24">
          <div className="py-8">
            <label className="pl-4 text-bbGray-100 font-medium">
              Society Name
            </label>
            <input
              className="border-4 m-1 p-2 rounded-lg border-bbGray-100 w-full"
              placeholder="Society Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="py-8">
            <label className="pl-4 text-bbGray-100 font-medium">
              Deposit Amount
            </label>
            <input
              className="border-4 m-1 p-2 rounded-lg border-bbGray-100 w-full"
              placeholder="Deposit Amount"
              value={deposit}
              min={0}
              type="number"
              onChange={(e) => setDeposit(Number(e.target.value))}
            />
          </div>

          <div className="flex justify-center py-8">
            <button
              onClick={() => handleCreateMultisig()}
              className="border-4 border-bbGray-100 bg-bbBlue-200 rounded-md py-2 px-4 font-bold text-xl text-white"
            >
              Create
            </button>
          </div>
        </div>
      ) : (
        <div className="py-12 px-24">Creating New</div>
      )}
    </div>
  );
};
