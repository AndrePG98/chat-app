/* package websocket

import (
	"net/http"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func (guild *Guild) ServeWS(w http.ResponseWriter, r *http.Request) error {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		return err
	}

	client := &Client{Conn: ws, Server: guild}

	go func() {
		guild.Subscribe <- client
	}()

	go client.Read()

	return nil
}
*/