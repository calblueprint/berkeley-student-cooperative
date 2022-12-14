import Head from "next/head";
import Layout from "../../../components/Layout/Layout";
import ParseCSV from "../../ParseCsv/ParseCsv";

export default function SchedulePage() {
  return (
    <Layout>
      <div>
        <Head>
          <title>Workshift App</title>
          <meta name="description" content="Next.js firebase Workshift app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <p>This is the house page.</p>
        <main>
          <ParseCSV />
        </main>
        <footer>
          <a href="#" rel="noopener noreferrer">
            Workshift App
          </a>
        </footer>
      </div>
    </Layout>
  );
}
