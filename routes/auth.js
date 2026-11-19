import express from 'express';
import { findByUsername } from '../utils/db.js';
import bcypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();


router.post('/login',async(req,res)=>{
    const { username , password } = req.body ?? {};

    if(!username || !password){
        return res.status(400).json({
            error: "Username and password are required."
        })
    }

    const user =findByUsername(username);
    
    if(!user){
        return res.status(401).json({
            error:"Invalid username or password."
        })
    }

    const isPasswordValid = await bcypt.compare(password,user.passwordHash);

    if(!isPasswordValid){
        return res.status(401).json({
            error:'Invalid username or password.'
        })
    }

    const token =jwt.sign({
        id:user.id,
        username:user.username,
        role:user.role
    },
    process.env.JWT_SECRET,
    {expiresIn:'1d'}
);
return res.status(200).json({token});
});


export default router;