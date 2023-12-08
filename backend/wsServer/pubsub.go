package main

import (
	"context"
	"log"

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
		log.Fatalln("Error creating WsServer redis client:", err)
	}

	return &RedisClient{
		client:  client,
		ctx:     context.Background(),
		channel: "httpServer_wsServer_connection",
	}
}

func (redisClient *RedisClient) listen() {
	sub := redisClient.client.Subscribe(redisClient.ctx, redisClient.channel)
	defer sub.Close()
	ch := sub.Channel()
	for msg := range ch {
		log.Println(msg.Payload)
	}
}
