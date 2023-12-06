// app/providers.tsx
'use client'

import { NextUIProvider } from '@nextui-org/react'
import UserContextProvider from './contexts/userContext'
import React from "react"

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<NextUIProvider>
			<UserContextProvider>
				{children}
			</UserContextProvider>
		</NextUIProvider>
	)
}