package main

import (
	httpserver "backend/httpServer"
	ws "backend/wsServer"

	"sync"
)

func main() {

	wg := new(sync.WaitGroup)
	wg.Add(2)
	wsServer := ws.NewWsServer()
	httpserver := httpserver.NewHttpServer()

	go httpserver.Run(wg)

	go wsServer.Run(wg)
	wg.Wait()
}
