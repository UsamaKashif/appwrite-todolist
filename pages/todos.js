import Head from 'next/head'
import { useRouter } from 'next/router';
import React, { useEffect, useContext, useState } from 'react'
import { AuthContext } from '../context';
import uuid from 'react-uuid'
import appwrite from "../appwrite"
import { AiFillDelete } from 'react-icons/ai';


const Todos = () => {
    const { getAccount } = useContext(AuthContext)
    const [user, setUser] = useState(null)
    const [todos, setTodos] = useState([])
    const [todo, setTodo] = useState("")
    const [session, setSession] = useState(null)
    const router = useRouter()

    useEffect(() => {
        const acc = getAccount()
        acc.then(res => {
            const sid = localStorage.getItem("sessionid")
            setSession(sid)
            setUser(res)
        }, err => {
            setSession(null)
            router.push('/')
        })
    }, [router])

    const getDocument = () => {
        if (user) {
            let promise = appwrite.database.listDocuments(process.env.NEXT_PUBLIC_COLLECTION_ID)
            promise.then(function (response) {
                setTodos([...response.documents])
            }, function (error) {
                setTodos([])
            });
        }
    }




    useEffect(() => {
        getDocument()
    }, [user])

    const addTodo = async (e) => {
        e.preventDefault()
        setTodos(prev => [...prev, { id: uuid(), title: todo, completed: false }])
        setTodo("")
        if (user) {
            let promise = await appwrite.database.createDocument(process.env.NEXT_PUBLIC_COLLECTION_ID, uuid(),
                { title: todo, completed: false }
                , [`user:${user.$id}`], [`user:${user.$id}`])

        }
    }

    const updateTodo = async (id, complete, title) => {
        const todoList = todos.map(todo => {
            if (todo.$id === id) {
                todo.completed = !todo.completed
                return todo
            } else {
                return todo
            }
        })
        setTodos(todoList)
        let promise = await appwrite.database.updateDocument(process.env.NEXT_PUBLIC_COLLECTION_ID, id,
            { title: title, completed: complete }
            , [`user:${user.$id}`], [`user:${user.$id}`])
    }

    const signOut = async () => {
        appwrite.account.deleteSession(session)
        .then(res => {
            localStorage.removeItem("sessionid")
            setUser(null)
            setSession(null)
            router.push('/')
        }).catch(err => {})
    }

    const deleteAccount = async () => {
        appwrite.account.delete(user.$id)
            .then(async (res) => {
                localStorage.removeItem("sessionid")
                setUser(null)
                setSession(null)
                router.push('/')
            }, (error) => {
                
            })
    }

    const deleteTodo = async(id) => {
        const todoList = todos.filter(todo => todo.$id !== id)
        await appwrite.database.deleteDocument(process.env.NEXT_PUBLIC_COLLECTION_ID, id);
        setTodos([...todoList])
    }

    if (user) {
        return (
            <div className='w-full h-screen min-h-screen bg-stone-900'>
                <Head>
                    <title>Todos</title>
                    <meta name="description" content="TodoList with Appwrite" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <div className='w-[90%] sm:w-[80%] max-w-xl h-fit mx-auto'>
                    <div className='flex items-center justify-between h-auto pt-4'>
                        <h1 className='text-white font-bold text-lg sm:text-2xl uppercase  flex-1'>Welcome, {user.name}</h1>
                        <button className='text-white bg-red-600 px-4 py-2 cursor-pointer' onClick={signOut} >Sign Out</button>
                    </div>
                    <form onSubmit={addTodo} className='w-full flex flex-col sm:items-center sm:flex-row gap-3 mt-4'>
                        <input type="text" value={todo} placeholder='Your Todo' className='py-2 px-4 flex-1' onChange={e => setTodo(e.target.value)} />
                    
                        <input className='text-white bg-green-600 px-4 py-2 cursor-pointer' type="submit" value={"Add Todo"} />
                    </form>
                    <div className='w-fill bg-white mt-5 py-4'>
                        {
                            todos.length === 0 ? <p className='text-center text-gray-600'>No Todos</p>
                                : todos.map(todo => (
                                    <div key={todo.$id} className={`${todo.completed ? " bg-green-700" : ""} flex px-4 items-center`}>
                                        <p className={`${todo.completed ? "line-through bg-green-700 text-white" : "text-black"}  flex-1 py-3`}>{todo.title}</p>
                                        <div className='flex items-center gap-1'>
                                            <input type="checkbox" onClick={() => updateTodo(todo.$id, !todo.complete, todo.title)} />
                                            <AiFillDelete className='text-red-500 text-lg cursor-pointer' onClick={() => deleteTodo(todo.$id)} />
                                        </div>
                                    </div>
                                ))
                        }
                    </div>
                    <div>
                        <p className='text-center text-red-500 my-5 cursor-pointer text-md font-bold'
                            onClick={deleteAccount}
                        >Delete Account</p>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <>
            </>
        )
    }
}

export default Todos