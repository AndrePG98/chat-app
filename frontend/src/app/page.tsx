import { Button } from '@nextui-org/button'
import Image from 'next/image'
import RegisterCard from './shared/components/RegisterCard'
import LoginCard from './shared/components/LoginCard'
import Sidemenu from './layouts/Sidemenu'

export default function Home() {
	return (
		<main className="flex items-center justify-between">
			<div className='flex flex-row w-full'>
				<Sidemenu></Sidemenu>
			</div>
		</main>
	)
}
