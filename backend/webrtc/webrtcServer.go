package main

import (
	"log"
	"net/http"

	"github.com/gorilla/websocket"
	"github.com/mitchellh/mapstructure"
	"github.com/pion/webrtc/v3"
)

type WebRTCServer struct {
	ConnectionChan chan *websocket.Conn
	SFUs           map[string]*SFU
	NewSFU         chan *SFU
}

func NewWebRTCServer() *WebRTCServer {
	return &WebRTCServer{
		ConnectionChan: make(chan *websocket.Conn),
		SFUs:           make(map[string]*SFU),
		NewSFU:         make(chan *SFU),
	}

}

func (sv *WebRTCServer) Run() {

	go func() {
		for sfu := range sv.NewSFU {
			sv.SFUs[sfu.ChannelId] = sfu
		}
	}()

	http.HandleFunc("/rtc", func(w http.ResponseWriter, r *http.Request) {
		sv.serveRTC(w, r)
	})

	http.ListenAndServe(":7070", nil)
}

func (sv *WebRTCServer) serveRTC(w http.ResponseWriter, r *http.Request) {
	var upgrader = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		panic(err)
	}

	go sv.establishSFU(conn)
}

func (sv *WebRTCServer) establishSFU(connection *websocket.Conn) {
loop:
	for {
		var msg map[string]interface{}
		err := connection.ReadJSON(&msg)
		if err != nil {
			log.Println("Error reading message:", err)
			return
		}
		msgType, _ := msg["type"].(string)
		switch msgType {
		case "1":
			var data struct {
				ChannelId string `json:"channelId"`
				GuildId   string `json:"guildId"`
				UserId    string `json:"userId"`
				Offer     string `json:"offer"`
			}
			mapstructure.Decode(msg, &data)
			offer := webrtc.SessionDescription{
				Type: webrtc.SDPTypeOffer,
				SDP:  data.Offer,
			}

			sfu, exists := sv.SFUs[data.ChannelId]
			if exists {
				sfu.negotiate(connection, offer, &Participant{
					UserId:     data.UserId,
					Connection: connection,
				})
			} else {
				sfu := NewSFU(data.ChannelId, data.GuildId, offer, &Participant{
					UserId:     data.UserId,
					Connection: connection,
				})
				sv.NewSFU <- sfu
			}
			break loop
		}
	}

}
