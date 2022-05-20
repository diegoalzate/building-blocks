import { useState } from "react";
import { useRouter } from "next/router";
import { useContract, useSigner } from "wagmi";

import contracts from "@/contracts/hardhat_contracts.json";
import { NETWORK_ID } from "@/config";

export const CreateService = () => {
  const router = useRouter();
  const { contract } = router.query;
  const [serviceDescription, setServiceDescription] = useState("");
  const [contractorAddress, setContractorAddress] = useState("");
  const [amount, setAmount] = useState(0);
  const chainId = Number(NETWORK_ID);

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
    console.log("handleCreateService");
    try {
      const tx = multisigContract.submitTransactionProposal(
        contractorAddress,
        amount,
        serviceDescription
      );
      console.log("tx", tx);
      const receipt = await tx.wait();
      console.log("receipt", receipt);
    } catch (e) {
      console.log("error", e);
    }
  };

  return (
    <div>
      <h1 className="text-bbGray-100 text-4xl font-bold text-center">
        Create Service
      </h1>

      <div className="py-12 px-24">
        <div className="py-8">
          <input
            className="border-4 m-1 p-2 rounded-lg border-bbGray-100 w-full"
            placeholder="Contractor Address"
            value={contractorAddress}
            onChange={(e) => setContractorAddress(e.target.value)}
          />
        </div>
        <div className="py-8">
          <input
            className="border-4 m-1 p-2 rounded-lg border-bbGray-100 w-full"
            placeholder="Service Description"
            value={serviceDescription}
            onChange={(e) => setServiceDescription(e.target.value)}
          />
        </div>

        <div className="py-8">
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
    </div>
  );
};
