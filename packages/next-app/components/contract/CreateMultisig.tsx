import { useState } from "react";
import { useContract, useSigner } from "wagmi";

import contracts from "@/contracts/hardhat_contracts.json";
import { NETWORK_ID, MATIC_USD_PRICEFEED } from "@/config";
import { ethers } from "ethers";

type CreateMultisigProps = {
  refetch: () => void;
};

export const CreateMultisig = ({ refetch }: CreateMultisigProps) => {
  const chainId = Number(NETWORK_ID);
  const [name, setName] = useState("");
  const [deposit, setDeposit] = useState(0);
  const [datafeed, setDatafeed] = useState(
    "0xab594600376ec9fd91f8e885dadf0ce036862de0"
  );
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
      const tx = await multisigFactoryContract.createMultisig(
        name,
        ethers.utils.parseEther(deposit.toString()),
        MATIC_USD_PRICEFEED
      );
      tx.wait(1).then(() => {
        setName("");
        setDeposit(0);
        // console.log("Deposit value set to", deposit);
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
              Deposit Amount in USD
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
          <div className="py-8">
            <label className="pl-4 text-bbGray-100 font-medium">Currency</label>
            <select
              className="border-4 m-1 p-2 rounded-lg border-bbGray-100 w-full"
              value={datafeed}
              onChange={(e) => setDatafeed(e.target.value)}
            >
              <option value="0xab594600376ec9fd91f8e885dadf0ce036862de0">
                USD
              </option>
            </select>
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
