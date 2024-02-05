"use client"
import { ChatContext } from '@/app/context/rooms';
import React, { useContext, useEffect, useState } from 'react'

export default function Participants({ room }: { room: any }) {
    const [users, setUsers] = useState([])
    const { rooms } = useContext(ChatContext)
    const randomHex = () => {
        const r = Math.floor(Math.random() * 256); // Random red component
        const g = Math.floor(Math.random() * 256); // Random green component
        const b = Math.floor(Math.random() * 256); // Random blue component
        return `${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    };

    useEffect(() => {
        const r = rooms.find(r => r.id == room?.id)
        setUsers(r?.clients)

    }, [rooms, room.id])

    function generateRandomParagraph() {
        const words = ['Lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'Ut', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'ut', 'aliquip', 'ex', 'ea', 'commodo', 'consequat', 'Duis', 'aute', 'irure', 'dolor', 'in', 'reprehenderit', 'in', 'voluptate', 'velit', 'esse', 'cillum', 'dolore', 'eu', 'fugiat', 'nulla', 'pariatur', 'Excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'in', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'];

        let paragraph = '';
        const paragraphLength = Math.floor(Math.random() * 100) + 30; // Random length between 50 and 150 words

        for (let i = 0; i < paragraphLength; i++) {
            paragraph += words[Math.floor(Math.random() * words.length)] + ' ';

            // Insert line breaks after every 10 words
            if (i % 10 === 0 && i !== 0) {
                paragraph += '\n';
            }
        }

        return paragraph;
    }
    const [roomDescription, setRoomDescription] = useState(generateRandomParagraph())

    return (
        <div>
            <h1 className='text-sm text-bold mb-5 text-center'>Details</h1>
            <div className='flex flex-row justify-center'>
                {
                    users?.length != 0 && users?.map((user: string) => {
                        return <div key={user?.username} className='-ml-2' id="circles" style={{ backgroundImage: `url("https://ui-avatars.com/api/?name=${user?.username}&background=${randomHex()}&color=${randomHex()}}")` }}></div>
                    })
                }
            </div>
            <p className='text-xs mt-4 text-justify'>
                {roomDescription}
            </p>
        </div>

    )
}
