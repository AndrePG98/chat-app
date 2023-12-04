package httpserver

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

type HttpServer struct {
}

func NewHttpServer() *HttpServer {
	return &HttpServer{}
}

func sendMessage(w http.ResponseWriter, req *http.Request) {
	log.Println(req.Body)
}

func connect(w http.ResponseWriter, req *http.Request) {
	//fetch database data.
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

	http.ListenAndServe(":8090", handler)
}
