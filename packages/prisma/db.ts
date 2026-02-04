import 'dotenv/config'
import { PrismaClient } from './prisma/generated/client'
import { PrismaNeon } from '@prisma/adapter-neon'

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
})

 const prisma = new PrismaClient({ adapter })
 export default prisma

 const checkConnection = async() => { 
  try {
    await prisma.$connect();
    console.log("db connected successfully");
  } catch (error) {
    console.log("couldn't connect the db",error);
  }
  }

  await checkConnection()