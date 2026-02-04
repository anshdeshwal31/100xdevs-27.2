import 'dotenv/config'
import express from "express"
import prisma from "@repo/prisma/db";

const app = express();
const port:number = 3001;

app.use(express.json());

app.post("/createUser", async(req,res) => { 
    try {
        const user = await prisma.user.create({
            data:{
                firstname:Math.random().toString(),
                lastname:Math.random().toString()
            }
        })
        res.json({message:"user created successfully"});
    } catch (error) {
        console.log({error})  
        return 
    }
 })

 app.get("/getUser", async(req,res) => { 
    try {
        const user = await prisma.user.findFirst();

        res.json({user})
    } catch (error) {
        console.log(error)
        return 
    }
  })

  app.listen(port ,() => { 
    console.log( `Port ${port} is listening`);
   } )