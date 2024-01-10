import React from 'react'
import ReactDOM from 'react-dom/client'
import './assets/index.css'
import App from './App'
import { NextUIProvider } from '@nextui-org/react'
import { UserContextProvider } from './context/UserContext'
require('dotenv').config()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<NextUIProvider id="nextui">
			<UserContextProvider>
				<App />
			</UserContextProvider>
		</NextUIProvider>
	</React.StrictMode>
)
