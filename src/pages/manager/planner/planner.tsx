import Head from "next/head";
import Layout from "../../../components/Layout/Layout";
import ShiftCard from "../../../components/ManagerComponents/Shiftcard/Shiftcard";

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
            <h1>Manager's Planner Page</h1>
            <ShiftCard />
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