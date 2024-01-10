import { useRef, useState } from "react"

export interface Controls {
    toggleMute: () => boolean
    toggleDeafen: () => boolean
}


const useWebRTC = () => {

    const pcRef = useRef<RTCPeerConnection | null>(null)
    const rtcSockerRef = useRef<WebSocket | null>(null)
    let audio = document.createElement("audio")
    const [controls, setControls] = useState<Controls>({
        toggleMute: () => false,
        toggleDeafen: () => false
    });

    const connectToRTC = (userId: string, channelId: string, guildId: string) => {

        const socket = new WebSocket(import.meta.env.VITE_RTC)
        const config = {
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        }
        const peerConnection = new RTCPeerConnection(config)

        socket.onopen = async () => {

            const savedInputDevice = localStorage.getItem('selectedInputDevice');
            const savedOutputDevice = localStorage.getItem('selectedOutputDevice');

            var stream: MediaStream
            if (savedInputDevice) {
                stream = await navigator.mediaDevices.getUserMedia({
                    audio: {
                        deviceId: {
                            exact: savedInputDevice
                        }
                    }
                })

            } else {
                stream = await navigator.mediaDevices.getUserMedia({
                    audio: true
                })

            }

            const localtrack = stream.getTracks()[0]


            peerConnection.addTrack(localtrack, stream)

            peerConnection.ontrack = ({ track, streams }) => {
                setControls({
                    toggleMute: () => {
                        localtrack.enabled = !localtrack.enabled
                        return !localtrack.enabled
                    },
                    toggleDeafen: () => {
                        track.enabled = !track.enabled
                        return !track.enabled
                    }
                })
                track.onunmute = async () => {
                    document.body.appendChild(audio);
                    audio.srcObject = streams[0];
                    await (audio as any).setSinkId(savedOutputDevice)
                    audio.play();

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
        audio.remove()
    }

    return { connectToRTC, disconnectRTC, controls }
}

export default useWebRTC
