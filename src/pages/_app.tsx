import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { AuthState } from '../context/UserContext'

import { Provider } from 'react-redux'
import { store } from '../store/store'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <AuthState>
        <Component {...pageProps} />
      </AuthState>
    </Provider>
  )
}
export default MyApp
