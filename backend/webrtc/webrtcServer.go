package main

import (
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

type WebRTCServer struct {
	SFUs           map[string]*SFU
	ConnectionChan chan *websocket.Conn
	NewSFU         chan *SFU
	RemoveSFU      chan string
}

func NewWebRTCServer() *WebRTCServer {
	return &WebRTCServer{
		SFUs:           make(map[string]*SFU),
		ConnectionChan: make(chan *websocket.Conn),
		NewSFU:         make(chan *SFU),
		RemoveSFU:      make(chan string),
	}

}

func (sv *WebRTCServer) Run() {

	go func() {
		for conn := range sv.ConnectionChan {
			p := &Participant{
				Connection: conn,
				Server:     sv,
			}
			go p.Listen()
		}
	}()

	go func() {
		for sfu := range sv.NewSFU {
			sv.SFUs[sfu.ChannelId] = sfu
		}
	}()

	go func() {
		for sfuId := range sv.RemoveSFU {
			delete(sv.SFUs, sfuId)
			log.Println("Deleted SFU")
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
		log.Println("Error upgrading connection:", err)
	}

	sv.ConnectionChan <- conn

}
