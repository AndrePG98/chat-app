package main

import (
	"log"

	"github.com/gorilla/websocket"
	"github.com/mitchellh/mapstructure"
	"github.com/pion/webrtc/v3"
)

type Participant struct {
	UserId         string `json:"userId"`
	Server         *WebRTCServer
	CurrentChanel  *SFU
	Connection     *websocket.Conn
	PeerConnection *webrtc.PeerConnection
	LocalTrack     *webrtc.TrackLocalStaticRTP
}

func (p *Participant) Listen() {
	for {
		var msg map[string]interface{}
		err := p.Connection.ReadJSON(&msg)
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

			p.UserId = data.UserId

			sfu, exists := p.Server.SFUs[data.ChannelId]

			if exists {
				sfu.negotiate(p.Connection, offer, p)
			} else {
				sfu := NewSFU(p.Server, data.ChannelId, data.GuildId, offer, p)
				p.Server.NewSFU <- sfu
			}

		case "2":
			var candidate webrtc.ICECandidateInit
			mapstructure.Decode(msg["data"], &candidate)
			err := p.PeerConnection.AddICECandidate(candidate)
			if err != nil {
				log.Println("Error adding ice candidate:", err)
			}

		case "3":
			p.CurrentChanel.RemoveParticipants <- p.UserId
		}
	}
}
