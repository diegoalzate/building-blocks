import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useContract, useSigner, useAccount } from "wagmi";

import contracts from "@/contracts/hardhat_contracts.json";
import { NETWORK_ID, EIGHTEENZERO } from "@/config";
import { ethers } from "ethers";

import { Container, Loading } from "@/components/elements";
import { ExternalLinkIcon } from "@heroicons/react/outline";

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
    <main>
      <h1 className="text-bbGray-100 text-4xl font-bold text-center">
        {societyName}
      </h1>
      <div className="mt-6">
        <Container>
          <div className="flex flex-col space-y-2 text-bbGray-100 font-medium">
            <p className="flex">
              Contract Address: {address}{" "}
              <a
                href={`https://mumbai.polygonscan.com/address/${address}`}
                target="_blank"
                rel="noreferrer noopener"
              >
                <ExternalLinkIcon className="text-bbGray-100 h-5 w-5 ml-4" />
              </a>
            </p>
            <p>
              Society balance: {(societyBalance / EIGHTEENZERO).toFixed(4)}{" "}
              MATIC{" "}
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
              </>
            )}
          </div>
        </Container>
      </div>
    </main>
  );
};
