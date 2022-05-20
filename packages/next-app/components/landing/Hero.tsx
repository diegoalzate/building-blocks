import { useRouter } from "next/router";
import Image from "next/image";
import { animate } from "motion";

import chairImg from "@/images/bb-landing-chair.png";
import chest from "@/images/bb-landing-chest.png";
import chest2 from "@/images/bb-landing-chest2.png";
import handshake from "@/images/bb-landing-handshake.png";
import shield from "@/images/bb-landing-shield.png";
import { useEffect } from "react";

export const Hero = () => {
  const router = useRouter();

  useEffect(() => {
    animate("#chest", { x: [150, 200], y: [-100, 0] }, { duration: 1 });
    animate("#chest2", { x: [300, 245], y: [-10, -88] }, { duration: 1 });
    animate("#handshake", { x: [0, 242], y: [0, -110] }, { duration: 1 });
    animate("#shield", { x: [0, 157], y: [0, -273] }, { duration: 1 });
    animate("#chairImg", { x: [180, 167], y: [0, -332] }, { duration: 1 });
  }, []);

  return (
    <div className="">
      <div className="sm:flex p-6">
        <div className="sm:w-1/2 my-auto">
          <div className="text-5xl font-bold text-bbGray-100">
            Pay fees together & get decentralized INVOICE NFTs
          </div>
          <div className="py-8 flex justify-center">
            <button
              style={{ stroke: "black", strokeWidth: "2px" }}
              onClick={() => router.push("/create-multisig")}
              className="border-4 border-bbGreen-300 rounded-md py-2 px-4 font-bold text-3xl text-bbYellow-300 textBorder"
            >
              Get Started
            </button>
          </div>
        </div>
        <div className="sm:w-1/2 z-10">
          <div
            className="h-32 w-32 "
            id="chest"
            style={{ position: "relative" }}
          >
            <Image src={chest} layout="fill" />
          </div>
          <div
            className="h-32 w-32 "
            id="chest2"
            style={{ position: "relative" }}
          >
            <Image src={chest2} layout="fill" />
          </div>
          <div
            className="h-32 w-32"
            id="handshake"
            style={{ position: "relative" }}
          >
            <Image src={handshake} layout="fill" />
          </div>
          <div
            className="h-32 w-32"
            id="shield"
            style={{ position: "relative" }}
          >
            <Image src={shield} layout="fill" />
          </div>
          <div
            className="h-32 w-32"
            id="chairImg"
            style={{ position: "relative" }}
          >
            <Image src={chairImg} layout="fill" />
          </div>
        </div>
      </div>
    </div>
  );
};
