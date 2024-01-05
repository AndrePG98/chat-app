package main

import (
	"encoding/json"
	"log"

	"github.com/gorilla/websocket"
	"github.com/mitchellh/mapstructure"
	"github.com/pion/webrtc/v3"
)

type SFU struct {
	ChannelId    string
	GuildId      string
	Participants map[string]*Participant
}

func NewSFU(channelId, guildId string, offer webrtc.SessionDescription, participant *Participant) *SFU {

	participants := make(map[string]*Participant)
	participants[participant.UserId] = participant

	sfu := &SFU{
		ChannelId:    channelId,
		GuildId:      guildId,
		Participants: participants,
	}

	sfu.negotiate(participant.Connection, offer, participant)

	return sfu
}

func (sfu *SFU) negotiate(wsConn *websocket.Conn, offer webrtc.SessionDescription, p *Participant) {
	config := webrtc.Configuration{
		ICEServers: []webrtc.ICEServer{
			{
				URLs: []string{"stun:stun.l.google.com:19302"},
			},
		},
	}

	conn, err := webrtc.NewPeerConnection(config)
	if err != nil {
		panic(err)
	}

	go func() {
		for {
			var msg map[string]interface{}
			err := p.Connection.ReadJSON(&msg)
			if err != nil {
				panic(err)
			}
			msgType, _ := msg["type"].(string)
			switch msgType {
			case "2":
				var candidate webrtc.ICECandidateInit
				mapstructure.Decode(msg["data"], &candidate)
				err := conn.AddICECandidate(candidate)
				if err != nil {
					panic(err)
				}
			}
		}
	}()

	conn.OnConnectionStateChange(func(pcs webrtc.PeerConnectionState) {
		log.Println(conn.ConnectionState())
	})

	conn.OnICEConnectionStateChange(func(is webrtc.ICEConnectionState) {
		log.Println(is.String())
	})

	conn.OnTrack(func(tr *webrtc.TrackRemote, r *webrtc.RTPReceiver) {

		localTrack, newTrackErr := webrtc.NewTrackLocalStaticRTP(tr.Codec().RTPCodecCapability, "audio", "pion")
		if newTrackErr != nil {
			panic(newTrackErr)
		}
		p.LocalTrack = localTrack

		rtpSender, err := conn.AddTrack(localTrack)
		if err != nil {
			panic(err)
		}

		go func() {
			rtcpBuf := make([]byte, 1500)
			for {
				if _, _, rtcpErr := rtpSender.Read(rtcpBuf); rtcpErr != nil {
					return
				}
			}
		}()

		for {

			rtp, _, readErr := tr.ReadRTP()
			if readErr != nil {
				panic(err)
			}

			go func() {
				for _, p := range sfu.Participants {
					writeErr := p.LocalTrack.WriteRTP(rtp)
					if writeErr != nil {
						panic(writeErr)
					}

				}
			}()

		}
	})

	conn.OnICECandidate(func(i *webrtc.ICECandidate) {
		if i != nil {
			candidate, err := json.Marshal(i.ToJSON())
			if err != nil {
				panic(err)
			}
			msg := struct {
				Type string
				Data string
			}{
				Type: "2",
				Data: string(candidate),
			}
			wsConn.WriteJSON(msg)
		}
	})

	err = conn.SetRemoteDescription(offer)
	if err != nil {
		panic(err)
	}

	answer, err := conn.CreateAnswer(nil)
	if err != nil {
		panic(err)
	}

	err = conn.SetLocalDescription(answer)
	if err != nil {
		panic(err)
	}

	msg := struct {
		Type string
		Data string
	}{
		Type: "1",
		Data: answer.SDP,
	}

	wsConn.WriteJSON(msg)

	p.PeerConnection = conn

}
