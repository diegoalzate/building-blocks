import { useRouter } from "next/router";
import Head from "next/head";


export const GetMultiSig = () => {
    const router = useRouter();
    const { address } = router.query;
    return (
      <main className="flex flex-col space-y-10 px-96 h-screen">
        <h1 className="text-bbGray-100 text-4xl font-bold text-center">
            Society Name
        </h1>
        <div className="bg-white border-2 rounded-md border-black flex flex-col space-y-24 p-8 items-center">
            <div className="flex flex-col space-y-2">
                <p>Your address: {address}</p>
                <p>Society balance: $100</p>
            </div>
            <div className="flex flex-col space-y-4">
                <button
                    className="border-4 border-bbGray-100 bg-bbYellow-300 rounded-md py-2 px-4 font-bold text-xl"
                >
                    Invite Member
                </button>
                <button
                    className="border-4 border-bbGray-100 bg-bbBlue-200 rounded-md py-2 px-4 font-bold text-xl text-white"
                >
                    Pay for service
                </button>
            </div>
        </div>
      </main>
    )
}