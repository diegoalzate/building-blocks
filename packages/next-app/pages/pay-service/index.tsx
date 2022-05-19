import type { NextPage } from "next";
import { PayService } from "@/components/contract";

const PayServicePage: NextPage = () => {
  return (
    <div className={"h-screen"}>
      <PayService />
    </div>
  );
};

export default PayServicePage;
