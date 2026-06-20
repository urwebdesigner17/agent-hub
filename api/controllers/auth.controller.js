import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'

//SAVING USER TO MONGO DB
export const signup = async (req, res)=>{
    const {username, email, password} = req.body; // meaning geting request data from browser (Body is the browser)
    const hashPassword = bcrypt.hashSync(password, 10) //encrypting password
    const newUser = new User({username, email, password:hashPassword});
    await newUser.save()
    res.status(201).json("User created successfully");
}
