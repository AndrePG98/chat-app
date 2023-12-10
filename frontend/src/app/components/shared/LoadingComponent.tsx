import React from "react"
import { Spinner } from "@nextui-org/react"

export default function LoadingComponent() {
	return (
		<div className="flex justify-center items-center h-full w-full">
			<Spinner size="lg" color="danger" labelColor="danger" label="Loading..."></Spinner>
		</div>
	)
}
