package main

import (
	"log"
	"server/internal/db"
	"server/internal/router"
	"server/internal/user"
	"server/internal/ws"
)

func main() {
	dbConn, err := db.NewDatabase()
	if err != nil {
		log.Println(err)
	}
	log.Println("Connected to DB..🛢️")

	userRep := user.NewRepository(dbConn.GetDB())
	userSvc := user.NewService(userRep)
	userHandler := user.NewHandler(userSvc)

	hub := ws.NewHub()
	wsHandler := ws.NewHandler(hub)
	go hub.Run()

	router.InitRouter(userHandler, wsHandler)
	err = router.Start(":8080")

	if err != nil {
		log.Println(err)
	}
}
