const User=require('../models/user')
const express=require('express')
const router=express.Router()
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
router.post('/',async(req,res)=>{
    const userExists=await User.findOne({email:req.body.email})
    if(userExists){
        return res.send('Sorry,user with same email has exists')
    }
    try{
        console.log("requestt",req.body)
        let user=await new User({
            name:req.body.name,
            email:req.body.email,
            passwordHash:bcrypt.hashSync(req.body.passwordHash,10),
            phone: req.body.phone,
            isAdmin:req.body.isAdmin,
            street: req.body.street,
            secret:req.body.secret,
            apartment:req.body.apartment,
            zip:req.body.zip,
            city:req.body.city,
            country:req.body.country,
        })
        user =await user.save()
        console.log("user",user)
        if(!user){
            return res.status(404).send("Users Cannot be Created")
        }
        res.status(200).send(user)
    }
    catch(error){
        console.log("Error ",error)
    } 
})
router.post('/register',async(req,res)=>{
    let user=new User({
        name:req.body.name,
        email:req.body.email,
        passwordHash:bcrypt.hashSync(req.body.passwordHash,10),
        // passwordHash:req.body.passwordHash,
        phone: req.body.phone,
        secret:req.body.secret,
        isAdmin:req.body.isAdmin,
        street: req.body.street,
        apartment:req.body.apartment,
        zip:req.body.zip,
        city:req.body.city,
        country:req.body.country,
    })
    user =await user.save()
    if(!user){
        return res.status(404).send("Users Cannot be Created")
    }
    res.send(user)
})

router.get('/',async(req,res)=>{
    const userList=await User.find()
    if(!userList){
        return res.status(404).send("UsersList Cannot be Found")
    }
    res.send(userList)
})
// router.get('/register',async(req,res)=>{
//     const userList=await User.find()
//     if(!userList){
//         return res.status(404).send("UsersList Cannot be Found")
//     }
//     res.send(userList)
// })
router.get('/:id',async(req,res)=>{
    const userList=await User.findById(req.params.id)
    if(!userList){
        return res.status(404).send("UsersList Cannot be Found")
    }
    res.send(userList)
})
router.get('/user-email/:email',async(req,res)=>{
    // console.log("reqparams",req.params.email)
    const userList=await User.findOne(req.params)
    // console.log("Userby one",userList)
    if(!userList){
        return res.status(404).send("UsersList Cannot be Found")
    }
    res.send(userList)
})
router.put('/:id',async(req,res)=>{
    const userExist=await User.findById(req.params.id)
    let newpassword
    if(userExist){
        newpassword=bcrypt.hashSync(req.body.passwordHash,10)
        // newpassword=req.body.passwordHash
    }else{
        newpassword=userExist.passwordHash
    }
    let user=await User.findByIdAndUpdate(req.params.id,{
        name:req.body.name,
        email:req.body.email,
        passwordHash:newpassword,
        phone: req.body.phone,
        secret:req.body.secret,
        isAdmin:req.body.isAdmin,
        street: req.body.street,
        apartment:req.body.apartment,
        zip:req.body.zip,
        city:req.body.city,
        country:req.body.country,
    })
    
    if(!user){
        return res.status(404).send("Users Cannot be Created")
    }
    res.send(user)
})
router.post('/login',async(req,res)=>{
    const userLogin=await User.findOne({email:req.body.email})
    const secret=process.env.secret
    if(!userLogin){
        return res.status(404).send("User Is Not Found")
    }
    if(userLogin && bcrypt.compareSync(req.body.passwordHash,userLogin.passwordHash)){
    // if(userLogin && req.body.passwordHash==userLogin.passwordHash){
        const token=jwt.sign({
            userId:userLogin.id,
            isAdmin:userLogin.isAdmin
        },
        secret,
        {expiresIn:'1w'},
        )
        res.status(200).send({"User Is Authenticated":userLogin,userLogin:userLogin.email,token:token})
    }else{
        res.status(404).send("Username / Password Is Wrong")
    }
    
})

router.get('/get/count',(req,res)=>{
    User.countDocuments().then((userCount)=>{
        if(!userCount){
            res.status(500).json({success:false})
        }
        res.status(200).json({success:true,Count:userCount})
    }).catch((err)=>{
        return res.status(500).json({success:false,message:"Internal Server Error"})
    })
})

router.delete('/:id', (req, res)=>{
    User.findByIdAndRemove(req.params.id).then(user =>{
        if(user) {
            return res.status(200).json({success: true, message: 'the user is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "user not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
})
module.exports=router