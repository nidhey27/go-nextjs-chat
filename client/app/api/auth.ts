import axios, { AxiosResponse } from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next'

const login = async (user: any) => {
    return await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/log-in`, user);
};

export { login };