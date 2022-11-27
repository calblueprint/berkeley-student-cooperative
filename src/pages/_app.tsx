import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { AuthUserProvider } from '../context/UserContext'

function MyApp(this: any, { Component, pageProps }: AppProps) {
	return (
	  <AuthUserProvider>
			<Component {...pageProps} />
	  </AuthUserProvider>
	)
}

export default MyApp
