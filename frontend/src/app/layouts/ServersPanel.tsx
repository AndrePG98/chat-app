import { Divider, User } from '@nextui-org/react';

export default function ServersPanel() {
    return (
        <aside className='servers-panel h-screen w-64 py-5 px-4 border-r border-gray-700 flex flex-col' style={{border: "2px solid green"}}> 
            <nav className='flex justify-center items-center'>
                <div className='space-y-3'>
                    <User
                        name="Jane Doe"
                        description="Product Designer"
                        avatarProps={{
                            src: "https://i.pravatar.cc/150?u=a04258114e29026702d"
                        }}
                    />
                    <Divider className='w-52'></Divider>
                </div>
            </nav>
        </aside>
    );
}