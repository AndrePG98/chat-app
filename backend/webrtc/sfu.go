package main

import (
	"encoding/json"
	"fmt"
	"log"

	"github.com/gorilla/websocket"
	"github.com/pion/webrtc/v3"
)

type SFU struct {
	ChannelId          string
	GuildId            string
	Participants       map[string]*Participant
	RemoveParticipants chan string
}

func NewSFU(sv *WebRTCServer, channelId, guildId string, offer webrtc.SessionDescription, participant *Participant) *SFU {

	sfu := &SFU{
		ChannelId: channelId,
		GuildId:   guildId,

		Participants:       make(map[string]*Participant),
		RemoveParticipants: make(chan string),
	}

	sfu.negotiate(participant.Connection, offer, participant)

	go func() {
		for participantId := range sfu.RemoveParticipants {
			p, exists := sfu.Participants[participantId]
			if exists {
				senders := p.PeerConnection.GetSenders()
				for _, sender := range senders {
					p.PeerConnection.RemoveTrack(sender)
				}
				p.PeerConnection.Close()
				p.Connection.Close()
				delete(sfu.Participants, participantId)
				log.Println(len(sfu.Participants))
				if len(sfu.Participants) == 0 {

					sv.RemoveSFU <- sfu.ChannelId
				}
			}
		}
	}()

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
		log.Println("Error creating peer connection:", err)
	}

	conn.OnConnectionStateChange(func(pcs webrtc.PeerConnectionState) {
		log.Println("Peer Connection:", conn.ConnectionState(), "", p.UserId)
		if conn.ConnectionState() == webrtc.PeerConnectionStateConnected {
			sfu.Participants[p.UserId] = p
		}
	})

	conn.OnICEConnectionStateChange(func(is webrtc.ICEConnectionState) {
		log.Println("Ice:", is.String(), " ", p.UserId)
	})

	localTrack, newTrackErr := webrtc.NewTrackLocalStaticRTP(webrtc.RTPCodecCapability{MimeType: webrtc.MimeTypeOpus}, "audio", "pion")
	if newTrackErr != nil {
		log.Println("Error creating track:", err)
	}
	p.LocalTrack = localTrack

	rtpSender, err := conn.AddTrack(localTrack)
	if err != nil {
		log.Println("Error adding track:", err)
	}

	go func() {
		rtcpBuf := make([]byte, 1500)
		for {
			if _, _, rtcpErr := rtpSender.Read(rtcpBuf); rtcpErr != nil {
				log.Println("Error reading sender:", err)
				return
			}
		}
	}()

	conn.OnTrack(func(tr *webrtc.TrackRemote, r *webrtc.RTPReceiver) {
		fmt.Printf("Track has started, of type %d: %s \n", tr.PayloadType(), tr.Codec().MimeType)

		for {
			rtp, _, readErr := tr.ReadRTP()
			if readErr != nil {
				log.Println("Error reading rtp:", err)
				return
			}

			go func() {
				for id, participant := range sfu.Participants {
					if id != p.UserId && participant.LocalTrack != nil {
						writeErr := participant.LocalTrack.WriteRTP(rtp)
						if writeErr != nil {
							log.Println("Error writing to track:", err)
						}
					}

				}
			}()

		}
	})

	conn.OnICECandidate(func(i *webrtc.ICECandidate) {
		if i != nil {
			candidate, err := json.Marshal(i.ToJSON())
			if err != nil {
				log.Println("Error marshalling candidate:", err)
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
		log.Println("Error setting remote description:", err)
	}

	answer, err := conn.CreateAnswer(nil)
	if err != nil {
		log.Println("Error creating answer:", err)
	}

	err = conn.SetLocalDescription(answer)
	if err != nil {
		log.Println("Error setting local description:", err)
	}

	p.PeerConnection = conn
	p.CurrentChanel = sfu

	msg := struct {
		Type string
		Data string
	}{
		Type: "1",
		Data: answer.SDP,
	}

	wsConn.WriteJSON(msg)

}
