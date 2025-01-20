import Inquiry from "../models/inquiry.js";
import { isItAdmin, isItCustomer } from "./userController.js";

export async function addInquiry(req,res) {

    try{
        if(isItCustomer){
            const data = req.body;
            
            data.email = req.user.email
            data.phone = req.user.phone
//generate id
            let id = 0;

            const inquiryIds = await Inquiry.find().sort({id : -1}).limit(1)

            if(inquiryIds.length == 0){
                id = 1;
            }else{
                inquiryIds[0].id++;
                id = inquiryIds[0].id;
                
            }
            data.id = id;
            console.log(id);

            const newInquiry = new Inquiry(data);

            await newInquiry.save();
            res.json({
                message : "Inquiry added successfully"
            })
            return


        }else{
            res.status(403).json({
                message : "you are not authorized to perform this action"
            })
        }

    }catch(err){
        console.log(err)
        res.status(500).json({
            message : "Inquiry addedd unsuccessfully"
        })
    }
    
}

export async function getInquiry(req,res){

    try{
       
        if(isItAdmin(req)){
            const inquiry = await Inquiry.find();
            res.json(inquiry);
            return
        }
        
        else if(isItCustomer(req)){
            
            
            const email = req.user.email
            const inquiry = await Inquiry.find({
                email : email
            })
            res.json(inquiry);
            return
        }
        else{
            res.json({
                message : "you are not authorized to perform this action"
            })
        }
    }catch(err){
        res.status(500).json({
            message : "can't show details"
        })
    }
}

export async function deleteInquiry(req,res){

    try{
        if(isItAdmin(req)){
            const id = req.params.id;
            await Inquiry.deleteOne({
                id:id
            })
            res.json({
                message : "Inquiry deleted successfully"
            })
            return
        }
        else if(isItCustomer(req)){
            const id = req.params.id;
            const inquiry = await Inquiry.findOne({id:id});
            if(inquiry == null){
                res.status(404).json({
                    message : "Inqury not found"
                })
                return
            }
            if(inquiry.email == req.user.email){
                    await inquiry.deleteOne({id:id})
                    res.json({
                        message : "Inquiry deleted successfully"
                    })
                    return
                }else{

                    res.json("You are not authorized to perform this action")
                    return
                }

            
        }
        else{
            res.status(403).json({
                message : "You are not authorized to perform this action"
            })
            return
        }
    }catch(err){
        res.status(500).json({
            message : "Failed to delete inquiry"
        })
    }
}

export async function updateInquiry(req,res){

    try{
        const data = req.body;
        const id = req.params.id
        if(isItAdmin(req)){
            await Inquiry.updateOne({id:id},data)
            res.json({
                message : "Inquiry updated successfully"
            })
            return
        }
        else if(isItCustomer(req)){
            const inquiry = await Inquiry.findOne({id:id})
            console.log(req.user.email)
            console.log(inquiry.email)
            if(inquiry.email == req.user.email){
                await Inquiry.updateOne({id:id},{message : data.message})
                res.json({message : "Inquiry update successfully"})
                return
            }
            else{
                res.status(401).json({
                     message : "You are not authorized to perform this action"
                })
                return
            }
        }else{
            res.status(401).json({
                 message : "You are not authorized to perform this action"
            })
            return
        }
        
    }catch(err){
        res.status(500).json({
            message : "Failed to update inquiry"
        })
    }
}