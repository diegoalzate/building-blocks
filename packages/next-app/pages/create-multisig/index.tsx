import type { NextPage } from "next";
import { CreateMultisig, GetAllMultisigs } from "@/components/contract";

const CreateMultisigPage: NextPage = () => {
  return (
    <div className={"h-screen"}>
      <CreateMultisig />
      <GetAllMultisigs />
    </div>
  );
};

export default CreateMultisigPage;
