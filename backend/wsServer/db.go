package main

import (
	"database/sql"
	"fmt"
	"log"
	"wsServer/models"

	_ "github.com/lib/pq"

	"github.com/google/uuid"
)

type Database struct {
	db *sql.DB
}

func NewDatabase() *Database {
	return &Database{}
}

func (db *Database) Connect() {
	connStr := "postgres://postgres:chatapp@localhost:5432/Chatapp?sslmode=disable"
	conn, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}

	err = conn.Ping()
	if err != nil {
		log.Fatal("Error connecting to the database:", err)
	}

	conn.SetMaxIdleConns(10)
	conn.SetMaxOpenConns(100)
	db.db = conn
	fmt.Println("Connected to Database")

}

func (db *Database) Disconnect() {
	db.db.Close()
}

func (db *Database) CreateUser(username string, password string, email string) (string, string, error) {
	id := uuid.NewString()
	hashedPW := hashPassword(username, password)

	tx, err := db.db.Begin()
	if err != nil {
		return "", "", fmt.Errorf("error starting transaction: %v", err)
	}
	defer tx.Rollback()

	selectQuery := `SELECT COUNT(*) FROM users WHERE email = $1`
	var count int
	row := tx.QueryRow(selectQuery, email)
	err = row.Scan(&count)
	if err != nil {
		return "", "", fmt.Errorf("error checking emails: %v", err)
	}
	if count > 0 {
		return "", "", fmt.Errorf("error email already in use: %v", email)
	}

	insertQuery := `INSERT INTO users (id, username, email, avatar, password) VALUES ($1, $2, $3, $4, $5)`
	_, err = tx.Exec(insertQuery, id, username, email, []byte{}, hashedPW)
	if err != nil {
		return "", "", fmt.Errorf("error executing query: %v", err)
	}

	if err = tx.Commit(); err != nil {
		return "", "", fmt.Errorf("error committing transaction: %v", err)
	}

	token, err := generateToken(id, username)
	if err != nil {
		return "", "", fmt.Errorf("error generating token: %v", err)
	}

	return id, token, nil
}

func FetchUserByToken(token string) (bool, string, string, string, []models.Guild) {
	newToken, id, username, err := refreshToken(token)
	if err != nil {
		log.Println("error refreshing token")
	}
	return true, id, newToken, username, []models.Guild{}
}

func FetchUserByPassword(username string, password string) (bool, string, string, []models.Guild) {
	// hashedPw, _ := hashPassword(username, password)
	// Search db for username
	// compore hashedPw with db hashedPw if true return user state
	id := uuid.NewString()

	token, _ := generateToken(id, username)
	return true, id, token, []models.Guild{}
	//return user info for initial state and app init
}

func CreateGuild() {}

func DeleteGuild() {}

func JoinGuild() {}

func LeaveGuild() {}

func CreateChannel() {}

func DeleteChannel() {}

func JoinChannel() {}

func LeaveChannel() {}

func SaveMessage() {}

func DeleteMessage() {}
