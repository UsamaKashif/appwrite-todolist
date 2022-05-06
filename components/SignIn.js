import React from 'react'
import { useForm } from 'react-hook-form';
import { useContext, useState } from 'react';
import { AuthContext } from '../context';
import {useRouter} from "next/router"

const SignIn = () => {
    const {createSession} = useContext(AuthContext)
    const [message, setMessage] = useState(null)
    const { register, handleSubmit, formState: { errors }, getValues, reset } = useForm();
    const router = useRouter()
    const submit = () => {
        const email = getValues("email")
        const password = getValues("password")
        createSession(email, password)
        .then (res => {
            localStorage.setItem("sessionid", res.$id)
            router.push('/todos')
        }).catch(err => {
            setMessage(err.message)
        })
        reset({
            email: "",
            password: ""
        })
        
    }
    return (
        <div>
            {message && <p className='font-medium w-full text-center pt-4 text-red-500'>{message}</p>}
            <form onSubmit={handleSubmit(submit)} className="py-4 gap-2 flex flex-col">
                <div className='gap-1 flex flex-col w-3/4 mx-auto max-w-md'>
                    {errors.email && <span className='font-normal text-sm text-gray-500'>This field is required</span>}
                    <input type="email"  {...register("email", { required: true })} placeholder="Email" className='p-2' />
                </div>
                <div className='gap-1 flex flex-col w-3/4 mx-auto max-w-md'>
                    {errors.password && <span className='font-normal text-sm text-gray-500'>This field is required</span>}
                    <input type="password"  {...register("password", { required: true })} placeholder="Password" className='p-2' />
                </div>
                <input type="submit" value={"Sign In"} className='mt-2 cursor-pointer bg-gray-900 mx-auto px-5 py-2 text-white' />
            </form>
        </div>
    )
}

export default SignIn