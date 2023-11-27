import Sidemenu from './layouts/Sidemenu'
import MainPage from './layouts/MainPage'

export default function Home() {
	return (
		<main className="flex h-screen flex-row">
			<Sidemenu></Sidemenu>
			<MainPage></MainPage>
		</main>
	)
}
