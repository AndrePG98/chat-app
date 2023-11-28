// client.go
package main

import (
	"bufio"
	"fmt"
	"net"
	"os"
)

func sendMessage(conn net.Conn, message string, clientName string) {
	const separator = ","
	fullMessage := clientName + separator + message
	conn.Write([]byte(fullMessage))
}

func receiveMessage(conn net.Conn) {
	buffer := make([]byte, 1024)
	for {
		bytesRead, err := conn.Read(buffer)
		if err != nil {
			fmt.Println("Error reading:", err.Error())
			return
		}
		fmt.Printf("Received from %s: \n", string(buffer[:bytesRead]))
	}
}

func CreateClient(port string, clientName string) {
	conn, err := net.Dial("tcp", port)
	if err != nil {
		fmt.Println("Error connecting:", err.Error())
		os.Exit(1)
	}
	defer conn.Close()

	go receiveMessage(conn)

	scanner := bufio.NewScanner(os.Stdin)
	for {
		scanner.Scan()
		message := scanner.Text()
		sendMessage(conn, message, clientName)
	}
}
