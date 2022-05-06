import React,{useState} from 'react'
import { useForm } from 'react-hook-form';
import { useContext } from 'react'
import { AuthContext } from '../context';

const SignUp = ({setSignIn}) => {
    const {createAccount} = useContext(AuthContext)
    const { register, handleSubmit, formState: { errors }, getValues, reset } = useForm();
    const [message, setMessage] = useState(null)
    const submit = () => {
        const password = getValues("password")
        const confirmPassword = getValues("confirmPassword")
        const email = getValues("email")
        const name = getValues("name")
        if (password == confirmPassword){
            createAccount(email, password, name)
            .then (() => {
                setSignIn(true)
            }).catch(err => {
                setMessage(err.message)
            })
        }else{
            setMessage("Password do not match")
        }
        reset({
            email: "",
            password: "",
            confirmPassword: "",
            name: ""
        })
    }
    return (
        <div>
            {message && <p className='font-medium w-full text-center pt-4 text-red-500'>{message}</p>}
            <form onSubmit={handleSubmit(submit)} className="py-4 gap-2 flex flex-col">
                <div className='gap-1 flex flex-col w-3/4 mx-auto max-w-md'>
                    {errors.name && <span className='font-normal text-sm text-gray-500'>This field is required</span>}
                    <input type="text"  {...register("name", { required: true })} placeholder="Name" className='p-2'  />
                </div>
                <div className='gap-1 flex flex-col w-3/4 mx-auto max-w-md'>
                    {errors.email && <span className='font-normal text-sm text-gray-500'>This field is required</span>}
                    <input type="email"  {...register("email", { required: true })} placeholder="Email" className='p-2'  />
                </div>
                <div className='gap-1 flex flex-col w-3/4 mx-auto max-w-md'>
                    {errors.password && <span className='font-normal text-sm text-gray-500'>This field is required</span>}
                    <input type="password" {...register("password", { required: true })} placeholder="Password" className='p-2' />
                </div>
                <div className='gap-1 flex flex-col w-3/4 mx-auto max-w-md'>
                    {errors.confirmPassword && <span className='font-normal text-sm text-gray-500'>This field is required</span>}
                    <input type="password" {...register("confirmPassword", { required: true })} placeholder="Confirm Password" className='p-2' />
                </div>
                <input type="submit" value={"Sign Up"} className='mt-2 cursor-pointer bg-gray-900 mx-auto px-5 py-2 text-white' />
            </form>
        </div>
    )
}

export default SignUp