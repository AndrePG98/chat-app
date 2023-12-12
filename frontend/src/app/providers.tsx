// app/providers.tsx
"use client"

import React from "react"
import { NextUIProvider } from "@nextui-org/react"
import { UserContextProvider } from "./context/UserContext"

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<NextUIProvider>
			<UserContextProvider>{children}</UserContextProvider>
		</NextUIProvider>
	)
}
