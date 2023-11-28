import { Avatar } from '@nextui-org/react';
import React from 'react';

export default function Message({ message }: { message: string }) {
	return (
		<div className='message flex gap-4 max-w-full'>
			<div>
				<Avatar src='https://source.unsplash.com/random/?avatar' />
			</div>
			<div className='flex-1 overflow-auto'>
				<div className='max-w-[90%]'>
					<p className='text-sm break-words'>{message}</p>
				</div>
			</div>
		</div>
	);
}