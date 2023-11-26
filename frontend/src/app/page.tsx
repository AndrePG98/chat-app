import Server from './components/Server'
import ServersPanel from './layouts/ServersPanel'

export default function Home() {
	return (
		<main className="flex h-screen flex-row justify-between">
			<ServersPanel></ServersPanel>
			<Server></Server>
		</main>
	)
}



// // ChannelPage.tsx

// import React from 'react';
// import { Button } from '@nextui-org/react';

// interface ChannelPageProps {
//     createNewChannel: () => void;
// }

// const ChannelsPage: React.FC<ChannelPageProps> = ({ createNewChannel }) => {
//     return (
//         <div>
//             <h2>Channel Page</h2>
//             <Button onClick={createNewChannel}>Create New Channel</Button>
//         </div>
//     );
// };

// export default ChannelsPage;
/* 

<div className="h-screen w-fit flex-1 flex flex-row">
            <div className="w-64 h-full flex flex-col pt-2 border-r border-gray-700">
                <div className="header flex flex-col justify-center items-center pb-5">
                    <div className="text-2xl">Group Name</div>
                </div>
                <Divider />
                <div className="body flex flex-col py-5 flex-grow">
                    {channels.map((channel) => (
                        <Button className="m-1" radius="sm" key={channel.id} onClick={() => handleChannelClick(channel.id)}>
                            {channel.name}
                        </Button>
                    ))}
                </div>
                <Divider />
                <div className="footer">
                    <ButtonGroup variant="light" className="flex flex-col" radius="none" size="sm" fullWidth>
                        <Button isIconOnly className="flex justify-center items-center w-full" onClick={onOpen}>
                            {addIcon}
                        </Button>
                        {selectedChannel && (
                            <Button color="danger" onClick={leaveChannel}>
                                Leave Channel
                            </Button>
                        )}
                    </ButtonGroup>
                </div>
            </div>
            <div>
                {selectedChannel && (
                    <div>
                        <h2>{channels.find((channel) => channel.id === selectedChannel)?.name}</h2>
                        {channelMessages[selectedChannel] && channelMessages[selectedChannel].map((message) => message)}
                        <ChatPage channelId={selectedChannel} addMessage={addMessage} />
                    </div>
                )}
            </div>
            <CreateChannelModal onOpen={onOpen} isOpen={isOpen} onOpenChange={onOpenChange} setChannels={setChannel} />
        </div>

		 */