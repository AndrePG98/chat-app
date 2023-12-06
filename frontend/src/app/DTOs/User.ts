export class User {
    id: string;
    name: string;
    guilds: string[];

    constructor(id: string, name: string, guilds: string[]) {
        this.id = id;
        this.name = name;
        this.guilds = guilds;
    }
}
