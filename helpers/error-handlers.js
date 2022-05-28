function errorHandler(err,req,res,next){
    if(err.name==='UnauthorizedError'){
        return res.status(401).json({message:'The User is Unauthoied to access'})
    }
    if(err.name==='ValidationError'){
        return res.status(401).json({message:err})
    }
    return res.status(500).json({message:'Internal Server Error',error:err})
}
module.exports=errorHandler