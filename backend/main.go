package main

import httpserver "backend/httpServer"

func main() {
	httpserver := httpserver.NewHttpServer()

	httpserver.Run()
}
