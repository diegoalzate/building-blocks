import type { NextPage } from "next";
import { ServiceApproval } from "@/components/contract";

const PayServicePage: NextPage = () => {
  return (
    <div className={"h-screen"}>
      <ServiceApproval />
    </div>
  );
};

export default PayServicePage;
