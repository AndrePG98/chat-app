import { SelectedChannelContext } from '@/app/components/Server';
import { Button } from '@nextui-org/react';
import { useContext } from 'react';

export default function TextChannelBtn(props: { channelName: string, channelId: number }) {

    const { selectChannel } = useContext(SelectedChannelContext);

    return (
        <Button
            onPress={() => selectChannel(props.channelId)}
            className="h-8 w-full text-lg flex justify-start"
            startContent={<span className="material-symbols-outlined">edit</span>}
            variant='light'
            radius='none'
        >
            {props.channelName}
        </Button>
    );
};
