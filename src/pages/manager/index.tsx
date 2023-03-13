import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import Layout from '../../components/Layout/Layout'
import SortedTable from '../../components/shared/tables/SortedTable'
import { HeadCell } from '../../interfaces/interfaces'

const Home: NextPage = () => {
  // const shiftHeadCells: HeadCell<Shift & { [key in keyof Shift]: string | number }>[] = [
  // {
  //   id: 'day',
  //   isNumeric: false,
  //   label: 'Day',
  //   isSortable: true,
  //   align: 'left',
  // },
  // {
  //   id: 'timeWindowDisplay',
  //   isNumeric: true,
  //   label: 'Time',
  //   isSortable: false,
  //   align: 'right',
  // },
  // {
  //   id: 'length',
  //   isNumeric: true,
  //   label: 'Length',
  //   isSortable: true,
  //   align: 'right',
  // },
  //]
  return (
    <Layout>
      <div className={styles.container}>
        <Head>
          <title>Managers Dashboard</title>
        </Head>
        <main className={styles.main}>
          <h1 className={styles.title}>Managers Dashboard</h1>
          {/* <SortedTable ids={[]} entities={{}} headCells={headerRow} isCheckable={false} isSortable={true}/> */}
        </main>
        <footer className={styles.footer}>
          <a href="#" rel="noopener noreferrer">
            Workshift App
          </a>
        </footer>
      </div>
    </Layout>
  )
}

export default Home
