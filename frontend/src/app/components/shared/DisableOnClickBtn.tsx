import React, { useState } from "react"

interface WithDelayedClickProps {
	onClick: () => void
}

export default function withDelayedClick(
	WrappedComponent: (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => JSX.Element
): React.FC<WithDelayedClickProps> {
	return function WithDelayedClick(props: WithDelayedClickProps) {
		const [isDisabled, setIsDisabled] = useState(false)

		const handleClick = () => {
			if (!isDisabled) {
				setIsDisabled(true)
				props.onClick()

				setTimeout(() => {
					setIsDisabled(false)
				}, 1000)
			}
		}

		return <WrappedComponent onClick={handleClick} disabled={isDisabled} />
	}
}
