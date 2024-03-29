import { VisuallyHidden, useSwitch } from "@nextui-org/react"

const ThemeSwitch = () => {
	const toggleDarkMode = (e: boolean) => {
		e
			? document.documentElement.classList.replace("dark", "light")
			: document.documentElement.classList.replace("light", "dark")
	}

	const { Component, slots, isSelected, getBaseProps, getInputProps, getWrapperProps } =
		useSwitch({ onValueChange: toggleDarkMode })

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
							"w-9 h-9",
							"flex items-center justify-center",
							"rounded-md",
							isSelected ? "bg-primary" : "bg-surface-300",
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
		</div>
	)
}

export default ThemeSwitch
