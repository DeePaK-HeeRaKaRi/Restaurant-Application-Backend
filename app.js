const express=require('express')
const app=express()
require('dotenv/config')
const cors=require('cors')
// const authJWT=require('./helpers/jwt')
const errorHandler=require('./helpers/error-handlers')
var corsOptions={
    origin:'http://localhost:4200',
    optionsSuccessStatus:200,
}
app.use(cors(corsOptions))
// app.options('*',cors())

const bodyParser = require('body-parser')
const morgan=require('morgan')
const mongoose=require('mongoose')

const productRouter=require('./routers/products')
const categoryRouter=require('./routers/categories')
const orderRouter=require('./routers/orders')
const userRouter=require('./routers/users')
// app.use(express.json())
app.use(
    express.urlencoded({ extended: true })
);

app.use(express.json());
app.use(bodyParser.json())
app.use(morgan('common'))
// app.use(authJWT())
app.use('/public/uploads',express.static(__dirname+'/public/uploads'))
app.use(errorHandler)
const api=process.env.API_URL
app.use(`${api}/products`,productRouter)
app.use(`${api}/categories`,categoryRouter)
app.use(`${api}/orders`,orderRouter)
app.use(`${api}/users`,userRouter)
 
mongoose.connect(process.env.CONNECTION_STRING,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    dbName:'Restaruant-Database'
})
.then(()=>{
    console.log("Database Connection Ready")
})
.catch((err)=>{
    console.log("Error",err)
})

app.listen(3000,()=>{
    console.log("Server is running on http://localhost:3000")
})
