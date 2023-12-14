package main

import (
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"
)

func hashPassword(username string, password string) string {

	saltedPassword := fmt.Sprintf("%s%s", password, username)

	hash := sha256.New()
	hash.Write([]byte(saltedPassword))
	hashedPassword := hex.EncodeToString(hash.Sum(nil))

	return hashedPassword
}

func generateToken(userId string, username string) (string, error) {
	claims := jwt.MapClaims{
		"userId":   userId,
		"username": username,
		"exp":      jwt.NewNumericDate(time.Now().AddDate(0, 0, 7)),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(getEnvKey())
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func refreshToken(oldToken string) (string, string, string, error) {
	claims, err := verifyToken(oldToken)
	if err != nil {
		log.Println("error validating token")
	}
	id, _ := claims["userId"].(string)
	username, _ := claims["username"].(string)
	newToken, err := generateToken(id, username)
	if err != nil {
		log.Println("error generating new token")
	}
	return newToken, id, username, nil
}

func verifyToken(tokenString string) (jwt.MapClaims, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Check the signing method
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		// Return the signing key used to validate the token
		return getEnvKey(), nil
	})
	if err != nil {
		return nil, err
	}

	if !token.Valid {
		return nil, fmt.Errorf("token is invalid")
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return nil, fmt.Errorf("couldn't parse claims")
	}

	id, _ := claims["userId"].(string)
	username, _ := claims["username"].(string)
	log.Printf("Verifying %v with id: %v", username, id)
	return claims, nil
}

func getEnvKey() []byte {
	if err := loadEnvVariables(); err != nil {
		log.Println(err)
	}
	key := os.Getenv("KEY")
	if key == "" {
		log.Fatal("JWT_SECRET environment variable is not set")
	}
	return []byte(key)
}

func loadEnvVariables() error {
	err := godotenv.Load(".env")
	if err != nil {
		return fmt.Errorf("error loading .env file: %w", err)
	}
	return nil
}
