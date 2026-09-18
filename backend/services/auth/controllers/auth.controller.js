import { getAuth } from "firebase-admin/auth";
import { app } from "../../config/firebase.js";
import User from "../../../models/User.model.js";   

export const login =async (req,res) => {
    try{
        const {token} = req.body
        const decoded=getAuth(app).verifyIdToken(token)
        let user=await User.findOne({
            firebaseUid:decoded.uid
        })

        if(!user) {
            user=await User.create({
                firebaseUid:decoded.uid,
                name:decoded.name,
                email:decoded.email,
                avatar:decoded.picture
            })

            const sessionId=crypto.randomUUID()

            res.cookie("session", sessionId, {
                httpOnly:true,
                secure:false,       // false cuz in dev , true for production
                sameSite:"strict",
                maxAge:1000*60*60*24*7
            })

            return res.status(200).json(user)
        }
    } catch(error) {
        return res.status(500).json({message:`Login error: ${error}`})
    }
}