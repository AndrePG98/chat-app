import { Button } from '@nextui-org/button'
import Image from 'next/image'
import Sidemenu from './layouts/Sidemenu'

export default function Home() {
  return (
	<main className="flex w-screen h-screen bg-white">
		<Sidemenu></Sidemenu>
	</main>
  )
}
