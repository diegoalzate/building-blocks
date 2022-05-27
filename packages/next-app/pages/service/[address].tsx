import Head from "next/head";
import { useRouter } from "next/router";
import type { NextPage } from "next";

const ServicePage: NextPage = () => {
  const router = useRouter();
  const { address } = router.query;

  return (
    <div className={""}>
      <Head>
        <title>Create-Web3 App</title>
        <meta name="description" content="Generated by npx create-web3" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>Service Page</h1>
        <div>Contract address: {address}</div>
      </main>
    </div>
  );
};

export default ServicePage;
