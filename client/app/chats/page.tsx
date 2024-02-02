"use client"
import React, { useContext, useEffect, useState } from 'react'
import "./chat.css"
import ChatList from '@/components/people-list'
import ChatWindows from '@/components/chat-window'
import Participants from '@/components/participnts'
import { WebsocketContext } from '../context/ws'
import { getRooms as GetRooms } from '@/app/api/room'
import { ChatContext, Client } from '@/app/context/rooms';

export default function page() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [activeRoom, setActiveRoom] = useState(undefined)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { conn } = useContext(WebsocketContext)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { rooms, setRooms } = useContext(ChatContext)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [messages, setMessages] = useState([]);

    const getRooms = async () => {
        try {
            const resp = await GetRooms();
            const rooms = resp.data.map((room: any) => ({
                id: room.id,
                name: room.name,
                clients: Array<Client>(),
                active: false,
                messages: [],
            }));

            setRooms(rooms);


        } catch (error: any) {
            console.log(error);
            // Toast({
            //     message: error?.response?.data?.error?.toUpperCase() || error,
            //     type: "error",
            // });
        }
    };

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        getRooms();
    }, [])

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        if (activeRoom != undefined) {
            const r = rooms.find((r) => r.id === activeRoom?.id); // Use find instead of filter
            if (r) {
                setMessages(r.messages); // Update messages state with the messages of the room
            }
        }
        // console.log(rooms);

    }, [activeRoom, messages])

    return (
        <div className='flex items-center justify-center h-screen'>
            <div className='shadow w-4/5'>
                <div className='flex flex-row glass-card rounded-xl'>
                    <div className='w-2/5 border-r-2 border-[#ccc]'>
                        <ChatList rooms={rooms} setActiveRoom={setActiveRoom} />
                    </div>
                    <div className={`w-4/5 border-r-2 border-[#ccc] ${!activeRoom ? "flex items-center text-center" : ""} `}>

                        {activeRoom && conn ? <ChatWindows messages={messages} room={activeRoom} />
                            : <div className='w-full'>
                                <h1 className='italic font-bold text-xl text-center'>Please select a room to start chatting.</h1>
                            </div>}
                    </div>
                    <div className={`w-1/4 px-4 py-4 ${!activeRoom ? "flex items-center text-center" : ""}`}>
                        {activeRoom ? <Participants room={activeRoom} />
                            : <div className='w-full'>
                                <h1 className='italic font-bold text-xl text-center'>No Data</h1>
                            </div>}
                    </div>
                </div>
            </div>
        </div>
    )
}