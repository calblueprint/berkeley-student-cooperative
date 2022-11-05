import '../styles/globals.css'
import type { AppProps } from 'next/app'
<<<<<<< HEAD
<<<<<<< HEAD
import { AuthUserProvider } from '../context/UserContext'

=======
 
>>>>>>> 48c70921c8e4eb2caed5916309e5b07ddeb37263
=======
import { AuthUserProvider } from '../context/UserContext'

>>>>>>> fa275c2d4f60066309321f637d0c57eb791cbcc6
function MyApp({ Component, pageProps }: AppProps) {
	return (
	  <AuthUserProvider>
			<Component {...pageProps} />
	  </AuthUserProvider>
	)
}

export default MyApp
