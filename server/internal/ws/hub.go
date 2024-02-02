package ws

import (
	"fmt"
)

type Room struct {
	Id      string             `json:"id"`
	Name    string             `json:"name"`
	Clients map[string]*Client `json:"clients"`
}

type Hub struct {
	Rooms      map[string]*Room
	Register   chan *Client
	UnRegister chan *Client
	Broadcast  chan *Message
}

func NewHub() *Hub {
	return &Hub{
		Rooms:      make(map[string]*Room),
		Register:   make(chan *Client),
		UnRegister: make(chan *Client),
		Broadcast:  make(chan *Message, 1),
	}
}

func (h *Hub) Run() {
	for {
		select {
		case client := <-h.Register:
			if _, ok := h.Rooms[client.RoomID]; ok {
				r := h.Rooms[client.RoomID]
				if _, ok := r.Clients[client.Id]; !ok {
					r.Clients[client.Id] = client
				}
			}
		case client := <-h.UnRegister:
			// log.Printf("%v is disconncted.", client.Id)
			if _, ok := h.Rooms[client.RoomID]; ok {
				// log.Println("Room ID", client.RoomID)
				if _, ok := h.Rooms[client.RoomID].Clients[client.Id]; ok {
					// log.Println("Client ID", client.Id)
					// broadcast message that client has left the room
					if len(h.Rooms[client.RoomID].Clients) != 0 {
						// log.Println("Client in Room", len(h.Rooms[client.RoomID].Clients))
						h.Broadcast <- &Message{
							RoomID:   client.RoomID,
							Content:  fmt.Sprintf("%s has lft the room.", h.Rooms[client.RoomID].Clients[client.Id].Username),
							Username: getFirstClient(h.Rooms[client.RoomID].Clients),
						}
						// fmt.Println(Message{
						// 	RoomID:   client.RoomID,
						// 	Content:  fmt.Sprintf("%s has lft the room.", h.Rooms[client.RoomID].Clients[client.Id].Username),
						// 	Username: getFirstClient(h.Rooms[client.RoomID].Clients),
						// })
					}
					delete(h.Rooms[client.RoomID].Clients, client.Id)
					close(client.Message)
				}
			}
		case message := <-h.Broadcast:
			if _, ok := h.Rooms[message.RoomID]; ok {
				for _, cl := range h.Rooms[message.RoomID].Clients {
					cl.Message <- message
				}
			}
		}
	}
}

func getFirstClient(clients map[string]*Client) string {
	for _, client := range clients {
		return client.Username
	}

	return ""
}
