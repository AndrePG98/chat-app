package main

import (
	"bufio"
	"fmt"
	"net"
	"os"
	"sync"
)

type Peer struct {
	name       string
	conn       net.Conn
	reader     *bufio.Reader
	writer     *bufio.Writer
	incoming   chan string
	outgoing   chan string
	shutdown   chan struct{}
	shutdownWG *sync.WaitGroup
}

func NewPeer(name string, conn net.Conn, shutdownWG *sync.WaitGroup) *Peer {
	return &Peer{
		name:       name,
		conn:       conn,
		reader:     bufio.NewReader(conn),
		writer:     bufio.NewWriter(conn),
		incoming:   make(chan string),
		outgoing:   make(chan string),
		shutdown:   make(chan struct{}),
		shutdownWG: shutdownWG,
	}
}

func (p *Peer) ReadMessages() {
	defer p.shutdownWG.Done()
	for {
		select {
		case <-p.shutdown:
			return
		default:
			message, err := p.reader.ReadString('\n')
			if err != nil {
				fmt.Printf("%s disconnected\n", p.name)
				close(p.incoming)
				return
			}
			p.incoming <- message
		}
	}
}

func (p *Peer) SendMessage(message string) {
	p.outgoing <- message
}

func (p *Peer) handleOutgoing() {
	for {
		select {
		case <-p.shutdown:
			return
		case message := <-p.outgoing:
			p.writer.WriteString(message)
			p.writer.Flush()
		}
	}
}

func peer() {

	fmt.Print("Enter your name: ")
	scanner := bufio.NewScanner(os.Stdin)
	scanner.Scan()
	name := scanner.Text()

	ln, err := net.Listen("tcp", ":0")
	if err != nil {
		fmt.Println("Error listening:", err.Error())
		os.Exit(1)
	}
	defer ln.Close()

	fmt.Printf("Your address: %s\n", ln.Addr())

	peers := make(map[string]*Peer)
	var wg sync.WaitGroup

	go func() {
		for {
			fmt.Print("Enter message: ")
			scanner.Scan()
			message := scanner.Text()

			if message == "exit" {
				for _, peer := range peers {
					close(peer.incoming)
					close(peer.shutdown)
				}
				wg.Wait()
				os.Exit(0)
			}

			for _, peer := range peers {
				peer.SendMessage(message)
			}
		}
	}()

	for {
		conn, err := ln.Accept()
		if err != nil {
			fmt.Println("Error accepting:", err.Error())
			continue
		}

		shutdownWG := &sync.WaitGroup{}
		shutdownWG.Add(1)

		peer := NewPeer(name, conn, shutdownWG)
		peers[peer.conn.RemoteAddr().String()] = peer

		wg.Add(1)
		go peer.ReadMessages()

		go peer.handleOutgoing()

		go func(peer *Peer) {
			for msg := range peer.incoming {
				fmt.Printf("[%s] %s", peer.name, msg)
			}
		}(peer)
	}

}
