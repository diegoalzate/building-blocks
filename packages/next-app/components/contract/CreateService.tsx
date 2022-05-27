import { useState } from "react";
import { useRouter } from "next/router";
import { useContract, useSigner } from "wagmi";

import contracts from "@/contracts/hardhat_contracts.json";
import { NETWORK_ID } from "@/config";
import { ethers } from "ethers";

import { Loading } from "@/components/elements";

export const CreateService = () => {
  const router = useRouter();
  const { contract } = router.query;
  const [serviceDescription, setServiceDescription] = useState("");
  const [contractorAddress, setContractorAddress] = useState("");
  const [amount, setAmount] = useState(0);
  const chainId = Number(NETWORK_ID);
  const [creatingService, setCreatingService] = useState(false);

  const { data: signerData } = useSigner();

  const allContracts = contracts as any;
  const multisigABI = allContracts[chainId][0].contracts.Multisig.abi;

  const multisigContract = useContract({
    addressOrName:
      (contract as string) || "0x0000000000000000000000000000000000000000",
    contractInterface: multisigABI,
    signerOrProvider: signerData || undefined,
  });

  // console.log("multisigContract", multisigContract);

  const handleCreateService = async () => {
    setCreatingService(true);
    try {
      const tx = await multisigContract.submitTransactionProposal(
        contractorAddress,
        ethers.utils.parseEther(amount.toString()),
        serviceDescription
      );
      tx.wait(1).then(() => {
        setCreatingService(false);
        setServiceDescription("");
        setContractorAddress("");
        setAmount(0);
        router.push(`/multisig/${contract}`);
      });
    } catch (e) {
      console.log("error", e);
      setCreatingService(false);
    }
  };

  return (
    <div>
      <h1 className="text-bbGray-100 text-4xl font-bold text-center">
        Create Service
      </h1>

      {!creatingService ? (
        <div className="py-12 px-24">
          <div className="py-4">
            <label className="pl-4 text-bbGray-100 font-medium">
              Contractor Address
            </label>
            <input
              className="border-4 m-1 p-2 rounded-lg border-bbGray-100 w-full"
              placeholder="Contractor Address"
              value={contractorAddress}
              onChange={(e) => setContractorAddress(e.target.value)}
            />
          </div>
          <div className="py-4">
            <label className="pl-4 text-bbGray-100 font-medium">
              Service Description
            </label>
            <input
              className="border-4 m-1 p-2 rounded-lg border-bbGray-100 w-full"
              placeholder="Service Description"
              value={serviceDescription}
              onChange={(e) => setServiceDescription(e.target.value)}
            />
          </div>

          <div className="py-4">
            <label className="pl-4 text-bbGray-100 font-medium">
              Amount USD
            </label>
            <input
              className="border-4 m-1 p-2 rounded-lg border-bbGray-100 w-full"
              placeholder="Amount"
              value={amount}
              type="number"
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>

          <div className="flex justify-center py-8">
            <button
              onClick={() => handleCreateService()}
              className="border-4 border-bbGray-100 bg-bbBlue-200 rounded-md py-2 px-4 font-bold text-xl text-white"
            >
              Create Service
            </button>
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
};
