// app/providers.tsx
"use client"

import { NextUIProvider } from "@nextui-org/react"
import React from "react"
import { AuthProvider } from "./contexts/authContext"

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<NextUIProvider>
			<AuthProvider>{children}</AuthProvider>
		</NextUIProvider>
	)
}
