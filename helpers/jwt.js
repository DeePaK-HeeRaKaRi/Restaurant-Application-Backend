/*
const expressJWT=require('express-jwt')
function authJWT(){
    const api=process.env.API_URL
    const secret=process.env.secret
    return expressJWT({
        secret,
        algorithms:['HS256'],
        isRevoked:isRevoked
    }).unless({
        path:[
            // {url:/\/api\/v1\/products(.*)/,methods:['GET','OPTIONS']},
            // {url:/\/api\/v1\/categories(.*)/,methods:['GET','OPTIONS']},
            // {url:/\/api\/v1\/uploads(.*)/,methods:['GET','OPTIONS']},
            // {url:/\/api\/v1\/orders(.*)/,methods:['GET','OPTIONS']},
            // `/api/v1/users/login`,
            // `/api/v1/users/get/count`
            {url:/(.*)/}
            // {url:`${api}/products`,methods:['GET','OPTIONS']}
        ]
    })
}
async function isRevoked(req,payload,done){
    if(!payload.isAdmin){
        done(null,true)
    }
    done()
}

module.exports=authJWT

*/
const jwt=require('jsonwebtoken')
module.exports=((req,res,next)=>{
    try{
        const token=req.headers.authorization.split(" ")[1]
        const decode=jwt.verify(token,process.env.secret)
        req.userData=decode
        next()
    }catch(error){
        return res.status(404).json({message:'Auth Falied'})
        // console.log(error)
    }
    
})