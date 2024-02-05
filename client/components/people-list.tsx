"use client"
import React, { useContext, useEffect, useState } from 'react';
import ChatCard from "@/components/chat-card";
import Modal from '../components/modal';
import Toast from "../components/toast";

import { WebsocketContext } from '@/app/context/ws';
import { UserContext } from '@/app/context/user';
import { ChatContext } from '@/app/context/rooms';

export default function PeopleList({ rooms, setActiveRoom }: { rooms: any, setActiveRoom: any }) {
    const { user } = useContext(UserContext)
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { setRooms } = useContext(ChatContext)

    const { conn, setConn } = useContext(WebsocketContext);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handelClick = (id: string) => {
        for (let i = 0; i < rooms.length; i++) {
            if (rooms[i].id == id && rooms[i].active) {
                return
            }
        }

        if (conn) {
            conn.close();
        }
        // const updatedRooms = rooms.map((room: any) => ({
        //     ...room,
        //     active: room.id == id
        // }));

        const updatedRooms: any = [];
        for (let i = 0; i < rooms.length; i++) {
            const room = rooms[i];
            
            const modifiedRoom = {
                id: room.id,
                name: room.name,
                clients: room.clients ? room.clients : [],
                active: room.id == id,
                messages: room.messages ? room.messages : [],
            };

            updatedRooms.push(modifiedRoom);
        }

        setRooms(updatedRooms);

        const r = updatedRooms.find((room: any) => {
            return room.id == id && room.active
        })
        setActiveRoom(r);

        const ws = new WebSocket(
            `${process.env.NEXT_PUBLIC_WS_URL}/ws/join-room/${id}?userId=${sessionStorage.getItem("id")}&username=${sessionStorage.getItem("username")}`
        );

        ws.onopen = () => {
            setConn(ws);
        };
    };

    useEffect(() => {
        // Close the WebSocket connection when the component unmounts
        return () => {
            if (conn) {
                conn.close();
            }
        };
    }, [conn]);

    return (
        <>
            <Modal isOpen={isModalOpen} onClose={closeModal} />
            <div className='px-4 py-4 '>
                <div className='flex flex-row justify-between items-center'>
                    <h1 className='text-2xl'>Mes discussions</h1>
                    <button onClick={openModal} className='bg-dark-secondary hover:bg-dark-primary text-white font-bold py-1 px-4 rounded-full'>Add</button>
                </div>

                <div className='flex flex-col mt-4 overflow-y-auto ' id="rooms-list" style={{ height: "420px", maxHeight: "420px" }}>
                    {rooms.map((room: any) => {
                        return <div key={room.name}>
                            <ChatCard id={room.id} handelClick={handelClick} name={room.name} message={room.id} active={room.active} />
                        </div>
                    })}
                </div>
                <div className='flex flex-row justify-between items-center pt-5  border-t-2 border-[#ccc]'>
                    <h1 className='text-sm'>Welcome <span className='font-bold text-xl'>{user.username}</span></h1>
                    <button className='bg-dark-secondary hover:bg-dark-primary text-xs text-white font-bold py-1 px-4 rounded-full'>Logout</button>
                </div>
            </div>
        </>
    );
}
