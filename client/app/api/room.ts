import axios, { AxiosResponse } from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next'

const createRoom = async (room: any) => {
    return await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/ws/create-room`, room);
};


const getRooms = async () => {
    return await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/ws/rooms`);
};

export { createRoom, getRooms };