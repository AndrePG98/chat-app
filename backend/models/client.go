package models

import (
	"fmt"
	"log"

	"github.com/gorilla/websocket"
)

type Client struct {
	ID     string
	Conn   *websocket.Conn
	Server *Guild
}

func (client *Client) Read() {

	defer func() {
		client.Server.Unsubscribe <- client
		client.Conn.Close()
	}()

	var newMessage Data

	for {
		err := client.Conn.ReadJSON(&newMessage)
		if err != nil {
			log.Println(err)
			return
		}

		fmt.Printf("Message Received:%+v\n", newMessage)
	}
}
