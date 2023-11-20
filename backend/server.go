package main

import (
	"fmt"
	"net"
	"os"
)

var clients = make(map[net.Addr]net.Conn)

func handleConnection(conn net.Conn) {
	defer conn.Close()

	clientAddr := conn.RemoteAddr()
	clients[clientAddr] = conn

	buffer := make([]byte, 1024)
	for {
		bytesRead, err := conn.Read(buffer)
		if err != nil {
			fmt.Println("Error reading:", err.Error())
			break
		}

		message := string(buffer[:bytesRead])
		fmt.Printf("Received message from %s: %s\n", clientAddr, message)

		for addr, client := range clients {
			if addr != clientAddr {
				fmt.Printf("Relaying message to %s\n", addr)
				client.Write([]byte(message))
			}
		}
	}
}

func StartListener(hostPort string) {
	listener, e := net.Listen("tcp", hostPort)
	if e != nil {
		print(e.Error())
		os.Exit(1)
	}
	fmt.Println("Listening on port ", hostPort)

	for {
		conn, e := listener.Accept()
		if e != nil {
			print(e.Error())
			continue
		}
		go handleConnection(conn)
	}
}
