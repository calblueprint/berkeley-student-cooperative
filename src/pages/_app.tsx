import '../styles/globals.css'
import type { AppProps } from 'next/app'
<<<<<<< HEAD
import { AuthUserProvider } from '../context/UserContext'

=======
 
>>>>>>> 48c70921c8e4eb2caed5916309e5b07ddeb37263
function MyApp({ Component, pageProps }: AppProps) {
	return (
	  <AuthUserProvider>
			<Component {...pageProps} />
	  </AuthUserProvider>
	)
}

export default MyApp
