import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

// const response = await fetch('http:localhost:4000/api/book',{
//             method : 'POST',
//             body : JSON.stringify({
//                 title ,
//                 caption
//             }),
//         headers : {
//             authorization : `Bearer ${token}`
//         }
//         })

const protectRoute = async (req,res,next)=>{
    try {
        const token = req.header('authorization')?.replace('Bearer ', '');
        if(!token){
            return res.status(401).json({ message: 'No token provided, authorization denied' });
        }
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decode.userId).select('-password');
        if(!user){
            return res.status(401).json({ message: 'Token is not valid, authorization denied' });
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid, authorization denied' });
        console.error('Error in protectRoute:', error);
    }
}

export default protectRoute;