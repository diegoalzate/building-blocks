import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useContract, useSigner, useAccount } from "wagmi";

import contracts from "@/contracts/hardhat_contracts.json";
import { NETWORK_ID, EIGHTEENZERO } from "@/config";
import { ethers } from "ethers";

import { Container, Loading } from "@/components/elements";
import { ExternalLinkIcon, BackspaceIcon } from "@heroicons/react/outline";

import { addressShortener } from "@/utils/addressShortener";

export const ServiceApproval = () => {
  const router = useRouter();
  const { contract } = router.query;

  const [societyName, setSocietyName] = useState("");
  const [serviceData, setServiceData] = useState<any>();
  const [societyBalance, setSocietyBalance] = useState(0);
  const [isPending, setIsPending] = useState(false);

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

  // console.log("multisigContract", multisigContract);

  const fetchData = async () => {
    // console.log("fetchData");
    const name = await multisigContract.societyName();
    setSocietyName(name);

    const owner = await multisigContract.isOwner(accountData?.address);
    setIsOwner(owner);

    const serviceContract = await multisigContract.serviceTransactions(0);
    setServiceData(serviceContract);

    const getMultisigBalance = await multisigContract.getMultisigBalance();
    setSocietyBalance(getMultisigBalance);
  };

  useEffect(() => {
    const getSocietyName = async () => {
      if (multisigContract.signer) {
        fetchData();
      }
    };
    getSocietyName();
  }, [multisigContract]);

  // useEffect(() => {
  //   console.log("serviceData", serviceData);
  // }, [serviceData]);

  // console.log("multisigContract", multisigContract);

  const handleAgreePay = async () => {
    setIsPending(true);
    try {
      const tx = await multisigContract.approveTransactionProposal(0);
      tx.wait(1).then(() => {
        fetchData();
        setIsPending(false);
      });
    } catch (e) {
      console.log("error", e);
      setIsPending(false);
    }
  };

  const handleDeclinePay = async () => {
    setIsPending(true);
    try {
      const tx = await multisigContract.revokeApproval(0);
      tx.wait(1).then(() => {
        fetchData();
        setIsPending(false);
      });
    } catch (e) {
      console.log("error", e);
      setIsPending(false);
    }
  };

  if (!serviceData) return null;
  return (
    <div>
      <div className="flex justify-between px-4 mx-auto lg:max-w-3xl xl:max-w-4xl">
        <span className="my-auto">
          <BackspaceIcon
            onClick={() => router.push(`multisig/${contract}`)}
            className="text-bbGray-100 h-10 w-10 mt-1 hover:text-bbBlue-200 cursor-pointer"
          />
        </span>
        <h1 className="text-bbGray-100 text-4xl font-bold text-center">
          Service Approval
        </h1>
        <span></span>
      </div>

      <div className="mt-6">
        <Container>
          {!isPending ? (
            <>
              <div className="text-bbGray-100 font-medium">
                <p className="py-2">Society Name : {societyName}</p>
                <p className="py-2">
                  Society Balance :
                  <span className="pl-4 pr-2">
                    {(societyBalance / EIGHTEENZERO).toFixed(4)}
                  </span>
                  MATIC
                </p>
                <p className="py-2 flex">
                  Contractor Address :
                  <span className="pl-2">
                    {addressShortener(serviceData.to)}
                  </span>
                  <a
                    href={`https://mumbai.polygonscan.com/address/${serviceData.to}`}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <ExternalLinkIcon className="text-bbGray-100 h-5 w-5 ml-4 mt-0.5 hover:text-bbBlue-200" />
                  </a>
                </p>
                <p className="py-2">Service Description : {serviceData.data}</p>
                <p className="py-2">
                  Service Amount :{" "}
                  {ethers.utils.formatEther(serviceData.amount.toString())}{" "}
                  MATIC
                </p>
              </div>
              {isOwner && (
                <div className="flex justify-between py-8 w-full">
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
            </>
          ) : (
            <div className="">
              <Loading />
            </div>
          )}
        </Container>
      </div>
    </div>
  );
};
