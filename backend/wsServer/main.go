package main

import "log"

func main() {
	WsServer := NewWsServer()
	WsServer.run()
	log.Println("WS closing")
}
