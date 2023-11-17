import Sidemenu from './layouts/Sidemenu'

export default function Home() {
  return (
	<main className="flex min-h-screen flex-col items-center justify-between p-24">
		<div className="flex justify-center space-x-8">
			<RegisterCard></RegisterCard>
			<LoginCard></LoginCard>
			<Sidemenu></Sidemenu>
	  	</div>
	</main>
  )
}
