import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";


dotenv.config();
                              

export async function registerUser(req,res){

    const data = req.body;
    data.password = bcrypt.hashSync(data.password,10);
    const email = data.email;
    
    const  newUser = new User(data);

    try{
       const checkEmail =  await User.findOne({
        email : email
       })
       if(checkEmail == null){
        await newUser.save();
        res.json({
            message : "Uses added!"
        })
       }else{
        res.json({
            message : "email is Already use"
        })
       }  

    }catch(err){
        res.json({
            err : "User registration failed"
        })
    }

}

export function loginUser(req,res){
    const data = req.body;

    User.findOne({
        email : data.email
    }).then(
        (user)=>{
            if(user == null){
                res.states(404).json({
                    error : "User not found"
                })
            }else{
                

                const isPasswordCorrect = bcrypt.compareSync(data.password,user.password);

                if(isPasswordCorrect){
                    const token = jwt.sign({
                        firstName : user.firstName,
                        lastName : user.lastName,
                        email : user.email,
                        role : user.role,
                        image : user.image


                    },process.env.SEKRET_KEY)
                    res.json({
                        message : "Login successfull",
                        token : token
                    })
                }else{
                    res.status(401).json({
                        message : "Login failed"
                    })
                }
            }
        }
    )
}