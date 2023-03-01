import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { AuthUserProvider } from '../context/UserContext'

import { Provider } from 'react-redux'
import { store } from '../store/store'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <AuthUserProvider>
        <Component {...pageProps} />
      </AuthUserProvider>
    </Provider>
  )
}
export default MyApp
