package httpserver

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

type Message struct {
	UserID    string `json:"userId"`
	ServerId  string `json:"serverId"`
	ChannelId string `json:"channelId"`
	Message   string `json:"message"`
}

type HttpServer struct {
}

func NewHttpServer() *HttpServer {
	return &HttpServer{}
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
	log.Println(userID)
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Connected!"))
}

func (server *HttpServer) Run() {

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

	router.HandleFunc("/connect", connect).Methods("GET")

	router.HandleFunc("/message", sendMessage).Methods("POST")

	handler := cors.Handler(router)

	log.Println("Http Server listenning on:", 8090)

	http.ListenAndServe(":8090", handler)
}
