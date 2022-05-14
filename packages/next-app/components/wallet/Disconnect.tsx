import { useDisconnect, useConnect, useAccount } from "wagmi";

export const Disconnect = () => {
  const { disconnect } = useDisconnect();
  const { activeConnector } = useConnect();
  const { data: accountData } = useAccount();

  return (
    <>
      {activeConnector && accountData && (
        <>
          <div>Connected with address : {accountData?.address}</div>
          <button className="border m-1 p-1" onClick={() => disconnect()}>
            Disconnect from {activeConnector?.name}
          </button>
        </>
      )}
    </>
  );
};
