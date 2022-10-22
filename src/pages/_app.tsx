import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { AuthUserProvider } from '../firebase/queries/auth' 

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<AuthUserProvider>
			<Component {...pageProps} />
	  </AuthUserProvider>
	)
}

export default MyApp
