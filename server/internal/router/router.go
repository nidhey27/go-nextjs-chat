package router

import (
	"log"
	"server/internal/user"
	"server/internal/ws"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

var r *gin.Engine

func InitRouter(userHandler *user.Handler, wsHandler *ws.Handler) {
	r = gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST"},
		AllowHeaders:     []string{"Content-Type"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		AllowOriginFunc: func(origin string) bool {
			return origin == "http://localhost:3000"
		},
		MaxAge: 12 * time.Hour,
	}))

	r.POST("/sign-up", userHandler.CreateUser)
	r.POST("/log-in", userHandler.Login)
	r.GET("/log-out", userHandler.Logout)

	r.POST("/ws/create-room", wsHandler.CreateRoom)
	r.GET("/ws/join-room/:roomId", wsHandler.JoinRoom)
	r.GET("/ws/rooms", wsHandler.GetRooms)
	r.GET("/ws/clients/:roomId", wsHandler.GetClients)
}

func Start(addr string) error {
	log.Println(r)
	return r.Run(addr)
}
