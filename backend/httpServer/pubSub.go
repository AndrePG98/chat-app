package main

import (
	"context"
	"log"
	"time"

	"github.com/redis/go-redis/v9"
)

type RedisClient struct {
	client  *redis.Client
	ctx     context.Context
	channel string
}

func NewRedisClient() *RedisClient {
	client := redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "",
		DB:       0,
	})

	_, err := client.Ping(context.Background()).Result()
	if err != nil {
		log.Fatalln("Error creating httpServer redis client:", err)
	}

	return &RedisClient{
		client:  client,
		ctx:     context.Background(),
		channel: "httpServer_wsServer_connection",
	}
}

func (client *RedisClient) sendMessage(message string) {
	timeOutCtx, ctxCancel := context.WithTimeout(client.ctx, 5000*time.Millisecond)
	defer ctxCancel()
	client.client.Publish(timeOutCtx, client.channel, message)
}
