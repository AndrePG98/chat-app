package main

import (
	"log"
	"wsServer/models"

	"github.com/google/uuid"
)

func CreateUser(username string, password string) (bool, string, string) {
	id := uuid.NewString()
	// check if uuid is unique
	//hashedPW := hashPassword(username, password)
	// db operations here
	// return result and new client if if sucessful
	token, _ := generateToken(id, username)
	return true, id, token
}

func FetchUserByToken(token string) (bool, string, string, string, []models.Guild) {
	newToken, id, username, err := refreshToken(token)
	if err != nil {
		log.Println("error refreshing token")
	}
	return true, id, newToken, username, []models.Guild{}
}

func FetchUserByPassword(username string, password string) (bool, string, string, []models.Guild) {
	// hashedPw, _ := hashPassword(username, password)
	// Search db for username
	// compore hashedPw with db hashedPw if true return user state
	id := uuid.NewString()

	token, _ := generateToken(id, username)
	return true, id, token, []models.Guild{}
	//return user info for initial state and app init
}

// Hardcoded State for testing
/* guild1 := models.Guild{
	ID:      "1",
	OwnerId: id,
	Name:    "Guild1",
	Members: []models.User{
		{
			UserId:   id,
			Username: username,
			Email:    "Some@Email",
			Logo:     "https://source.unsplash.com/random/150x150/?avatar",
		},
	},
	Channels: []models.Channel{
		{
			ID:      "1",
			GuildId: "1",
			Name:    "Channel1",
			Type:    "text",
			History: []models.Message{
				{
					Sender: models.User{
						UserId:   id,
						Username: username,
						Email:    "Some@Email",
						Logo:     "https://source.unsplash.com/random/150x150/?avatar",
					},
					GuildId:   "1",
					ChannelId: "1",
					Content:   "Test Message",
					SendAt:    time.Now().Format("02/01/2006"),
				},
			},
		},
	},
} */
