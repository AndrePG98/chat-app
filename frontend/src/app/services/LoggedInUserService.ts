import { useState } from "react";
import { User } from "../DTOs/User";
//export const UserContext = createContext<User>({id: "", name: "", guilds: []});

export default function useLoggedInUser() {
	const [user, setUser] = useState<User>({
		id: "",
		name: "",
		guilds: [],
	});
	/* const [userId, setUserId] = React.useState('');
    const [userName, setUserName] = React.useState('');
    const [guilds, setGuilds] = React.useState(''); */

	const login = (userId: string, userName: string, guilds: string[]) => {
		setUser({
			id: userId,
			name: userName,
			guilds: guilds,
		});
	};

	return { user, login };
}
