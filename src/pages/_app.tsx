import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { AuthUserProvider, AuthState } from '../context/UserContext'

import { Provider } from 'react-redux'
import { store } from '../store/store'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      {/* <AuthUserProvider> */}
      <AuthState />
      <Component {...pageProps} />
      {/* </AuthUserProvider> */}
    </Provider>
  )
}
export default MyApp
