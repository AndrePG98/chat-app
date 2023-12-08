package httpserver

import (
	"backend/models"
	"context"
	"encoding/json"
	"log"
	"net/http"
	"sync"

	"github.com/gorilla/mux"
	"github.com/redis/go-redis/v9"
	"github.com/rs/cors"
)

type Message struct {
	UserID    string `json:"userId"`
	ServerId  string `json:"serverId"`
	ChannelId string `json:"channelId"`
	Message   string `json:"message"`
}

type HttpServer struct {
	redisClient *redis.Client
	ctx         context.Context
}

func NewHttpServer() *HttpServer {
	return &HttpServer{
		ctx: context.Background(),
	}
}

func (server *HttpServer) Run(wg *sync.WaitGroup) {
	defer wg.Done()

	server.redisClient = redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "",
		DB:       0,
	})

	pong, err := server.redisClient.Ping(server.ctx).Result()
	if err != nil {
		log.Println("Error connecting to Redis:", err)
		return
	}

	log.Println("Http connected to Redis:", pong)

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

	router.HandleFunc("/test", func(w http.ResponseWriter, r *http.Request) {
		server.SendMessageToWsServer()
	}).Methods("GET")

	router.HandleFunc("/connect", connect).Methods("GET")

	router.HandleFunc("/message", sendMessage).Methods("POST")

	handler := cors.Handler(router)

	log.Println("Http Server listenning on:", 8090)

	http.ListenAndServe(":8090", handler)
}

func (server *HttpServer) SendMessageToWsServer() {
	err := server.redisClient.Publish(server.ctx, "httpServer", "test").Err()
	if err != nil {
		log.Fatalln("Failed to publish message:", err)
	}
	log.Printf("sent message")
}

func sendMessage(w http.ResponseWriter, req *http.Request) {
	var message Message
	err := json.NewDecoder(req.Body).Decode(&message)
	if err != nil {
		log.Println(err)
	}
	log.Println(message.Message)
}

func connect(w http.ResponseWriter, req *http.Request) {
	userID := req.URL.Query().Get("id")
	log.Println("HttpServer -> Loggin Request done by:", req.RemoteAddr)
	// fetch user data from db
	connectResponse := models.Message{
		Type: 0,
		Body: models.InitialConnect{
			UserId:   userID,
			GuildIds: []string{"1"},
		},
	}
	jsonResponse, err := json.Marshal(connectResponse)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	} else {
		w.Header().Set("Content-type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(jsonResponse)
	}
}
