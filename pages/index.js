import Head from 'next/head'
import { useState, useEffect, useContext } from 'react'
import SignIn from '../components/SignIn'
import SignUp from '../components/SignUp'
import { useRouter } from 'next/router';
import { AuthContext } from '../context';

const Authentication = ({ signIn, setSignIn }) => {
  const { getAccount } = useContext(AuthContext)
  const [user, setUser] = useState(null)
  const router = useRouter()
  useEffect(() => {
    const acc = getAccount()
    acc.then(res => {
      router.push('/todos')
    }, err => {
    })
  }, [router])

  switch (signIn) {
    case true:
      return <SignIn />
    case false:
      return <SignUp setSignIn={setSignIn} />
    default:
      return <></>
  }
}

export default function Home() {
  const [signIn, setSignIn] = useState(false)
  return (
    <div className='flex items-center w-full h-screen min-h-screen bg-stone-900'>
      <Head>
        <title>Todo List</title>
        <meta name="description" content="TodoList with Appwrite" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='w-3/4 max-w-xl h-fit mx-auto bg-gray-200'>
        <div className='flex'>
          <div onClick={() => setSignIn(false)} className={`${!signIn && "bg-gray-900 text-white"} transition-colors cursor-pointer flex-1 text-center hover:bg-gray-900 hover:text-white  py-2`}>
            <p className='font-medium font-sans'>Sign Up</p>
          </div>
          <div onClick={() => setSignIn(true)} className={`${signIn && "bg-gray-900 text-white"} transition-colors cursor-pointer flex-1 text-center hover:bg-gray-900 hover:text-white  py-2`}>
            <p className='font-medium font-sans'>Sign In</p>
          </div>
        </div>
        <Authentication signIn={signIn} setSignIn={setSignIn} />
      </div>
    </div>
  )
}
