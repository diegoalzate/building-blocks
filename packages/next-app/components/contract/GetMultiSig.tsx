import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useContract, useSigner, useAccount } from "wagmi";

import contracts from "@/contracts/hardhat_contracts.json";
import { NETWORK_ID } from "@/config";

export const GetMultiSig = () => {
  const router = useRouter();
  const { address } = router.query;
  const chainId = Number(NETWORK_ID);
  const { data: signerData } = useSigner();
  const { data: accountData } = useAccount();
  const [isOwner, setIsOwner] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [societyName, setSocietyName] = useState("");
  const [societyDeposit, setSocietyDeposit] = useState<any>();
  const [addOwner, setAddOwner] = useState("");
  const [serviceData, setServiceData] = useState<any>();

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
    console.log("fetchData");
    const name = await multisigContract.societyName();
    setSocietyName(name);

    const owner = await multisigContract.isOwner(accountData?.address);
    console.log("isOwner", owner);
    setIsOwner(owner);

    const deposit = await multisigContract.deposit();
    // console.log("deposit", deposit);
    setSocietyDeposit(deposit);

    const isNewMember = await multisigContract.isNewMember(
      accountData?.address
    );
    console.log("isNewMember", isNewMember);
    setIsMember(isNewMember);

    try {
      const serviceContract = await multisigContract.serviceTransactions(0);
      // console.log("serviceContract", serviceContract);
      if (serviceContract) setServiceData(serviceContract);
    } catch (error) {
      // console.log("error", error);
    }

    // const numApprovalsRequired = await multisigContract.numApprovalsRequired();
    // console.log("numApprovalsRequired", numApprovalsRequired);
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
    try {
      const tx = await multisigContract.newOwner({
        value: societyDeposit,
      });
      tx.wait(1).then(() => {
        fetchData();
      });
    } catch (e) {
      console.log("error", e);
    }
  };

  const handleExcutePayment = async () => {
    console.log("handleExcutePayment");
    // executeTransaction;

    try {
      const tx = await multisigContract.executeTransaction(0);
      tx.wait(1).then(() => {
        fetchData();
      });
    } catch (e) {
      console.log("error", e);
    }
  };

  return (
    <main className="flex flex-col space-y-10 px-4 md:px-40 lg:px-52 xl:px-96 h-screen">
      <h1 className="text-bbGray-100 text-4xl font-bold text-center">
        {societyName}
      </h1>
      <div className="bg-white border-4 rounded-md border-bbGray-100 flex flex-col space-y-24 p-8 items-center">
        <div className="flex flex-col space-y-2 text-bbGray-100 font-medium">
          <p>Contract Address: {address}</p>
          <p>Society balance: $100</p>
        </div>
        {isOwner && (
          <div className="flex flex-col space-y-2 text-bbGray-100 font-medium w-full">
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

        <div className="flex flex-col space-y-4">
          {isMember && societyDeposit && (
            <button
              onClick={() => handleDeposit()}
              className="border-4 border-bbGray-100 bg-bbYellow-300 rounded-md py-2 px-4 font-bold text-xl"
            >
              Deposit {societyDeposit.toString()}
            </button>
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
                <button
                  onClick={() =>
                    router.push(`/pay-service?contract=${address}`)
                  }
                  className="border-4 border-bbGray-100 bg-bbBlue-200 rounded-md py-2 px-4 font-bold text-xl text-white"
                >
                  Agree For Service
                </button>
              )}

              {serviceData && serviceData.numApprovals.toString() > 0 && (
                <button
                  onClick={() => handleExcutePayment()}
                  className="border-4 border-bbGray-100 bg-bbBlue-200 rounded-md py-2 px-4 font-bold text-xl text-white"
                >
                  Excute Payment
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
};
