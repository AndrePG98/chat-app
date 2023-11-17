import { Button } from '@nextui-org/button'
import Image from 'next/image'
import RegisterCard from './shared/components/RegisterCard'
import LoginCard from './shared/components/LoginCard'

export default function Home() {
  return (
	<main className="flex min-h-screen flex-col items-center justify-between p-24">
		<div className="flex justify-center space-x-8">
			<RegisterCard></RegisterCard>
			<LoginCard></LoginCard>
	  	</div>
	</main>
  )
}
