CREATE TABLE IF NOT EXISTS guilds (
    id VARCHAR(255) PRIMARY KEY,
    owner_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL
);


CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255) PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    logo BYTEA NOT NULL
);


CREATE TABLE IF NOT EXISTS channels (
    id VARCHAR(255) PRIMARY KEY NOT NULL,
    guild_id VARCHAR(255) REFERENCES guilds(id) NOT NULL,
    type VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL
);


CREATE TABLE IF NOT EXISTS guild_users (
    guild_id VARCHAR(255) REFERENCES guilds(id) NOT NULL,
    user_id VARCHAR(255) REFERENCES users(id) NOT NULL,
    PRIMARY KEY (guild_id, user_id)
);

CREATE TABLE IF NOT EXISTS messages (
    id VARCHAR(255) PRIMARY KEY,
    guild_id VARCHAR(255) REFERENCES guilds(id) NOT NULL,
    channel_id VARCHAR(255) REFERENCES channels(id) NOT NULL,
    sender_id VARCHAR(255) REFERENCES users(id) NOT NULL,
    content TEXT NOT NULL,
    send_time DATE NOT NULL
);


CREATE TABLE IF NOT EXISTS channel_members (
    channel_id VARCHAR(255) REFERENCES channels(id) NOT NULL,
    guild_id VARCHAR(255) REFERENCES guilds(id) NOT NULL,
    user_id VARCHAR(255) REFERENCES users(id) NOT NULL,
    PRIMARY KEY (channel_id, guild_id, user_id)
);
