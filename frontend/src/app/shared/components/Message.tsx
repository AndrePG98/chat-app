import { Card, Avatar } from '@nextui-org/react'
import React from 'react'

export default function Message() {
    return (
        <Card fullWidth className='h-12 text-sm bg-transparent flex flex-row gap-5 items-center py-3 px-2' radius='sm'>
            <Avatar src="https://source.unsplash.com/random/?avatar"/>
            <span>Example message testing out the component</span>
        </Card>
    )
}
