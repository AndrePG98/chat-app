import React from "react"
import { Switch, VisuallyHidden, useSwitch } from "@nextui-org/react"

const ThemeSwitch = ({ changeTheme }) => {
	const { Component, slots, isSelected, getBaseProps, getInputProps, getWrapperProps } =
		useSwitch({
			onValueChange: changeTheme,
		})

	return (
		<div className="flex flex-row gap-1 items-center">
			<Component {...getBaseProps()}>
				<VisuallyHidden>
					<input {...getInputProps()} />
				</VisuallyHidden>
				<div
					{...getWrapperProps()}
					className={slots.wrapper({
						class: [
							"w-10 h-10",
							"flex items-center justify-center",
							"rounded-none",
							isSelected ? "bg-white" : "bg-surface-300",
						],
					})}
				>
					{isSelected ? (
						<span className="material-symbols-outlined">light_mode</span>
					) : (
						<span className="material-symbols-outlined">dark_mode</span>
					)}
				</div>
			</Component>
			<p className="select-none">{isSelected ? "Light mode" : "Dark mode"}</p>
		</div>
	)
}

export default ThemeSwitch
