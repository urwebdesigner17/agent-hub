import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import {errorHandler} from '../utils/error.js'
import jwt from 'jsonwebtoken'

//SAVING USER TO MONGO DB
export const signup = async (req, res, next)=>{
    const {username, email, password} = req.body; // meaning geting request data from browser (Body is the browser)
    const hashPassword = bcrypt.hashSync(password, 10) //encrypting password
    const newUser = new User({username, email, password:hashPassword});
    try{
        await newUser.save()
        res.status(201).json("User created successfully");
    }catch (error){
        next(error);
    }
}

export const signin = async (req, res, next)=>{
    const {email, password} = req.body; // meaning geting request data from browser (Body is the browser)
    try{
        const validUser = await User.findOne({email});
            if(!validUser) return next(errorHandler(404, 'User not found'))
        const validPassword = bcrypt.compareSync(password, validUser.password);
            if(!validPassword) return next(errorHandler(401, 'Invalid password'))
            const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET);
            res
                .cookie('access_token', token, {httpOnly:true})
                .status(200)
                .json(validUser)
    }catch (error){
        next(error);
    }
}
//END 2:29