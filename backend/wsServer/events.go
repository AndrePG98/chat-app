package main

type AuthRequest struct {
	Result bool
	Client *Client
}

type Event interface {
	getType() int
	getBody() interface{}
}

type RegisterEvent struct {
	Type int `default:"0"`
}
