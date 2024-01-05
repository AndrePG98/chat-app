package main

import (
	"github.com/gorilla/websocket"
	"github.com/pion/webrtc/v3"
)

type Participant struct {
	UserId         string `json:"userId"`
	Connection     *websocket.Conn
	PeerConnection *webrtc.PeerConnection
	LocalTrack     *webrtc.TrackLocalStaticRTP
}
