import { useRef } from "react"


const useWebRTC = () => {

    const connectToRTCServer = (userId: string, channelId: string, guildId: string) => {
        const socket = new WebSocket(`ws://127.0.0.1:7070/rtc`)
        const config = {
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        }

        const peerConnection = new RTCPeerConnection(config)

        socket.onopen = async () => {


            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true
            })

            for (const track of stream.getTracks()) {
                peerConnection.addTrack(track, stream)
            }

            peerConnection.onicecandidate = (event) => {
                if (event.candidate) {
                    const msg = { type: "2", data: event.candidate.toJSON() }
                    socket.send(JSON.stringify(msg))
                }
            }

            peerConnection.ontrack = ({ track, streams }) => {
                track.onunmute = () => {
                }
            }

            const offerOptions = {
                offerToReceiveAudio: true,
                offerToReceiveVideo: false,
                voiceActivityDetection: true,
                iceRestart: true,
                audioCodecSettings: {
                    opus: {
                        maxaveragebitrate: 64000,
                    },
                },
            }

            const offer = await peerConnection.createOffer(offerOptions)

            await peerConnection.setLocalDescription(offer)

            const message = { type: "1", offer: offer.sdp, channelId, guildId, userId }
            socket.send(JSON.stringify(message))

        }


        socket.onmessage = (event) => {
            // type "1" == answer
            // type "2" == ice candidate
            const msg = JSON.parse(event.data)
            switch (msg.Type) {
                case "1":
                    const sessionDrscp = new RTCSessionDescription({
                        type: "answer",
                        sdp: msg.Data
                    })
                    peerConnection.setRemoteDescription(sessionDrscp)
                    break
                case "2":
                    const data = JSON.parse(msg.Data)
                    const candidate = new RTCIceCandidate(data)
                    peerConnection.addIceCandidate(candidate)
                    break
            }
        }

    }

    return { connectToRTCServer }
}

export default useWebRTC
