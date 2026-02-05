"use client"
import {useState} from "react"
import axios from "axios"

const createUser = async(firstname:string|undefined,lastname:string|undefined) => { 
    try {
      console.log("process to create user initiated")
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/createUser`,{
        firstname,
        lastname
      })
      console.log("user created successfully")
    } catch (error) {
      
    }
 }

 
 export default function Home() {
   
   const[firstname,setFirstname] = useState<string|undefined>()
   const[lastname,setLastname] = useState<string|undefined>()
   const [user, setUser] = useState<{ firstname: string; lastname: string } | null>(null)
   
   const getUser = async() => { 
    try {
      const user = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/getUser`)
      setUser(user.data.user)
      console.log({user})
      console.log("fetched the user successfully")
    } catch (error) {
      console.log("the error is: ",error)
    }
    }
  return (
    <div className="flex flex-col gap-4 items-center">
      <div className="flex justify-center gap-2">
        <input onChange={(e) => { setFirstname(e.target.value) }} type="text" name="firstname" id="" placeholder="firstname" className="p-4 border-black border"/>
        <input onChange={(e) => { setLastname(e.target.value) }} type="text"  placeholder="lastnamae" name="lastname" id="" className="p-4 border-black border" />
      </div> 

      <div className="flex justify-center gap-2">
        <button onClick={() => { createUser(firstname , lastname) }} className="hover:cursor-pointer bg-green-300 p-2 rounded-md">Create User</button>
        <button onClick={getUser} className="bg-blue-300 p-2 rounded-md hover:cursor-pointer">Get First User</button>
      </div>

      <div className="mt-5">
        <div>firstname:{user?.firstname}</div>
        <div>lastname:{user?.lastname}</div>
      </div>
    </div>
  )
}