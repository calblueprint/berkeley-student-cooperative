import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { AuthUserProvider } from '../context/UserContext'

function MyApp({ Component, pageProps }: AppProps) {
	console.log("I am in MYAPP $$$$$$$$$$$$$$")
	return (
	  <AuthUserProvider>
			<Component {...pageProps} />
	  </AuthUserProvider>
	)
}

export default MyApp
