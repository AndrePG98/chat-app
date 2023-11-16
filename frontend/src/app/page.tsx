import { Button } from '@nextui-org/button'
import Image from 'next/image'
import RegisterPage from './layouts/RegisterPage'

export default function Home() {
  return (
	<main className="flex min-h-screen flex-col items-center justify-between p-24">
		<div>
			<RegisterPage></RegisterPage>
	  	</div>
	</main>
  )
}
