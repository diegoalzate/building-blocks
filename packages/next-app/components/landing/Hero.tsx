import { useRouter } from "next/router";

export const Hero = () => {
  const router = useRouter();
  return (
    <div className="h-screen">
      <div className="flex p-6">
        <div className="w-1/2">
          <div className="text-5xl font-bold text-bbGray-100">
            Pay fees together & get decentralized INVOICE NFTs
          </div>
          <div className="py-8 flex justify-center">
            <button
              onClick={() => router.push("/create-multisig")}
              className="border-4 border-bbGreen-300 rounded-md py-2 px-4 font-bold text-3xl text-bbYellow-300 text-shadow"
            >
              Get Started
            </button>
          </div>
        </div>
        <div className="w-1/2">pictures here</div>
      </div>
    </div>
  );
};
