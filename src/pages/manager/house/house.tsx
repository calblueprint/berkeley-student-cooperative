import Head from "next/head";
import router from "next/router";
import Layout from "../../../components/Layout/Layout";

export default function SchedulePage() {
    return (
        <Layout>
        <div>
            <Head>
            <title>Workshift App</title>
            <meta name="description" content="Next.js firebase Workshift app" />
            <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
            <h1>Manager's House Members Page</h1>
            <button
            onClick={() => {
              router.push("/ParseCsv/ParseCsv");
            }}
          >
            Upload House List
          </button>
            </main>
            <footer>
            <a href="#" rel="noopener noreferrer">
                Workshift App
            </a>
            </footer>
        </div>
        </Layout>
    )
  }