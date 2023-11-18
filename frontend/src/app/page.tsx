import Sidemenu from './layouts/Sidemenu'
import MainPage from './layouts/MainPage'

export default function Home() {
	return (
		<main className="flex h-screen flex-row justify-between">
			<Sidemenu></Sidemenu>
			<MainPage></MainPage>
		</main>
	)
}
