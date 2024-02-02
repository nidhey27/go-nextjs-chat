package ws

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

type Handler struct {
	hub *Hub
}

func NewHandler(h *Hub) *Handler {
	return &Handler{
		hub: h,
	}
}

type CreateRoomReq struct {
	Id   string `json:"id"`
	Name string `json:"name"`
}

func (h *Handler) CreateRoom(c *gin.Context) {
	var req CreateRoomReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	h.hub.Rooms[req.Id] = &Room{
		Id:      req.Id,
		Name:    req.Name,
		Clients: make(map[string]*Client),
	}

	c.JSON(http.StatusOK, req)
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		// origin := r.Header.Get("origin")
		// return origin == "http://localhost:3000"
		return true
	},
}

func (h *Handler) JoinRoom(c *gin.Context) {
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)

	if err != nil {
		// log.Println(err.Error())
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	roomId := c.Param("roomId")
	clientId := c.Query("userId")
	userName := c.Query("username")

	client := &Client{
		Conn:     conn,
		Message:  make(chan *Message, 10),
		Id:       clientId,
		RoomID:   roomId,
		Username: userName,
	}

	message := &Message{
		Content:  fmt.Sprintf("%s has joined the room.", userName),
		RoomID:   roomId,
		Username: userName,
	}

	// register this client
	h.hub.Register <- client

	// broadcast this message
	h.hub.Broadcast <- message

	go client.writeMessage()
	client.readMessage(h.hub)
}

type RoomRes struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

func (h *Handler) GetRooms(c *gin.Context) {
	rooms := make([]RoomRes, 0)

	for _, r := range h.hub.Rooms {
		rooms = append(rooms, RoomRes{
			ID:   r.Id,
			Name: r.Name,
		})
	}

	c.JSON(http.StatusOK, rooms)
}

type ClientRes struct {
	ID       string `json:"id"`
	Username string `json:"username"`
}

func (h *Handler) GetClients(c *gin.Context) {
	room := c.Param("roomId")
	clients := []ClientRes{}

	if _, ok := h.hub.Rooms[room]; !ok {
		c.JSON(http.StatusOK, clients)
	}

	for _, c := range h.hub.Rooms[room].Clients {
		clients = append(clients, ClientRes{
			ID:       c.RoomID,
			Username: c.Username,
		})
	}

	c.JSON(http.StatusOK, clients)
}
