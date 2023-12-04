package httpserver

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

type User struct {
	UserID string `json:"userId"`
}

type HttpServer struct {
}

func NewHttpServer() *HttpServer {
	return &HttpServer{}
}

func sendMessage(w http.ResponseWriter, req *http.Request) {
	log.Println(req.Body)
}

func connect(w http.ResponseWriter, req *http.Request) {
	var user User
	err := json.NewDecoder(req.Body).Decode(&user)
	if err != nil {
		log.Println(err)
		return
	}
	log.Println(user.UserID)
	w.Write([]byte("Connected"))
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

	router.HandleFunc("/connect", connect).Methods("POST")

	router.HandleFunc("/message", sendMessage).Methods("POST")

	handler := cors.Handler(router)

	log.Println("Http Server listenning on:", 8090)

	http.ListenAndServe(":8090", handler)
}
