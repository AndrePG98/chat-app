.Phony : run-httpServer run-wsServer run

run : run-httpServer run-wsServer

run-httpServer:
	cd httpServer && start cmd /c go run .

run-wsServer:
	cd wsServer && start cmd /c go run .