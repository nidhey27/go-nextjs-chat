
"use client"
import { useContext, useState } from "react"
import "./login.css"
import { useRouter } from "next/navigation";
import { login as Login } from "../api/auth"
import Toast from "../../components/toast";
import { UserContext } from "../context/user";
export default function login() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { user, setUser } = useContext(UserContext)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [email, setEmail] = useState('nidhey60@gmail.com')
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [password, setPassword] = useState('123456')

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const router = useRouter();

    const submitHandler = async (e: React.SyntheticEvent) => {
        try {
            e.preventDefault()


            const res = await Login({
                "email": email,
                "password": password
            })
            Toast({
                message: "Login Successful",
                type: "success",
            });

            sessionStorage.setItem("id", res?.data?.id)
            sessionStorage.setItem("username", res?.data?.username)
            setUser({
                id: res?.data?.id,
                username: res?.data?.username
            })

            setTimeout(() => {
                router.push("/chats");
            }, 1000)

        }
        catch (error: any) {
            Toast({
                message: error.response.data.error.toUpperCase(),
                type: "error",
            });
        }
    }
    return (
        <div className='flex items-center justify-center min-w-full min-h-screen '>
            {/* @ts-ignore */}
            <Toast />
            <form className='flex flex-col md:w-2/5 border-4 rounded-lg border-dark-secondary p-8 shadow-lg'>
                <div className='text-3xl font-bold text-center'>
                    <span className='text-grey'>Aplicación de Chat!</span>
                </div>
                <input
                    placeholder='Email'
                    type="email"
                    className='p-3 text-dark-primary mt-8 rounded-md border-2 border-grey focus:outline-none focus:border-dark-primary'
                    value={email}
                    autoComplete="true"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type='password'
                    placeholder='Password'
                    className='p-3 text-dark-primary mt-4 rounded-md border-2 border-grey focus:outline-none focus:border-dark-primary'
                    value={password}
                    autoComplete="true"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    className='p-3 mt-6 rounded-md bg-dark-secondary font-bold text-white'
                    type='submit'
                    onClick={submitHandler}
                >
                    Login
                </button>
            </form>
        </div>
    )
}
