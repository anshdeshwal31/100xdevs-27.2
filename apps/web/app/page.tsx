use client
import { useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"

const createUser = async (firstname: string | undefined, lastname: string | undefined) => {
  try {
    console.log("process to create user initiated")
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/createUser`, {
      firstname,
      lastname
    })
    console.log("user created successfully")
    return response.data
  } catch (error) {
    console.log("the error is: ", error)
  }
}

const loginUser = async (email: string | undefined, password: string | undefined) => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/login`, {
      email,
      password
    })
    console.log("user logged in successfully")
    return response.data
  } catch (error) {
    console.log("the error is: ", error)
  }
}

export default function Home() {
  const [firstname, setFirstname] = useState<string | undefined>()
  const [lastname, setLastname] = useState<string | undefined>()
  const [email, setEmail] = useState<string | undefined>()
  const [password, setPassword] = useState<string | undefined>()
  const [user, setUser] = useState<{ firstname: string; lastname: string } | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const router = useRouter()

  const getUser = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/getUser`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setUser(response.data.user)
      console.log({ user })
      console.log("fetched the user successfully")
    } catch (error) {
      console.log("the error is: ", error)
    }
  }

  const handleSignup = async () => {
    const response = await createUser(firstname, lastname)
    if (response) {
      const loginResponse = await loginUser(response.email, response.password)
      if (loginResponse) {
        setToken(loginResponse.token)
        router.push("/protected")
      }
    }
  }

  const handleLogin = async () => {
    const response = await loginUser(email, password)
    if (response) {
      setToken(response.token)
      router.push("/protected")
    }
  }

  return (
    <div className="flex flex-col gap-4 items-center">
      <div className="flex justify-center gap-2">
        <input onChange={(e) => { setFirstname(e.target.value) }} type="text" name="firstname" id="" placeholder="firstname" className="p-4 border-black border" />
        <input onChange={(e) => { setLastname(e.target.value) }} type="text" placeholder="lastname" name="lastname" id="" className="p-4 border-black border" />
      </div>

      <div className="flex justify-center gap-2">
        <button onClick={handleSignup} className="hover:cursor-pointer bg-green-300 p-2 rounded-md">Signup</button>
      </div>

      <div className="flex justify-center gap-2 mt-5">
        <input onChange={(e) => { setEmail(e.target.value) }} type="email" name="email" id="" placeholder="email" className="p-4 border-black border" />
        <input onChange={(e) => { setPassword(e.target.value) }} type="password" placeholder="password" name="password" id="" className="p-4 border-black border" />
      </div>

      <div className="flex justify-center gap-2">
        <button onClick={handleLogin} className="bg-blue-300 p-2 rounded-md hover:cursor-pointer">Login</button>
      </div>

      <div className="mt-5">
        <div>firstname:{user?.firstname}</div>
        <div>lastname:{user?.lastname}</div>
      </div>
    </div>
  )
}