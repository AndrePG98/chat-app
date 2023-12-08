package main

import (
	"context"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

type HttpServer struct {
	ctx         context.Context
	redisClient *RedisClient
	handler     *http.Handler
}

func NewHttpServer() *HttpServer {

	httpServer := HttpServer{
		ctx:         context.Background(),
		redisClient: NewRedisClient(),
	}
	handler := setUpHandler(&httpServer)
	httpServer.handler = handler

	return &httpServer
}

func (server *HttpServer) run() {
	log.Println(" Http Server listenning on", 8090)
	http.ListenAndServe(":8090", *server.handler)
}

func setUpHandler(server *HttpServer) *http.Handler {
	router := mux.NewRouter()

	cors := cors.New(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedMethods: []string{
			http.MethodPost,
			http.MethodGet,
		},
		AllowedHeaders:   []string{"*"},
		AllowCredentials: false,
	})

	addRoutes(router, server)

	handler := cors.Handler(router)
	return &handler

}

func addRoutes(router *mux.Router, server *HttpServer) {

	router.HandleFunc("/connect", func(w http.ResponseWriter, r *http.Request) {
		server.Connect(w, r)
	})
	router.HandleFunc("/message", func(w http.ResponseWriter, r *http.Request) {
		server.SendMessage(w, r)
	})
}
