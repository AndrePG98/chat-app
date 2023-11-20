// serverInitializer.go
package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
	"sync"
)

var clientCounterMutex sync.Mutex

func main() {
	reader := bufio.NewReader(os.Stdin)

	currentPort := 8080

	for {
		fmt.Print("Enter something: ")

		input, err := reader.ReadString('\n')
		if err != nil {
			fmt.Println("Error reading input:", err)
			break
		}

		// Trim any leading or trailing whitespace from the input
		input = strings.TrimSpace(input)

		// Compare the input with a specific string
		if strings.HasPrefix(input, "create server") {
			StartListener(":" + strconv.Itoa(currentPort)) // Correct way to concatenate and convert int to string
		} else if strings.HasPrefix(input, "create client") {
			clientName := strings.TrimPrefix(input, "create client ")
			clientCounterMutex.Lock()
			CreateClient(":"+strconv.Itoa(currentPort), clientName)
		}
	}
}
