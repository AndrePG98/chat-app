export interface Event {
    type: number
    body: any
}

export class RegisterEvent implements Event {
    type: number
    body: any

    constructor(username: string, password: string, email: string) {
        this.type = 0
        this.body = { username, password, email }
    }
}

export class LoginEvent implements Event {
    type: number
    body: any

    constructor(username: string, password: string, token: string) {
        this.type = 1
        this.body = { username, password, token }
    }
}

export class LogoutEvent implements Event {
    type: number
    body: any;
    constructor(username: string) {
        this.type = 2
        this.body = { username }
    }
}

export class ChatMessageEvent implements Event {
    type: number
    body: any

    constructor(senderId: string, guildId: string, channelId: string, content: string) {
        this.type = 3
        this.body = {
            senderId,
            guildId,
            channelId,
            content,
            sendAt: new Date(Date.now()).toLocaleDateString("en-GB")
        }
    }

}

export interface AuthenticationResult {
    type: number
    body: {
        result: boolean
        token: string
        userId: string
        username: string
        state: string[]
    }
}