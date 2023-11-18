import Sidemenu from './layouts/Sidemenu'

export default function Home() {
  return (
	<main className="flex min-h-screen flex-col justify-between">
		<div className="flex space-x-8">
			<Sidemenu></Sidemenu>
	  	</div>
	</main>
  )
}
