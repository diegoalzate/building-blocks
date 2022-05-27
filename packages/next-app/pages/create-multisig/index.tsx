import type { NextPage } from "next";
import { useState } from "react";
import { CreateMultisig, GetAllMultisigs } from "@/components/contract";

const tabs = [
  { name: "All Multisigs", state: "all", current: true },
  { name: "Create New", state: "create", current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const CreateMultisigPage: NextPage = () => {
  const [nav, setNav] = useState("all");
  const handleRefetch = () => {
    console.log("handleRefetch");
  };
  return (
    <div className="">
      <div className="border-b border-gray-200">
        <div className="sm:flex sm:items-baseline justify-center">
          <div className="mt-4 sm:mt-0 sm:ml-10">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => setNav(tab.state)}
                  className={classNames(
                    tab.state === nav
                      ? "border-bbBlue-200 text-bbBlue-200"
                      : "border-transparent text-bbGray-100 hover:text-bbGreen-200 hover:border-bbGreen-200",
                    "whitespace-nowrap pb-4 px-1 border-b-2 font-bold text-md"
                  )}
                  aria-current={tab.current ? "page" : undefined}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>
      {nav === "all" && <GetAllMultisigs />}
      {nav === "create" && <CreateMultisig refetch={() => handleRefetch()} />}
    </div>
  );
};

export default CreateMultisigPage;
