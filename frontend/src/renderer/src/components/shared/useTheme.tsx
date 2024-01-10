import { useState, useEffect } from 'react'

export default function useDarkMode() {
	const [theme, setTheme] = useState('light')

	const setMode = (mode: string) => {
		window.localStorage.setItem('theme', mode)
		setTheme(mode)
	}

	const toggleTheme = () => {
		theme === 'light' ? setMode('dark') : setMode('light')
	}

	useEffect(() => {
		const localTheme = window.localStorage.getItem('theme')
		localTheme ? setTheme(localTheme) : setTheme('light')
	}, [])

	return [theme, toggleTheme]
}
