import React from 'react';
import { Button } from '@nextui-org/react';

export default function(props: {name : String}) {
    return (
        <Button className="h-8" endContent={<span className="material-symbols-outlined ml-8">edit</span>}>
            {props.name}
        </Button>
    );
}