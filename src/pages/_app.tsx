import '../styles/globals.css'
import type { AppProps } from 'next/app'
<<<<<<< HEAD

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<Component {...pageProps} />
=======
import { AuthUserProvider } from '../context/UserContext'

function MyApp({ Component, pageProps }: AppProps) {
	return (
	  <AuthUserProvider>
			<Component {...pageProps} />
	  </AuthUserProvider>
>>>>>>> fa275c2d4f60066309321f637d0c57eb791cbcc6
	)
}

export default MyApp
