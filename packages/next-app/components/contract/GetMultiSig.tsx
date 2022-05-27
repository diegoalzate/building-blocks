import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useContract, useSigner, useAccount } from "wagmi";

import contracts from "@/contracts/hardhat_contracts.json";
import { NETWORK_ID, EIGHTEENZERO } from "@/config";
import { ethers } from "ethers";

import { Container, Loading } from "@/components/elements";
import { ExternalLinkIcon, BackspaceIcon } from "@heroicons/react/outline";

import { addressShortener } from "@/utils/addressShortener";

export const GetMultiSig = () => {
  const router = useRouter();
  const { address } = router.query;
  const chainId = Number(NETWORK_ID);
  const { data: signerData } = useSigner();
  const { data: accountData } = useAccount();

  const [isOwner, setIsOwner] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const [societyName, setSocietyName] = useState("");
  const [societyDeposit, setSocietyDeposit] = useState(0);
  const [maticDeposit, setMaticDeposit] = useState(0);
  const [maticDepositBigNumber, setMaticDepositBigNumber] = useState<any>();

  const [addOwner, setAddOwner] = useState("");
  const [serviceData, setServiceData] = useState<any>();
  const [societyBalance, setSocietyBalance] = useState(0);

  const allContracts = contracts as any;
  const multisigABI = allContracts[chainId][0].contracts.Multisig.abi;

  const multisigContract = useContract({
    addressOrName:
      (address as string) || "0x0000000000000000000000000000000000000000",
    contractInterface: multisigABI,
    signerOrProvider: signerData || undefined,
  });
  // console.log("multisigContract", multisigContract);

  const fetchData = async () => {
    const name = await multisigContract.societyName();
    setSocietyName(name);

    const owner = await multisigContract.isOwner(accountData?.address);
    setIsOwner(owner);

    const deposit = await multisigContract.deposit();
    const depositAmount = Number(ethers.utils.formatEther(deposit));
    setSocietyDeposit(depositAmount);

    const priceConvert = await multisigContract.getPriceConverter();
    const priceConvertAmount = Number(ethers.utils.formatEther(priceConvert));
    setMaticDepositBigNumber(
      Math.round(
        (priceConvertAmount + priceConvertAmount * 0.12) * EIGHTEENZERO
      ).toString()
    );
    setMaticDeposit(priceConvertAmount);

    const isNewMember = await multisigContract.isNewMember(
      accountData?.address
    );
    setIsMember(isNewMember);

    const getMultisigBalance = await multisigContract.getMultisigBalance();
    setSocietyBalance(getMultisigBalance);

    try {
      // console.log(multisigContract);
      const serviceContract = await multisigContract.serviceTransactions(0);
      // console.log("serviceContract", serviceContract);
      if (serviceContract) setServiceData(serviceContract);
    } catch (error) {
      // console.log("error", error);
    }

    // const numApprovalsRequired = await multisigContract.numApprovalsRequired();
    // console.log("numApprovalsRequired", numApprovalsRequired);

    setIsPending(false);
  };

  useEffect(() => {
    const getSocietyName = async () => {
      if (multisigContract.signer) {
        fetchData();
      }
    };
    getSocietyName();
  }, [multisigContract]);

  const handleAddMember = async () => {
    try {
      const tx = await multisigContract.addNewMember(addOwner);
      tx.wait(1).then(() => {
        fetchData();
        setAddOwner("");
      });
    } catch (e) {
      console.log("error", e);
    }
  };

  const handleDeposit = async () => {
    setIsPending(true);
    try {
      const tx = await multisigContract.newOwner({
        gasLimit: "1000000",
        value: maticDepositBigNumber,
      });
      tx.wait(1).then(() => {
        fetchData();
      });
    } catch (e) {
      console.log("error", e);
      setIsPending(false);
    }
  };

  const handleExcutePayment = async () => {
    setIsPending(true);
    try {
      const tx = await multisigContract.executeTransaction(0);
      tx.wait(1).then(() => {
        fetchData();
        setIsPending(false);
      });
    } catch (e) {
      console.log("error", e);
      setIsPending(false);
    }
  };

  // console.log("serviceData", serviceData);

  return (
    <main>
      <div className="flex justify-between px-4 mx-auto lg:max-w-3xl xl:max-w-4xl">
        <span className="my-auto">
          <BackspaceIcon
            onClick={() => router.push(`/create-multisig`)}
            className="text-bbGray-100 h-10 w-10 mt-1 hover:text-bbBlue-200 cursor-pointer"
          />
        </span>
        <h1 className="text-bbGray-100 text-4xl font-bold text-center">
          {societyName}
        </h1>
        <span></span>
      </div>

      <div className="mt-6">
        <Container>
          <div className="flex flex-col space-y-2 text-bbGray-100 font-medium">
            <p className="sm:flex">
              Contract Address:{" "}
              <span className="flex pl-4">
                <span className="hidden sm:block">{address}</span>
                <span className="block sm:hidden">
                  {addressShortener(address as string)}
                </span>{" "}
                <a
                  href={`https://mumbai.polygonscan.com/address/${address}`}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <ExternalLinkIcon className="text-bbGray-100 h-5 w-5 ml-4 mt-0.5 hover:text-bbBlue-200" />
                </a>
              </span>
            </p>
            <p>
              Society balance:{" "}
              <span className="pl-4 pr-2">
                {(societyBalance / EIGHTEENZERO).toFixed(4)}
              </span>
              MATIC
            </p>
          </div>
          {isOwner && (
            <div className="flex flex-col space-y-2 text-bbGray-100 font-medium w-full mt-8">
              <label className="pl-4 text-bbGray-100 font-medium">
                Add Member by Address
              </label>
              <div className="flex">
                <input
                  className="border-4 p-2 rounded-lg border-bbGray-100 w-full"
                  placeholder="New Member Address"
                  value={addOwner}
                  onChange={(e) => setAddOwner(e.target.value)}
                />
                <button
                  onClick={() => handleAddMember()}
                  className="border-4 border-bbGray-100 bg-bbBlue-200 rounded-md px-2 mx-4 font-bold  text-white"
                >
                  add
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col space-y-4 mt-12">
            {isPending ? (
              <div className="">
                <Loading />
              </div>
            ) : (
              <>
                {isMember && societyDeposit && (
                  <div>
                    <button
                      onClick={() => handleDeposit()}
                      className="border-4 border-bbGray-100 bg-bbYellow-300 rounded-md py-2 px-4 font-bold text-xl"
                    >
                      Deposit {societyDeposit} USD
                    </button>
                    <div className="text-center text-bbGray-100">
                      ≈ {maticDeposit.toFixed(4)} MATIC
                    </div>
                  </div>
                )}
                {isOwner && (
                  <>
                    {!serviceData && (
                      <button
                        onClick={() =>
                          router.push(`/create-service?contract=${address}`)
                        }
                        className="border-4 border-bbGray-100 bg-bbYellow-300 rounded-md py-2 px-4 font-bold text-xl"
                      >
                        Create Service
                      </button>
                    )}

                    {serviceData && (
                      <div className="flex flex-col space-y-2 text-bbGray-100 font-medium">
                        <p className="sm:flex">
                          Service Address:{" "}
                          <span className="flex pl-4">
                            <span className="">
                              {addressShortener(serviceData.to)}
                            </span>
                            <a
                              href={`https://mumbai.polygonscan.com/address/${serviceData.to}`}
                              target="_blank"
                              rel="noreferrer noopener"
                            >
                              <ExternalLinkIcon className="text-bbGray-100 h-5 w-5 ml-4 mt-0.5 hover:text-bbBlue-200" />
                            </a>
                          </span>
                        </p>
                        <p>
                          Service fee:
                          <span className="pl-4 pr-2">
                            {(serviceData.amount / EIGHTEENZERO).toFixed(4)}
                          </span>
                          USD
                        </p>
                        <p>
                          Service description:
                          <span className="pl-4 pr-2">{serviceData.data}</span>
                        </p>
                        {!serviceData.executed && (
                          <button
                            onClick={() =>
                              router.push(`/pay-service?contract=${address}`)
                            }
                            className="border-4 border-bbGray-100 bg-bbBlue-200 rounded-md py-2 px-4 font-bold text-xl text-white"
                          >
                            Agree For Service
                          </button>
                        )}
                      </div>
                    )}

                    {serviceData &&
                      serviceData.numApprovals.toString() > 0 &&
                      !serviceData.executed && (
                        <button
                          onClick={() => handleExcutePayment()}
                          className="border-4 border-bbGray-100 bg-bbBlue-200 rounded-md py-2 px-4 font-bold text-xl text-white"
                        >
                          Excute Payment
                        </button>
                      )}
                  </>
                )}
                {serviceData && serviceData.executed && (
                  <div className="flex flex-col space-y-2 text-bbGreen-200 font-bold text-2xl">
                    Service Executed
                  </div>
                )}
              </>
            )}
          </div>
        </Container>
      </div>
    </main>
  );
};
