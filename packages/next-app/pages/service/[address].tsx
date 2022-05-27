import Head from "next/head";
import { useRouter } from "next/router";
import type { NextPage } from "next";

const ServicePage: NextPage = () => {
  const router = useRouter();
  const { address } = router.query;

  return (
    <div className={""}>
      <main>
        <h1>Service Page</h1>
        <div>Contract address: {address}</div>
      </main>
    </div>
  );
};

export default ServicePage;
