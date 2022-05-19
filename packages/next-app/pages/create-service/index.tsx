import type { NextPage } from "next";
import { CreateService } from "@/components/contract";

const CreateServicePage: NextPage = () => {
  return (
    <div className={"h-screen"}>
      <CreateService />
    </div>
  );
};

export default CreateServicePage;
