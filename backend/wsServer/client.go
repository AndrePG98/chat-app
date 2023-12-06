package wsServer

import (
	"backend/models"
	"log"
	"slices"

	"github.com/gorilla/websocket"
)

type Client struct {
	ID     string
	Server *WsServer
	Conn   *websocket.Conn
	Guilds []string
	Send   chan models.Message
}

func NewClient(id string, server *WsServer, conn *websocket.Conn) *Client {
	return &Client{
		ID:     id,
		Server: server,
		Conn:   conn,
		Guilds: make([]string, 0),
		Send:   make(chan models.Message),
	}
}

func (client *Client) isMemberOfGuild(guildId string) bool {
	return slices.Contains(client.Guilds, guildId)
}

func (client *Client) Read() {

	defer func() {
		client.Conn.Close()
	}()

	var newMessage models.Message

	for {
		err := client.Conn.ReadJSON(&newMessage)
		if err != nil {
			log.Println(err)
			return
		}
		switch newMessage.Type {
		case 0:
			body, _ := newMessage.Body.(map[string]interface{})
			if guildIDs, ok := body["guildIds"].([]interface{}); ok {
				for _, id := range guildIDs {
					if guildID, ok := id.(string); ok {
						client.Guilds = append(client.Guilds, guildID)
					}
				}
			}
		case 1:
			if chatMessage, ok := newMessage.Body.(map[string]interface{}); ok {
				userId := chatMessage["userId"].(string)
				guildId := chatMessage["guildId"].(string)
				channelId := chatMessage["channelId"].(string)
				message := chatMessage["message"].(string)

				for _, user := range client.Server.Clients {
					if user.isMemberOfGuild(guildId) {
						go func(user *Client) {
							user.Send <- models.Message{
								Type: 1,
								Body: models.ChatMessage{
									UserId:    userId,
									GuildId:   guildId,
									ChannelId: channelId,
									Message:   message,
								},
							}
						}(user)
					}
				}
			}
		case 2:
		default:
			log.Println("Unknown message type")
		}
	}
}

func (client *Client) SendMessage() {
	for messageToSend := range client.Send {
		client.Conn.WriteJSON(messageToSend)
	}
}
