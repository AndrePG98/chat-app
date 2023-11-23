import React from 'react';
import { Button } from '@nextui-org/react';

export default function (props: { name: String }) {
    return (
        <Button
            className="h-8 w-full text-lg flex justify-start"
            startContent={<span className="material-symbols-outlined">edit</span>}
            variant='light'
            radius='none'
        >
            {props.name}
        </Button>
    );
}