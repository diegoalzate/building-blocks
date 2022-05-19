import { useState } from "react";
import { useRouter } from "next/router";
import { useContract, useSigner } from "wagmi";

import contracts from "@/contracts/hardhat_contracts.json";
import { NETWORK_ID } from "@/config";

export const PayService = () => {
  const router = useRouter();
  const { contract } = router.query;
  const [serviceName, setServiceName] = useState("");
  const [contractorAddress, setContractorAddress] = useState("");
  const [serviceAmount, setServiceAmount] = useState(0);
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

  const handleAgreePay = async () => {
    console.log("handleAgreePay");

    // const tx = multisigContract.createMultisig();
    //   console.log("tx", tx);
    // try {
    //   const receipt = await tx.wait();
    //   console.log("receipt", receipt);
    // } catch (e) {
    //   console.log("error", e);
    // }
  };

  const handleDeclinePay = async () => {
    console.log("handleDeclinePay");
  };

  return (
    <div>
      <h1 className="text-bbGray-100 text-4xl font-bold text-center">
        Pay Service
      </h1>

      <div className="my-4 md:my-12 mx-4 md:mx-24 p-4 md:p-8 bg-white border-4 border-bbGray-100 rounded-lg">
        <div className="text-bbGray-100 font-medium">
          <p className="py-2">Society Balance :</p>
          <p className="py-2">Addresses :</p>
          <p className="py-2">Service Name : {serviceName}</p>
          <p className="py-2">Service Amount : {serviceAmount}</p>
        </div>

        <div className="flex justify-between py-8">
          <button
            onClick={() => handleAgreePay()}
            className="border-4 border-bbGray-100 bg-bbGreen-200 rounded-md py-2 px-4 font-bold text-xl text-white"
          >
            Agree to Pay
          </button>
          <button
            onClick={() => handleDeclinePay()}
            className="border-4 border-bbGray-100 bg-bbRed-100 rounded-md py-2 px-4 font-bold text-xl text-white"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};
