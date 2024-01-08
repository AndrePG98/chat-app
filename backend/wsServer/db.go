package main

import (
	"database/sql"
	"encoding/base64"
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

	selectQuery := `SELECT COUNT(*) FROM users WHERE username = $1 OR email = $2`
	var count int
	row := tx.QueryRow(selectQuery, username, email)
	err = row.Scan(&count)
	if err != nil {
		return "", "", fmt.Errorf("error checking credentials: %v", err)
	}
	if count > 0 {
		return "", "", fmt.Errorf("email/username already in use: %v", email)
	}

	insertQuery := `INSERT INTO users (id, username, email, logo, password, ismuted, isdeafen) VALUES ($1, $2, $3, $4, $5, $6, $7)`
	_, err = tx.Exec(insertQuery, id, username, email, []byte{}, hashedPW, false, false)
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

func (db *Database) FetchUserByToken(token string) (string, string, string, []byte, bool, bool, string, []models.Guild, []models.Invite, error) {
	claims, err := verifyToken(token)
	if err != nil {
		return "", "", "", nil, false, false, "", nil, nil, fmt.Errorf("error verifying token: %v", err)
	}
	id, _ := claims["userId"].(string)
	username, _ := claims["username"].(string)
	tx, err := db.db.Begin()
	if err != nil {
		return "", "", "", nil, false, false, "", nil, nil, fmt.Errorf("error starting transaction: %v", err)
	}
	defer tx.Rollback()
	query := `SELECT email,logo, ismuted, isdeafen  FROM users WHERE id = $1 AND username = $2`
	var email string
	var logo []byte
	var ismuted, isdeafen bool
	err = tx.QueryRow(query, id, username).Scan(&email, &logo, &ismuted, &isdeafen)
	if err != nil {
		return "", "", "", nil, false, false, "", nil, nil, fmt.Errorf("error bad credentials: %v", err)
	}

	newToken, err := generateToken(id, username)
	if err != nil {
		return "", "", "", nil, false, false, "", nil, nil, fmt.Errorf("error generating new token: %v", err)
	}

	invitesQuery := `SELECT invites.id, invites.guild_id, TO_CHAR(invites.send_at, 'DD/MM/YYYY') AS formatted_date, invites.guild_name ,users.id, users.username, users.logo FROM invites JOIN users ON invites.sender_id = users.id WHERE receiver_id = $1`
	inviteResults, err := tx.Query(invitesQuery, id)
	if err != nil {
		return "", "", "", nil, false, false, "", nil, nil, fmt.Errorf("error fetching invites: %v", err)
	}
	var invites []models.Invite
	for inviteResults.Next() {
		var invite models.Invite
		var sender models.User
		var logo []byte
		if err := inviteResults.Scan(&invite.Id, &invite.GuildId, &invite.SendAt, &invite.GuildName, &sender.UserId, &sender.Username, &logo); err != nil {
			return "", "", "", nil, false, false, "", nil, nil, fmt.Errorf("error scanning invites: %v", err)
		}
		base64Image := "data:image/jpeg;base64," + base64.StdEncoding.EncodeToString(logo)
		sender.Logo = base64Image
		invite.Sender = sender
		invite.ReceiverId = id
		invites = append(invites, invite)
	}

	state, err := db.GetState(id)
	if err != nil {
		return "", "", "", nil, false, false, "", nil, nil, err
	}
	return id, username, email, logo, ismuted, isdeafen, newToken, state, invites, nil
}

func (db *Database) FetchUserByPassword(username string, password string) (string, string, []byte, bool, bool, string, []models.Guild, []models.Invite, error) {
	hashedPw := hashPassword(username, password)

	tx, err := db.db.Begin()
	if err != nil {
		return "", "", nil, false, false, "", nil, nil, fmt.Errorf("error starting transaction: %v", err)
	}
	defer tx.Rollback()

	query := `SELECT id, email, logo, ismuted, isdeafen FROM users WHERE username = $1 AND password = $2`
	var userId, email string
	var logo []byte
	var ismuted, isdeafen bool
	err = tx.QueryRow(query, username, hashedPw).Scan(&userId, &email, &logo, &ismuted, &isdeafen)
	if err != nil {
		return "", "", nil, false, false, "", nil, nil, fmt.Errorf("error bad credentials: %v", err)
	}

	token, err := generateToken(userId, username)
	if err != nil {
		return "", "", nil, false, false, "", nil, nil, fmt.Errorf("error generating token: %v", err)
	}

	invitesQuery := `SELECT invites.id, invites.guild_id, TO_CHAR(invites.send_at, 'DD/MM/YYYY') AS formatted_date, invites.guild_name, users.id, users.username, users.logo FROM invites JOIN users ON invites.sender_id = users.id WHERE receiver_id = $1`
	inviteResults, err := tx.Query(invitesQuery, userId)
	if err != nil {
		return "", "", nil, false, false, "", nil, nil, fmt.Errorf("error fetching invites: %v", err)
	}
	var invites []models.Invite
	for inviteResults.Next() {
		var invite models.Invite
		var sender models.User
		var logo []byte
		if err := inviteResults.Scan(&invite.Id, &invite.GuildId, &invite.SendAt, &invite.GuildName, &sender.UserId, &sender.Username, &logo); err != nil {
			return "", "", nil, false, false, "", nil, nil, fmt.Errorf("error scanning invites: %v", err)
		}
		base64Image := "data:image/jpeg;base64," + base64.StdEncoding.EncodeToString(logo)
		sender.Logo = base64Image
		invite.Sender = sender
		invite.ReceiverId = userId
		invites = append(invites, invite)
	}
	state, err := db.GetState(userId)
	if err != nil {
		return "", "", nil, false, false, "", nil, nil, err
	}
	return userId, email, logo, ismuted, isdeafen, token, state, invites, nil
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
		guild, err := db.fetchGuildState(tx, id)
		if err != nil {
			return state, err
		}
		state = append(state, guild)
	}
	return state, nil
}

func (db *Database) fetchGuildState(tx *sql.Tx, guildId string) (models.Guild, error) {
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
		var logo []byte
		userInfo := tx.QueryRow(`SELECT id, username, email, logo, ismuted, isdeafen FROM users WHERE id = $1`, userId)
		err = userInfo.Scan(&user.UserId, &user.Username, &user.Email, &logo, &user.IsMuted, &user.IsDeafen)
		base64Image := "data:image/jpeg;base64," + base64.StdEncoding.EncodeToString(logo)
		user.Logo = base64Image
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
		chanMessages := `SELECT id, guild_id, channel_id, sender_id, content, TO_CHAR(send_time, 'DD/MM/YYYY') AS formatted_date FROM messages WHERE channel_id = $1 AND guild_id = $2`
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

func (db *Database) FetchUsers(searchTerm string, limit, offset int) ([]models.User, bool, error) {
	hasMore := false
	searchTerm = "%" + searchTerm + "%"
	fetchQuery := `SELECT id, username, logo FROM users WHERE username LIKE $1 ORDER BY id LIMIT $2 OFFSET $3`
	rows, err := db.db.Query(fetchQuery, searchTerm, limit, offset)
	if err != nil {
		return nil, hasMore, fmt.Errorf("error fetching users: %v", err)
	}

	var users []models.User
	for rows.Next() {
		var u models.User
		var logo []byte
		if err := rows.Scan(&u.UserId, &u.Username, &logo); err != nil {
			return nil, hasMore, fmt.Errorf("error scanning user: %v", err)
		}
		u.Logo = "data:image/jpeg;base64," + base64.StdEncoding.EncodeToString(logo)
		users = append(users, u)
	}

	countQuery := `SELECT COUNT(*) FROM users WHERE username LIKE $1`
	var count int
	err = db.db.QueryRow(countQuery, searchTerm).Scan(&count)
	if err != nil {
		return nil, hasMore, fmt.Errorf("errro getting users count: %v", err)
	}
	if offset+limit < count {
		hasMore = true
	}
	return users, hasMore, nil
}

func (db *Database) FetchUserInfo(userId string) (string, string, []byte, bool, bool, error) { // TODO : return avatar

	tx, err := db.db.Begin()
	if err != nil {
		return "", "", nil, false, false, fmt.Errorf("error starting transaction: %v", err)
	}
	defer tx.Rollback()

	query := `SELECT username,email,logo,ismuted,isdeafen FROM users WHERE id = $1`
	var username, email string
	var logo []byte
	var ismuted, isdeafen bool
	err = tx.QueryRow(query, userId).Scan(&username, &email, &logo, &ismuted, &isdeafen)
	if err != nil {
		return "", "", nil, false, false, fmt.Errorf("error finding user: %v", err)
	}

	return username, email, logo, ismuted, isdeafen, nil
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

func (db *Database) DeleteGuild(id string, ownerId string) ([]string, error) {
	tx, err := db.db.Begin()
	if err != nil {
		return nil, fmt.Errorf("error starting transaction: %v", err)
	}
	defer tx.Rollback()
	rows, err := tx.Query(`SELECT user_id from guild_users WHERE guild_id = $1`, id)
	if err != nil {
		return nil, fmt.Errorf("error fetching guild users: %v", err)
	}
	var userIds []string
	for rows.Next() {
		var userId string
		err = rows.Scan(&userId)
		if err != nil {
			return nil, fmt.Errorf("error scanning user id: %v", err)
		}
		userIds = append(userIds, userId)
	}
	rows.Close()
	removeMessages := `DELETE FROM messages WHERE guild_id = $1`
	_, err = tx.Exec(removeMessages, id)
	if err != nil {
		return nil, fmt.Errorf("error deleting guild messages: %v", err)
	}
	removeChanMembers := `DELETE FROM channel_members WHERE guild_id = $1`
	_, err = tx.Exec(removeChanMembers, id)
	if err != nil {
		return nil, fmt.Errorf("error deleting channel members: %v", err)
	}
	removeChannels := `DELETE FROM channels WHERE guild_id = $1`
	_, err = tx.Exec(removeChannels, id)
	if err != nil {
		return nil, fmt.Errorf("error deleting guild channels: %v", err)
	}
	removeUsers := `DELETE FROM guild_users WHERE guild_id = $1`
	_, err = tx.Exec(removeUsers, id)
	if err != nil {
		return nil, fmt.Errorf("error deleting guild users: %v", err)
	}
	deleteGuild := `DELETE FROM guilds WHERE id = $1 and owner_id = $2`
	_, err = tx.Exec(deleteGuild, id, ownerId)
	if err != nil {
		return nil, fmt.Errorf("error deleting guild: %v", err)
	}
	err = tx.Commit()
	if err != nil {
		return nil, fmt.Errorf("error committing transaction: %v", err)
	}
	return userIds, nil
}

func (db *Database) JoinGuild(guildId string, userId string) ([]string, *models.Guild, error) {
	tx, err := db.db.Begin()
	if err != nil {
		return nil, nil, fmt.Errorf("error starting transaction: %v", err)
	}
	guild, err := db.fetchGuildState(tx, guildId)
	if err != nil {
		return nil, nil, err
	}

	joinGuild := `INSERT INTO guild_users (guild_id, user_id) VALUES ($1, $2)`
	_, err = tx.Exec(joinGuild, guildId, userId)
	if err != nil {
		return nil, nil, fmt.Errorf("error joining guild: %v", err)
	}
	err = tx.Commit()
	if err != nil {
		return nil, nil, fmt.Errorf("error committing transaction: %v", err)
	}
	return guild.GetMemberIds(), &guild, nil
}

func (db *Database) LeaveGuild(guildId string, userId string) ([]string, error) {
	tx, err := db.db.Begin()
	if err != nil {
		return nil, fmt.Errorf("error starting transaction: %v", err)
	}
	defer tx.Rollback()
	rows, err := tx.Query(`SELECT user_id from guild_users WHERE guild_id = $1`, guildId)
	if err != nil {
		return nil, fmt.Errorf("error fetching guild users: %v", err)
	}
	var userIds []string
	for rows.Next() {
		var userId string
		err = rows.Scan(&userId)
		if err != nil {
			return nil, fmt.Errorf("error scanning user id: %v", err)
		}
		userIds = append(userIds, userId)
	}
	rows.Close()
	leaveGuild := `DELETE FROM guild_users WHERE guild_id = $1 and user_id = $2`
	_, err = tx.Exec(leaveGuild, guildId, userId)
	if err != nil {
		return nil, fmt.Errorf("error leaving guild: %v", err)
	}
	err = tx.Commit()
	if err != nil {
		return nil, fmt.Errorf("error committing transaction: %v", err)
	}
	return userIds, nil
}

func (db *Database) CreateChannel(guildId string, channelId string, chanType string, name string) ([]string, error) {
	tx, err := db.db.Begin()
	if err != nil {
		return nil, fmt.Errorf("error starting transaction: %v", err)
	}
	defer tx.Rollback()
	rows, err := tx.Query(`SELECT user_id from guild_users WHERE guild_id = $1`, guildId)
	if err != nil {
		return nil, fmt.Errorf("error fetching guild users: %v", err)
	}
	var userIds []string
	for rows.Next() {
		var userId string
		err = rows.Scan(&userId)
		if err != nil {
			return nil, fmt.Errorf("error scanning user id: %v", err)
		}
		userIds = append(userIds, userId)
	}
	rows.Close()
	createChan := `INSERT INTO channels (id, guild_id, type, name) VALUES ($1, $2, $3, $4)`
	_, err = tx.Exec(createChan, channelId, guildId, chanType, name)
	if err != nil {
		return nil, fmt.Errorf("error creating channel: %v", err)
	}
	err = tx.Commit()
	if err != nil {
		return nil, fmt.Errorf("error committing transaction: %v", err)
	}
	return userIds, nil
}

func (db *Database) DeleteChannel(guildId string, channelId string) ([]string, error) {
	tx, err := db.db.Begin()
	if err != nil {
		return nil, fmt.Errorf("error starting transaction: %v", err)
	}
	defer tx.Rollback()
	rows, err := tx.Query(`SELECT user_id from guild_users WHERE guild_id = $1`, guildId)
	if err != nil {
		return nil, fmt.Errorf("error fetching guild users: %v", err)
	}
	var userIds []string
	for rows.Next() {
		var userId string
		err = rows.Scan(&userId)
		if err != nil {
			return nil, fmt.Errorf("error scanning user id: %v", err)
		}
		userIds = append(userIds, userId)
	}
	rows.Close()

	deleteMessages := `DELETE FROM messages WHERE guild_id = $1 AND channel_id = $2`
	_, err = tx.Exec(deleteMessages, guildId, channelId)
	if err != nil {
		return nil, fmt.Errorf("error deleting messages: %v", err)
	}

	deleteChan := `DELETE FROM channels WHERE id = $1 and guild_id = $2`
	_, err = tx.Exec(deleteChan, channelId, guildId)
	if err != nil {
		return nil, fmt.Errorf("error deleting channel: %v", err)
	}

	err = tx.Commit()
	if err != nil {
		return nil, fmt.Errorf("error committing transaction: %v", err)
	}
	return userIds, nil
}

func (db *Database) JoinChannel(guildId string, channelId string, userId string) ([]string, error) {
	tx, err := db.db.Begin()
	if err != nil {
		return nil, fmt.Errorf("error starting transaction: %v", err)
	}
	defer tx.Rollback()
	rows, err := tx.Query(`SELECT user_id from guild_users WHERE guild_id = $1`, guildId)
	if err != nil {
		return nil, fmt.Errorf("error fetching guild users: %v", err)
	}
	var userIds []string
	for rows.Next() {
		var userId string
		err = rows.Scan(&userId)
		if err != nil {
			return nil, fmt.Errorf("error scanning user id: %v", err)
		}
		userIds = append(userIds, userId)
	}
	rows.Close()
	joinChannel := `INSERT INTO channel_members (channel_id, guild_id, user_id) VALUES ($1, $2, $3)`
	_, err = tx.Exec(joinChannel, channelId, guildId, userId)
	if err != nil {
		return nil, fmt.Errorf("error joining channel: %v", err)
	}
	err = tx.Commit()
	if err != nil {
		return nil, fmt.Errorf("error committing transaction: %v", err)
	}
	return userIds, nil
}

func (db *Database) LeaveChannel(guildId string, channelId string, userId string) ([]string, error) {
	tx, err := db.db.Begin()
	if err != nil {
		return nil, fmt.Errorf("error starting transaction: %v", err)
	}
	defer tx.Rollback()
	rows, err := tx.Query(`SELECT user_id from guild_users WHERE guild_id = $1`, guildId)
	if err != nil {
		return nil, fmt.Errorf("error fetching guild users: %v", err)
	}
	var userIds []string
	for rows.Next() {
		var userId string
		err = rows.Scan(&userId)
		if err != nil {
			return nil, fmt.Errorf("error scanning user id: %v", err)
		}
		userIds = append(userIds, userId)
	}
	rows.Close()
	leaveChannel := `DELETE FROM channel_members WHERE channel_id = $1 AND guild_id = $2 AND user_id = $3`
	_, err = tx.Exec(leaveChannel, channelId, guildId, userId)
	if err != nil {
		return nil, fmt.Errorf("error leaving channel: %v", err)
	}
	err = tx.Commit()
	if err != nil {
		return nil, fmt.Errorf("error committing transaction: %v", err)
	}
	return userIds, nil
}

func (db *Database) SaveMessage(messageId string, guildId string, channelId string, senderId string, content string, sendAt string) ([]string, error) {
	tx, err := db.db.Begin()
	if err != nil {
		return nil, fmt.Errorf("error starting transaction: %v", err)
	}
	defer tx.Rollback()
	rows, err := tx.Query(`SELECT user_id from guild_users WHERE guild_id = $1`, guildId)
	if err != nil {
		return nil, fmt.Errorf("error fetching guild users: %v", err)
	}
	var userIds []string
	for rows.Next() {
		var userId string
		err = rows.Scan(&userId)
		if err != nil {
			return nil, fmt.Errorf("error scanning user id: %v", err)
		}
		userIds = append(userIds, userId)
	}
	rows.Close()
	saveMessage := `INSERT INTO messages (id, guild_id, channel_id, sender_id, content , send_time) 
	VALUES ($1, $2, $3, $4, $5, TO_DATE($6, 'DD/MM/YYYY'))`
	_, err = tx.Exec(saveMessage, messageId, guildId, channelId, senderId, content, sendAt)
	if err != nil {
		return nil, fmt.Errorf("error inserting message: %v", err)
	}
	err = tx.Commit()
	if err != nil {
		return nil, fmt.Errorf("error committing transaction: %v", err)
	}
	return userIds, nil
}

func (db *Database) DeleteMessage(messageId string, guildId string, channelId string) ([]string, error) {
	tx, err := db.db.Begin()
	if err != nil {
		return nil, fmt.Errorf("error starting transaction: %v", err)
	}
	defer tx.Rollback()
	rows, err := tx.Query(`SELECT user_id from guild_users WHERE guild_id = $1`, guildId)
	if err != nil {
		return nil, fmt.Errorf("error fetching guild users: %v", err)
	}
	var userIds []string
	for rows.Next() {
		var userId string
		err = rows.Scan(&userId)
		if err != nil {
			return nil, fmt.Errorf("error scanning user id: %v", err)
		}
		userIds = append(userIds, userId)
	}
	rows.Close()
	deleteMessage := `DELETE FROM messages WHERE id = $1 AND guild_id = $2 AND channel_id = $3`
	_, err = tx.Exec(deleteMessage, messageId, guildId, channelId)
	if err != nil {
		return nil, fmt.Errorf("error deleting message: %v", err)
	}
	err = tx.Commit()
	if err != nil {
		return nil, fmt.Errorf("error committing transaction: %v", err)
	}
	return userIds, nil
}

func (db *Database) GetCurrentUserChannel(userId string) (string, string, error) {
	tx, err := db.db.Begin()
	if err != nil {
		return "", "", fmt.Errorf("error starting transaction: %v", err)
	}
	defer tx.Rollback()
	selectChannelMemberInfo := `SELECT channel_id, guild_id FROM channel_members WHERE user_id = $1`
	var channelId, guildId string
	err = tx.QueryRow(selectChannelMemberInfo, userId).Scan(&channelId, &guildId)
	if err != nil {
		return "", "", fmt.Errorf("error selecting channel member info: %v", err)
	}
	deleteChannelMember := `DELETE FROM channel_members WHERE user_id = $1`
	_, err = tx.Exec(deleteChannelMember, userId)
	if err != nil {
		return "", "", fmt.Errorf("error deleting channel member: %v", err)
	}
	err = tx.Commit()
	if err != nil {
		return "", "", fmt.Errorf("error comitting transaction: %v", err)
	}
	return channelId, guildId, nil
}

func (db *Database) UploadLogo(image []byte, userId string, guildIds []string) ([]string, error) {
	tx, err := db.db.Begin()
	if err != nil {
		return nil, fmt.Errorf("error starting transaction: %v", err)
	}
	defer tx.Rollback()
	var userIds []string
	for _, guildId := range guildIds {
		rows, err := tx.Query(`SELECT user_id from guild_users WHERE guild_id = $1`, guildId)
		if err != nil {
			return nil, fmt.Errorf("error fetching guild users: %v", err)
		}
		for rows.Next() {
			var userId string
			err = rows.Scan(&userId)
			if err != nil {
				return nil, fmt.Errorf("error scanning user id: %v", err)
			}
			userIds = append(userIds, userId)
		}
		rows.Close()

	}
	query := `UPDATE users SET logo = $1 WHERE id = $2`
	_, err = tx.Exec(query, image, userId)
	if err != nil {
		return nil, fmt.Errorf("error updating user logo: %v", err)
	}
	err = tx.Commit()
	if err != nil {
		return nil, fmt.Errorf("error comitting transaction: %v", err)
	}
	return userIds, nil
}

func (db *Database) ToggleMute(userId string, guildId string) (bool, []string, error) {
	tx, err := db.db.Begin()
	if err != nil {
		return false, nil, fmt.Errorf("error starting transaction: %v", err)
	}
	defer tx.Rollback()

	var userIds []string
	rows, err := tx.Query(`SELECT user_id from guild_users WHERE guild_id = $1`, guildId)
	if err != nil {
		return false, nil, fmt.Errorf("error fetching guild users: %v", err)
	}
	for rows.Next() {
		var userId string
		err = rows.Scan(&userId)
		if err != nil {
			return false, nil, fmt.Errorf("error scanning user id: %v", err)
		}
		userIds = append(userIds, userId)
	}
	rows.Close()

	query := `WITH updated AS (
		UPDATE users
		SET ismuted = NOT ismuted
		WHERE id = $1
		RETURNING ismuted
	 )
	 SELECT ismuted FROM updated;`

	var ismuted bool
	err = tx.QueryRow(query, userId).Scan(&ismuted)
	if err != nil {
		return false, nil, fmt.Errorf("error updating user is muted: %v", err)
	}

	err = tx.Commit()
	if err != nil {
		return false, nil, fmt.Errorf("error comitting transaction: %v", err)
	}
	return ismuted, userIds, nil
}

func (db *Database) ToggleDeafen(userId string, guildId string) (bool, []string, error) {
	tx, err := db.db.Begin()
	if err != nil {
		return false, nil, fmt.Errorf("error starting transaction: %v", err)
	}
	defer tx.Rollback()

	var userIds []string
	rows, err := tx.Query(`SELECT user_id from guild_users WHERE guild_id = $1`, guildId)
	if err != nil {
		return false, nil, fmt.Errorf("error fetching guild users: %v", err)
	}
	for rows.Next() {
		var userId string
		err = rows.Scan(&userId)
		if err != nil {
			return false, nil, fmt.Errorf("error scanning user id: %v", err)
		}
		userIds = append(userIds, userId)
	}
	rows.Close()

	query := `WITH updated AS (
		UPDATE users
		SET isdeafen = NOT isdeafen
		WHERE id = $1
		RETURNING isdeafen
	 )
	 SELECT isdeafen FROM updated;`

	var isdeafen bool
	err = tx.QueryRow(query, userId).Scan(&isdeafen)
	if err != nil {
		return false, nil, fmt.Errorf("error updating user is deafen: %v", err)
	}

	err = tx.Commit()
	if err != nil {
		return false, nil, fmt.Errorf("error comitting transaction: %v", err)
	}
	return isdeafen, userIds, nil
}

func (db *Database) SaveInvitation(id string, msg models.InviteEvent) error {
	tx, err := db.db.Begin()
	if err != nil {
		return fmt.Errorf("error starting transaction: %v", err)
	}
	defer tx.Rollback()
	saveInvite := `INSERT INTO invites (id, sender_id, receiver_id, guild_id, send_at, guild_name) 
	VALUES ($1, $2, $3, $4, TO_DATE($5, 'DD/MM/YYYY'), $6)`
	_, err = tx.Exec(saveInvite, id, msg.Sender.UserId, msg.ReceiverId, msg.GuildId, msg.SendAt, msg.GuildName)
	if err != nil {
		return fmt.Errorf("error inserting invite: %v", err)
	}
	err = tx.Commit()
	if err != nil {
		return fmt.Errorf("error committing transaction: %v", err)
	}
	return nil
}
