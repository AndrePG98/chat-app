// app/providers.tsx
"use client"

import React from "react"
import { NextUIProvider } from "@nextui-org/react"
import { ThemeProvider } from "next-themes"
import { UserContextProvider } from "./context/UserContext"

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<ThemeProvider attribute="class">
			<NextUIProvider>
				<UserContextProvider>{children}</UserContextProvider>
			</NextUIProvider>
		</ThemeProvider>
	)
}
