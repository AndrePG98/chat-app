import { useRef } from "react"


const useWebRTC = () => {

    const pcRef = useRef<RTCPeerConnection | null>(null)
    const rtcSockerRef = useRef<WebSocket | null>(null)

    const connectToRTCServer = (userId: string, channelId: string, guildId: string) => {

        const socket = new WebSocket(`ws://127.0.0.1:7070/rtc`)
        const config = {
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        }
        const peerConnection = new RTCPeerConnection(config)

        socket.onopen = async () => {

            let audio = document.createElement("audio")

            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true
            })

            for (const track of stream.getTracks()) {
                peerConnection.addTrack(track, stream)
            }

            peerConnection.ontrack = ({ track, streams }) => {
                track.onunmute = () => {
                    audio.srcObject = streams[0]
                    document.body.appendChild(audio)
                    audio.play()

                }
            }

            peerConnection.onconnectionstatechange = () => {
                console.log(peerConnection.connectionState)
                if (peerConnection.connectionState === "disconnected") {
                    peerConnection.getSenders().forEach((sender) => {
                        sender.track?.stop()
                    })
                }
            }


            peerConnection.onicecandidate = (event) => {
                if (event.candidate) {
                    const msg = { type: "2", data: event.candidate.toJSON() }
                    socket.send(JSON.stringify(msg))
                }
            }

            peerConnection.oniceconnectionstatechange = () => {
                console.log(peerConnection.iceConnectionState)
                if (peerConnection.iceConnectionState === 'disconnected') {
                    peerConnection.close();
                }
            };

            const offerOptions = {
                offerToReceiveAudio: true,
                offerToReceiveVideo: false,
                voiceActivityDetection: true,
                iceRestart: true,
                audioCodecSettings: {
                    opus: {
                        maxaveragebitrate: 164000,
                    },
                },
            }

            const offer = await peerConnection.createOffer(offerOptions)

            await peerConnection.setLocalDescription(offer)

            const message = { type: "1", offer: offer.sdp, channelId, guildId, userId }
            socket.send(JSON.stringify(message))

            pcRef.current = peerConnection
            rtcSockerRef.current = socket

        }


        socket.onmessage = (event) => {
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

    const disconnectRTC = () => {
        const message = { type: "3" }
        rtcSockerRef.current?.send(JSON.stringify(message))
        rtcSockerRef.current = null
        pcRef.current = null
    }

    return { connectToRTCServer, disconnectRTC }
}

export default useWebRTC