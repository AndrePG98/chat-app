package main

import (
	"database/sql"
	"fmt"
	"log"
	"wsServer/models"

	_ "github.com/lib/pq"

	"github.com/google/uuid"
)

type Database struct {
	db *sql.DB
}

func NewDatabase() *Database {
	return &Database{}
}

func (db *Database) Connect() {
	connStr := "postgres://postgres:chatapp@localhost:5432/Chatapp?sslmode=disable"
	conn, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}

	err = conn.Ping()
	if err != nil {
		log.Fatal("Error connecting to the database:", err)
	}

	conn.SetMaxIdleConns(10)
	conn.SetMaxOpenConns(100)
	db.db = conn
	fmt.Println("Connected to Database")

}

func (db *Database) Disconnect() {
	db.db.Close()
}

func (db *Database) CreateUser(username string, password string, email string) (string, string, error) {
	id := uuid.NewString()
	hashedPW := hashPassword(username, password)

	tx, err := db.db.Begin()
	if err != nil {
		return "", "", fmt.Errorf("error starting transaction: %v", err)
	}
	defer tx.Rollback()

	selectQuery := `SELECT COUNT(*) FROM users WHERE email = $1`
	var count int
	row := tx.QueryRow(selectQuery, email)
	err = row.Scan(&count)
	if err != nil {
		return "", "", fmt.Errorf("error checking emails: %v", err)
	}
	if count > 0 {
		return "", "", fmt.Errorf("email already in use: %v", email)
	}

	insertQuery := `INSERT INTO users (id, username, email, logo, password) VALUES ($1, $2, $3, $4, $5)`
	_, err = tx.Exec(insertQuery, id, username, email, []byte{}, hashedPW)
	if err != nil {
		return "", "", fmt.Errorf("error executing query: %v", err)
	}

	if err = tx.Commit(); err != nil {
		return "", "", fmt.Errorf("error committing transaction: %v", err)
	}

	token, err := generateToken(id, username)
	if err != nil {
		return "", "", fmt.Errorf("error generating token: %v", err)
	}

	return id, token, nil
}

func (db *Database) FetchUserByToken(token string) (string, string, string, []models.Guild, error) {
	claims, err := verifyToken(token)
	if err != nil {
		return "", "", "", []models.Guild{}, fmt.Errorf("error verifying token: %v", err)
	}
	id, _ := claims["userId"].(string)
	username, _ := claims["username"].(string)
	tx, err := db.db.Begin()
	if err != nil {
		return "", "", "", []models.Guild{}, fmt.Errorf("error starting transaction: %v", err)
	}
	defer tx.Rollback()
	query := `SELECT COUNT(*) FROM users WHERE id = $1 AND username = $2`
	var count int
	_ = tx.QueryRow(query, id, username).Scan(&count)
	if count != 1 {
		return "", "", "", []models.Guild{}, fmt.Errorf("error bad credentials: %v", count)
	}

	newToken, err := generateToken(id, username)
	if err != nil {
		return "", "", "", []models.Guild{}, fmt.Errorf("error generating new token: %v", err)
	}
	state, err := db.GetState(id)
	if err != nil {
		return "", "", "", []models.Guild{}, err
	}
	return id, newToken, username, state, nil
}

func (db *Database) FetchUserByPassword(username string, password string) (string, string, []models.Guild, error) {
	hashedPw := hashPassword(username, password)

	tx, err := db.db.Begin()
	if err != nil {
		return "", "", []models.Guild{}, fmt.Errorf("error starting transaction: %v", err)
	}
	defer tx.Rollback()

	query := `SELECT id FROM users WHERE username = $1 AND password = $2`
	var userId string
	err = tx.QueryRow(query, username, hashedPw).Scan(&userId)
	if err != nil {
		return "", "", []models.Guild{}, fmt.Errorf("error bad credentials: %v", err)
	}

	token, err := generateToken(userId, username)
	if err != nil {
		return "", "", []models.Guild{}, fmt.Errorf("error generating token: %v", err)
	}
	state, err := db.GetState(userId)
	if err != nil {
		return "", "", []models.Guild{}, err
	}
	return userId, token, state, nil
}

func (db *Database) GetState(userId string) ([]models.Guild, error) {
	state := []models.Guild{}
	tx, err := db.db.Begin()
	if err != nil {
		return state, fmt.Errorf("error starting transaction: %v", err)
	}
	defer tx.Rollback()
	guildsQuery := `SELECT guild_id FROM guild_users WHERE user_id = $1`
	guildIds, err := tx.Query(guildsQuery, userId)
	if err != nil {
		return state, fmt.Errorf("error fetching guildIds: %v", err)
	}
	var ids []string
	for guildIds.Next() {
		var guildId string
		err := guildIds.Scan(&guildId)
		if err != nil {
			return state, fmt.Errorf("error scanning guildId: %v", err)
		}
		ids = append(ids, guildId)
	}
	guildIds.Close()
	for _, id := range ids {
		guild, err := db.fetchGuildState(tx, id, userId)
		if err != nil {
			return state, err
		}
		state = append(state, guild)
	}
	return state, nil
}

func (db *Database) fetchGuildState(tx *sql.Tx, guildId string, userId string) (models.Guild, error) {
	var guild models.Guild
	query := `SELECT id, owner_id, name FROM guilds WHERE id = $1`
	row := tx.QueryRow(query, guildId)
	err := row.Scan(&guild.ID, &guild.OwnerId, &guild.Name)
	if err != nil {
		return guild, fmt.Errorf("error fetching guild info: %v", err)
	}
	usersQuery := `SELECT user_id FROM guild_users WHERE guild_id = $1`
	users, err := tx.Query(usersQuery, guildId)
	if err != nil {
		return guild, fmt.Errorf("error fetching guild member ids: %v", err)
	}
	var userIds []string
	for users.Next() {
		var currentUserId string
		if err := users.Scan(&currentUserId); err != nil {
			return guild, fmt.Errorf("error scanning user id: %v", err)
		}
		userIds = append(userIds, currentUserId)
	}
	users.Close()
	for _, userId := range userIds {
		var user models.User
		userInfo := tx.QueryRow(`SELECT id, username, email, logo FROM users WHERE id = $1`, userId)
		err = userInfo.Scan(&user.UserId, &user.Username, &user.Email, &user.Logo)
		if err != nil {
			return guild, fmt.Errorf("error scanning users: %v", err)
		}
		guild.Members = append(guild.Members, user)
	}

	channelsQuery := `SELECT id FROM channels WHERE guild_id = $1`
	channels, err := tx.Query(channelsQuery, guildId)
	if err != nil {
		return guild, fmt.Errorf("error fetching guild channels: %v", err)
	}
	var channelIds []string
	for channels.Next() {
		var channelId string
		if err := channels.Scan(&channelId); err != nil {
			return guild, fmt.Errorf("error scanning channel id: %v", err)
		}
		channelIds = append(channelIds, channelId)
	}
	channels.Close()
	for _, channelId := range channelIds {
		channel, err := db.fetchChannelState(tx, &guild, channelId)
		if err != nil {
			return guild, err
		}
		guild.Channels = append(guild.Channels, channel)
	}
	if guild.Channels == nil {
		guild.Channels = []models.Channel{}
	}
	return guild, nil
}

func (db *Database) fetchChannelState(tx *sql.Tx, guild *models.Guild, channelId string) (models.Channel, error) {
	var channel models.Channel
	chanInfo := tx.QueryRow(`SELECT * FROM channels WHERE id = $1`, channelId)
	if err := chanInfo.Scan(&channel.ChannelId, &channel.GuildId, &channel.Type, &channel.Name); err != nil {
		return channel, fmt.Errorf("error scanning channel: %v", err)
	}
	if channel.Type == "voice" {
		chanMembers := `SELECT user_id FROM channel_members WHERE channel_id = $1 AND guild_id = $2`
		memberIds, err := tx.Query(chanMembers, channel.ChannelId, guild.ID)
		if err != nil {
			return channel, fmt.Errorf("error querying channel members: %v", err)
		}
		defer memberIds.Close()
		for memberIds.Next() {
			var userId string
			if err := memberIds.Scan(&userId); err != nil {
				return channel, fmt.Errorf("error scanning channel members id: %v", err)
			}
			user, err := guild.GetMember(userId)
			if err != nil {
				return channel, err
			}
			channel.Members = append(channel.Members, user)
		}
		if channel.Members == nil {
			channel.Members = []models.User{}
		}
	} else {
		chanMessages := `SELECT * FROM messages WHERE channel_id = $1 AND guild_id = $2`
		messageResult, err := tx.Query(chanMessages, channelId, guild.ID)
		if err != nil {
			return channel, fmt.Errorf("error querying channel messages: %v", err)
		}
		defer messageResult.Close()
		for messageResult.Next() {
			var msg models.Message
			var senderId string
			err = messageResult.Scan(&msg.ID, &msg.GuildId, &msg.ChannelId, &senderId, &msg.Content, &msg.SendAt)
			if err != nil {
				return channel, fmt.Errorf("error scanning channel message: %v", err)
			}
			user, err := guild.GetMember(senderId)
			if err != nil {
				return channel, fmt.Errorf("error finding user in guild: %v", err)
			}
			msg.Sender = user
			channel.History = append(channel.History, msg)
		}
		if channel.History == nil {
			channel.History = []models.Message{}
		}
	}
	return channel, nil
}

func (db *Database) FetchUserInfo(userId string) (string, string, error) { // TODO : return avatar

	tx, err := db.db.Begin()
	if err != nil {
		return "", "", fmt.Errorf("error starting transaction: %v", err)
	}
	defer tx.Rollback()

	query := `SELECT username,email FROM users WHERE id = $1`
	var username, email string
	err = tx.QueryRow(query, userId).Scan(&username, &email)
	if err != nil {
		return "", "", fmt.Errorf("error finding user: %v", err)
	}

	return username, email, nil
}

func (db *Database) CreateGuild(id string, name string, ownerId string) error {
	tx, err := db.db.Begin()
	if err != nil {
		return fmt.Errorf("error starting transaction: %v", err)
	}
	defer tx.Rollback()
	insertGuild := `INSERT INTO guilds (id, owner_id, name) VALUES ($1, $2, $3)`
	_, err = tx.Exec(insertGuild, id, ownerId, name)
	if err != nil {
		return fmt.Errorf("error inserting guild: %v", err)
	}
	insertGuildMember := `INSERT INTO guild_users (guild_id, user_id) VALUES ($1, $2)`
	_, err = tx.Exec(insertGuildMember, id, ownerId)
	if err != nil {
		return fmt.Errorf("error inserting guild member: %v", err)
	}
	err = tx.Commit()
	if err != nil {
		return fmt.Errorf("error committing transaction: %v", err)
	}
	return nil
}

func (db *Database) DeleteGuild(id string, ownerId string) error {
	tx, err := db.db.Begin()
	if err != nil {
		return fmt.Errorf("error starting transaction: %v", err)
	}
	defer tx.Rollback()
	removeChanMembers := `DELETE FROM channel_members WHERE guild_id = $1`
	_, err = tx.Exec(removeChanMembers, id)
	if err != nil {
		return fmt.Errorf("error deleting channel members: %v", err)
	}
	removeChannels := `DELETE FROM channels WHERE guild_id = $1`
	_, err = tx.Exec(removeChannels, id)
	if err != nil {
		return fmt.Errorf("error deleting guild channels: %v", err)
	}
	removeUsers := `DELETE FROM guild_users WHERE guild_id = $1`
	_, err = tx.Exec(removeUsers, id)
	if err != nil {
		return fmt.Errorf("error deleting guild users: %v", err)
	}
	deleteGuild := `DELETE FROM guilds WHERE id = $1 and owner_id = $2`
	_, err = tx.Exec(deleteGuild, id, ownerId)
	if err != nil {
		return fmt.Errorf("error deleting guild: %v", err)
	}
	err = tx.Commit()
	if err != nil {
		return fmt.Errorf("error committing transaction: %v", err)
	}
	return nil
}

func (db *Database) JoinGuild(guildId string, userId string) error {
	tx, err := db.db.Begin()
	if err != nil {
		return fmt.Errorf("error starting transaction: %v", err)
	}
	defer tx.Rollback()
	joinGuild := `INSERT INTO guild_users (guild_id, user_id) VALUES ($1, $2)`
	_, err = tx.Exec(joinGuild, guildId, userId)
	if err != nil {
		return fmt.Errorf("error joining guild: %v", err)
	}
	err = tx.Commit()
	if err != nil {
		return fmt.Errorf("error committing transaction: %v", err)
	}
	return nil
}

func (db *Database) LeaveGuild(guildId string, userId string) error {
	tx, err := db.db.Begin()
	if err != nil {
		return fmt.Errorf("error starting transaction: %v", err)
	}
	defer tx.Rollback()
	leaveGuild := `DELETE FROM guild_users WHERE guild_id = $1 and user_id = $2`
	_, err = tx.Exec(leaveGuild, guildId, userId)
	if err != nil {
		return fmt.Errorf("error leaving guild: %v", err)
	}
	err = tx.Commit()
	if err != nil {
		return fmt.Errorf("error committing transaction: %v", err)
	}
	return nil
}

func (db *Database) CreateChannel(guildId string, channelId string, chanType string, name string) error {
	tx, err := db.db.Begin()
	if err != nil {
		return fmt.Errorf("error starting transaction: %v", err)
	}
	defer tx.Rollback()
	createChan := `INSERT INTO channels (id, guild_id, type, name) VALUES ($1, $2, $3, $4)`
	_, err = tx.Exec(createChan, channelId, guildId, chanType, name)
	if err != nil {
		return fmt.Errorf("error creating channel: %v", err)
	}
	err = tx.Commit()
	if err != nil {
		return fmt.Errorf("error committing transaction: %v", err)
	}
	return nil
}

func (db *Database) DeleteChannel(guildId string, channelId string) error {
	tx, err := db.db.Begin()
	if err != nil {
		return fmt.Errorf("error starting transaction: %v", err)
	}
	defer tx.Rollback()
	deleteChan := `DELETE FROM channels WHERE id = $1 and guild_id = $2`
	_, err = tx.Exec(deleteChan, channelId, guildId)
	if err != nil {
		return fmt.Errorf("error deleting channel: %v", err)
	}
	err = tx.Commit()
	if err != nil {
		return fmt.Errorf("error committing transaction: %v", err)
	}
	return nil
}

func (db *Database) JoinChannel(guildId string, channelId string, userId string) error {
	tx, err := db.db.Begin()
	if err != nil {
		return fmt.Errorf("error starting transaction: %v", err)
	}
	defer tx.Rollback()
	joinChannel := `INSERT INTO channel_members (channel_id, guild_id, user_id) VALUES ($1, $2, $3)`
	_, err = tx.Exec(joinChannel, channelId, guildId, userId)
	if err != nil {
		return fmt.Errorf("error joining channel: %v", err)
	}
	err = tx.Commit()
	if err != nil {
		return fmt.Errorf("error committing transaction: %v", err)
	}
	return nil
}

func (db *Database) LeaveChannel(guildId string, channelId string, userId string) error {
	tx, err := db.db.Begin()
	if err != nil {
		return fmt.Errorf("error starting transaction: %v", err)
	}
	defer tx.Rollback()
	leaveChannel := `DELETE FROM channel_members WHERE channel_id = $1 AND guild_id = $2 AND user_id = $3`
	_, err = tx.Exec(leaveChannel, channelId, guildId, userId)
	if err != nil {
		return fmt.Errorf("error leaving channel: %v", err)
	}
	err = tx.Commit()
	if err != nil {
		return fmt.Errorf("error committing transaction: %v", err)
	}
	return nil
}

func (db *Database) SaveMessage(messageId string, guildId string, channelId string, senderId string, content string, sendAt string) error {
	tx, err := db.db.Begin()
	if err != nil {
		return fmt.Errorf("error starting transaction: %v", err)
	}
	defer tx.Rollback()
	saveMessage := `INSERT INTO messages (id, guild_id, channel_id, sender_id, content , send_time) 
	VALUES ($1, $2, $3, $4, $5, TO_DATE($6, 'DD/MM/YYYY'))`
	_, err = tx.Exec(saveMessage, messageId, guildId, channelId, senderId, content, sendAt)
	if err != nil {
		return fmt.Errorf("error inserting message: %v", err)
	}
	err = tx.Commit()
	if err != nil {
		return fmt.Errorf("error committing transaction: %v", err)
	}
	return nil
}

func (db *Database) DeleteMessage(messageId string, guildId string, channelId string) error {
	tx, err := db.db.Begin()
	if err != nil {
		return fmt.Errorf("error starting transaction: %v", err)
	}
	defer tx.Rollback()
	deleteMessage := `DELETE FROM messages WHERE id = $1 AND guild_id = $2 AND channel_id = $3`
	_, err = tx.Exec(deleteMessage, messageId, guildId, channelId)
	if err != nil {
		return fmt.Errorf("error deleting message: %v", err)
	}
	err = tx.Commit()
	if err != nil {
		return fmt.Errorf("error committing transaction: %v", err)
	}
	return nil
}
