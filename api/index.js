import express from 'express'
import mongoose from 'mongoose'
import userRouter from '../api/routes/user.route.js'
import authRouter from '../api/routes/auth.route.js'
import dotenv from 'dotenv'

dotenv.config()

mongoose.connect(process.env.MONGODB).then(()=>{
    console.log('connected to MongoDB')
}).catch((err)=>{
    console.log(err)
})

const app = express();

app.listen(3000, ()=>{
    console.log('Server running on Port 3000');
    }
)

app.use(express.json()) //this is use when requesting json data

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);