// message.go
package main

import "encoding/json"

// Message struct for JSON serialization
type Message struct {
	ClientName string `json:"clientName"`
	Text       string `json:"text"`
}

// ToJSON converts Message to JSON format
func (m *Message) ToJSON() ([]byte, error) {
	return json.Marshal(m)
}

// FromJSON converts JSON to Message struct
func (m *Message) FromJSON(data []byte) error {
	return json.Unmarshal(data, m)
}
