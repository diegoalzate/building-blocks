import type { NextPage } from "next";
import { CreateMultisig, GetAllMultisigs } from "@/components/contract";

const CreateMultisigPage: NextPage = () => {
  const handleRefetch = () => {
    console.log("handleRefetch");
  };
  return (
    <div className={"h-screen"}>
      <CreateMultisig refetch={() => handleRefetch()} />
      <GetAllMultisigs />
    </div>
  );
};

export default CreateMultisigPage;
