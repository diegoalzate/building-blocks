import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useContract, useSigner, useAccount } from "wagmi";

import contracts from "@/contracts/hardhat_contracts.json";
import { NETWORK_ID, EIGHTEENZERO } from "@/config";
import { BigNumber, ethers } from "ethers";

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
  const [extraDeposit, setExtraDepoist] = useState(0);
  const [userBalanceInSociety, setUserBalanceInSociety] = useState(0);
  const [addOwner, setAddOwner] = useState("");
  const [societyBalance, setSocietyBalance] = useState(0);
  const [allServices, setAllServices] = useState<any>();

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
    // console.log("fetchData");
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

    const userBalance = await multisigContract.balances(accountData?.address);
    setUserBalanceInSociety(userBalance);

    try {
      const getServiceTransactions =
        await multisigContract.getServiceTransactions();
      if (getServiceTransactions) setAllServices(getServiceTransactions);
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

  const handleExtraDeposit = async () => {
    try {
      const amountInMatic = await multisigContract.getPriceOfUsd(
        ethers.utils.parseEther(extraDeposit.toString())
      );
      const tx = await multisigContract.depositIntoContract({
        gasLimit: "1000000",
        value: amountInMatic,
      });
      tx.wait(1).then(() => {
        fetchData();
        setExtraDepoist(0); 
      });
    } catch (e) {
      console.log("error", e);
    }
  };

  const handleWithdraw = async () => {
    try {
      const tx = await multisigContract.withdraw();
      tx.wait(1).then(() => {
        fetchData();
      });
    } catch (e) {
      console.log("error", e);
    }
  }

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

  const handleExcutePayment = async (index: number) => {
    setIsPending(true);
    try {
      const tx = await multisigContract.executeTransaction(index);
      tx.wait(1).then(() => {
        fetchData();
        setIsPending(false);
      });
    } catch (e) {
      console.log("error", e);
      setIsPending(false);
    }
  };

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
          <div className="sm:flex text-bbGray-100 font-medium w-full justify-between">
            <p className="sm:flex">
              Contract Address:
              <span className="flex pl-4">
                <span className="">{addressShortener(address as string)}</span>
                <a
                  href={`https://mumbai.polygonscan.com/address/${address}`}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <ExternalLinkIcon className="text-bbGray-100 h-5 w-5 ml-4 mt-0.5 hover:text-bbBlue-200" />
                </a>
              </span>
            </p>
            <div className="flex flex-col">
              <p>
                Balance:
                <span className="pl-4 pr-2">
                  {(societyBalance / EIGHTEENZERO).toFixed(4)}
                </span>
                MATIC
              </p>
              <p>
                Your Balance:
                <span className="pl-4 pr-2">
                  {(userBalanceInSociety / EIGHTEENZERO).toFixed(4)}
                </span>
                MATIC
              </p>
            </div>
          </div>
          {isOwner && (
            <>
              <div className="flex flex-col space-y-2 text-bbGray-100 font-medium w-full mt-4">
                <label className="pl-4 text-bbGray-100 font-medium">
                  Deposit into wallet
                </label>
                <div className="flex">
                  <input
                    className="border-4 p-2 rounded-lg border-bbGray-100 w-1/2"
                    placeholder="despoit amount in usd"
                    type={'number'}
                    min={0}
                    value={extraDeposit}
                    onChange={(e) => setExtraDepoist(Number(e.target.value))}
                  />
                  <button
                    onClick={() => handleExtraDeposit()}
                    className="border-4 border-bbGray-100 bg-bbBlue-200 rounded-md px-2 mx-4 font-bold  text-white"
                  >
                    desposit
                  </button>
                  <button
                    onClick={() => handleWithdraw()}
                    className="border-4 border-bbGray-100 bg-bbBlue-200 rounded-md px-2 mx-4 font-bold  text-white"
                  >
                    withdraw your balance
                  </button>
                </div>
              </div>
              <div className="flex flex-col space-y-2 text-bbGray-100 font-medium w-full mt-4">
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
            </>
          )}

          <div className="mt-8 w-full">
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
                      className="border-4 border-bbGray-100 bg-bbYellow-300 rounded-md py-2 px-4 font-bold text-xl w-full"
                    >
                      Deposit {societyDeposit} USD
                    </button>
                    <div className="text-center text-bbGray-100">
                      ≈ {maticDeposit.toFixed(4)} MATIC + gas
                    </div>
                  </div>
                )}
                {isOwner && (
                  <>
                    <button
                      onClick={() =>
                        router.push(`/create-service?contract=${address}`)
                      }
                      className="border-4 border-bbGray-100 bg-bbYellow-300 rounded-md py-2 px-4 font-bold text-xl w-full"
                    >
                      Create New Service
                    </button>

                    {allServices && allServices.length > 0 && (
                      <div className="w-full mt-4">
                        <div className="text-center text-bbGray-100 font-bold text-xl py-2">
                          Services
                        </div>
                        {allServices.map((service: any, index: number) => (
                          <ServiceItem
                            key={index}
                            index={index}
                            service={service}
                            contract={address as string}
                            handleExcutePayment={() =>
                              handleExcutePayment(index)
                            }
                          />
                        ))}
                      </div>
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

interface ServiceItemProps {
  service: {
    amount: BigNumber | any;
    data: string;
    to: string;
    executed: boolean;
    numApprovals: BigNumber;
    tokenId: BigNumber;
  };
  contract: string;
  index: number;
  handleExcutePayment: (index: number) => void;
}

const ServiceItem = ({
  service,
  contract,
  index,
  handleExcutePayment,
}: ServiceItemProps) => {
  const router = useRouter();

  if (!service) return null;
  return (
    <div className="flex justify-between border-2 border-bbGray-100 rounded-lg p-2 my-1 text-bbGray-100 font-medium">
      <div>
        <p className="sm:flex">
          Contractor Address:
          <span className="flex pl-4">
            <span className="">{addressShortener(service.to)}</span>
            <a
              href={`https://mumbai.polygonscan.com/address/${service.to}`}
              target="_blank"
              rel="noreferrer noopener"
            >
              <ExternalLinkIcon className="text-bbGray-100 h-5 w-5 ml-4 mt-0.5 hover:text-bbBlue-200" />
            </a>
          </span>
        </p>
        <p>
          Fee:
          <span className="pl-4 pr-2">
            {(service.amount / EIGHTEENZERO).toFixed(4)}
          </span>
          USD
        </p>
        <p>
          Description:
          <span className="pl-4 pr-2">{service.data}</span>
        </p>
      </div>
      <div className="m-auto space-y-2 flex flex-col">
        {!service.executed && (
          <button
            onClick={() =>
              router.push(`/pay-service?contract=${contract}&index=${index}`)
            }
            className="border-4 border-bbGray-100 bg-bbBlue-200 rounded-md py-1 px-4 font-bold text-lg text-white"
          >
            Agree For Service
          </button>
        )}
        {!service.executed && service.numApprovals._hex !== "0x00" && (
          <button
            onClick={() => handleExcutePayment(index)}
            className="border-4 border-bbGray-100 bg-bbBlue-200 rounded-md py-1 px-4 font-bold text-lg text-white"
          >
            Excute Payment
          </button>
        )}
        {service && service.executed && (
          <div className=" text-bbGreen-200 font-bold text-2xl">
            Service Executed
          </div>
        )}
      </div>
    </div>
  );
};
