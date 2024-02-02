"use client"
import React, { useState, createContext } from 'react'

interface Room {
    id: string
    name: string
    clients: Array<Client>
    active: boolean
    messages: Array<Message>
}

export interface Client {
    id: string
    roomId: string
    username: string
}

enum MessageType {
    self,
    other,
}

interface Message {
    content: string
    roomId: string
    username: string
    type: MessageType
}

export const ChatContext = createContext<{
    rooms: Array<Room>
    setRooms: (rooms: Array<Room>) => void
    addMessageToRoom: (roomId: string, message: Message) => void
    addUserToRoom: (roomId: string, user: Client) => void
    removeUserFromRoom: (roomId: string, user: Client) => void
}>({
    // [{ id: "", name: "", clients: new Map<string, Client>(), active: false, messages: [] }]
    rooms: [],
    setRooms: () => { },
    addMessageToRoom: () => { },
    addUserToRoom: () => { },
    removeUserFromRoom: () => { }
})


const ChatProvider = ({ children }: { children: React.ReactNode }) => {
    const [rooms, setRooms] = useState<Array<Room>>([])

    const addUserToRoom = (roomId: string, user: Client) => {
        const updated = rooms.map((room) => {
            if (room.id === roomId) {
                room.clients.push(user);
            }
            return room;
        })

        setRooms(updated);
    }

    const removeUserFromRoom = (roomId: string, user: Client) => {
        const updated = rooms.map((room) => {
            if (room.id === roomId) {
                // Filter out the user to be removed from the room's clients array
                room.clients = room.clients.filter((u) => u.id !== user.id);
            }
            return room;
        });

        setRooms(updated);
    };


    // Function to add a new message to a room
    const addMessageToRoom = (roomId: string, message: Message) => {
        const updated = rooms.map((room) => {
            // console.log("Room:", room.id);

            if (room.id === roomId) {
                // console.log("Adding Message:", room.id);
                // Push the new message to the messages array of the room
                room.messages.push(message);
            }
            return room;
        })

        setRooms(updated);
    };

    return (
        <ChatContext.Provider
            value={{
                rooms: rooms,
                setRooms: setRooms,
                addMessageToRoom: addMessageToRoom,
                addUserToRoom: addUserToRoom,
                removeUserFromRoom: removeUserFromRoom
            }}
        >
            {children}
        </ChatContext.Provider>
    )
}

export default ChatProvider