package main

import (
	uuid "github.com/google/uuid"
)

func CreateUser(username string, password string, email string) (bool, string) {
	// db operations here
	// return result and new client if if sucessful
	return true, uuid.NewString()
}

func FetchUser(id string) {
	//return user info for initial state and app init
}
