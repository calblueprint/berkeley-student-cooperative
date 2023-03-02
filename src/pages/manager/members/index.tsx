import Head from 'next/head'
import Layout from '../../../components/Layout/Layout'
import { MembersTableContent } from './MembersTableContent'

export default function MembersPage() {
  return (
    <Layout>
      <div>
        <Head>
          <title>Workshift App</title>
          <meta name="description" content="Next.js firebase Workshift app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <p>This is the members page.</p>
        <main>
          <MembersTableContent/>
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