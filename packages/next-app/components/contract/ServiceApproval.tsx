import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useContract, useSigner, useAccount } from "wagmi";

import contracts from "@/contracts/hardhat_contracts.json";
import { NETWORK_ID } from "@/config";
import { ethers } from "ethers";

export const ServiceApproval = () => {
  const router = useRouter();
  const { contract } = router.query;

  const [societyName, setSocietyName] = useState("");
  const [serviceData, setServiceData] = useState<any>();
  const [isOwner, setIsOwner] = useState(false);
  const chainId = Number(NETWORK_ID);

  const { data: signerData } = useSigner();
  const { data: accountData } = useAccount();

  const allContracts = contracts as any;
  const multisigABI = allContracts[chainId][0].contracts.Multisig.abi;

  const multisigContract = useContract({
    addressOrName:
      (contract as string) || "0x0000000000000000000000000000000000000000",
    contractInterface: multisigABI,
    signerOrProvider: signerData || undefined,
  });

  console.log("multisigContract", multisigContract);

  const fetchData = async () => {
    console.log("fetchData");
    const name = await multisigContract.societyName();
    setSocietyName(name);

    const owner = await multisigContract.isOwner(accountData?.address);
    setIsOwner(owner);

    const serviceContract = await multisigContract.serviceTransactions(0);
    console.log("serviceContract", serviceContract);
    setServiceData(serviceContract);
  };

  useEffect(() => {
    const getSocietyName = async () => {
      if (multisigContract.signer) {
        fetchData();
      }
    };
    getSocietyName();
  }, [multisigContract]);

  useEffect(() => {
    console.log("serviceData", serviceData);
  }, [serviceData]);

  // console.log("multisigContract", multisigContract);

  const handleAgreePay = async () => {
    console.log("handleAgreePay");
    try {
      const tx = await multisigContract.approveTransactionProposal(0);
      tx.wait(1).then((res: any) => {
        console.log("res", res);
        fetchData();
      });
    } catch (e) {
      console.log("error", e);
    }
  };

  const handleDeclinePay = async () => {
    console.log("handleDeclinePay");
    try {
      const tx = await multisigContract.revokeApproval(0);
      tx.wait(1).then((res: any) => {
        console.log("res", res);
        fetchData();
      });
    } catch (e) {
      console.log("error", e);
    }
  };

  if (!serviceData) return null;
  return (
    <div>
      <h1 className="text-bbGray-100 text-4xl font-bold text-center">
        Pay Service
      </h1>

      <div className="my-4 md:my-12 mx-4 md:mx-24 p-4 md:p-8 bg-white border-4 border-bbGray-100 rounded-lg">
        <div className="text-bbGray-100 font-medium">
          <p className="py-2">Society Name : {societyName}</p>
          <p className="py-2">Society Balance :</p>
          <p className="py-2">Contractor Address : {serviceData.to}</p>
          <p className="py-2">Service Description : {serviceData.data}</p>
          <p className="py-2">
            Service Amount : {ethers.utils.formatEther(serviceData.amount.toString())} MATIC
          </p>
        </div>
        {isOwner && (
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
        )}
      </div>
    </div>
  );
};
