const Order=require('../models/order')
const OrderItems=require('../models/order_items')
const express=require('express')
const router=express.Router()
const checkAuth=require('../helpers/jwt')
router.get('/',checkAuth,async(req,res)=>{
    // .sort('dateOrdered') => old to new
    // .sort({'dateOrdered':-1}) => new to old
    const orderList=await Order.find()
    .populate('user','name email')
    .populate({path:'orderItems',populate:{path:'product',populate:{path:'category'}}})
    // .sort({'dateOrdered':-1})
    if(!orderList){
        return res.status(404).send("OrderList Cannot be Found")
    }
    res.send(orderList)
})

router.get('/:id',async(req,res)=>{
    const orderList=await Order.findById(req.params.id).populate('user','name email')
    .populate({path:'orderItems',populate:{path:'product',populate:{path:'category'}}})

    .sort({'dateOrdered':-1})
    if(!orderList){
        return res.status(404).send("OrderList Cannot be Found")
    }
    res.send(orderList)
})


router.post('/',async(req,res)=>{
    const orderItemsIds=Promise.all(req.body.orderItems.map(async(orderItem) =>{
        let newOrderItem=new OrderItems({
            quantity:orderItem.quantity,
            product:orderItem.product
        })
        newOrderItem=await newOrderItem.save()
        return newOrderItem._id
    }))
    const orderItemsResolved=await orderItemsIds
    console.log(orderItemsResolved)
    const totalPrices=await Promise.all(orderItemsResolved.map(async(orderitemid)=>{
        const orderItem=await OrderItems.findById(orderitemid).populate('product','price')
        const totalPrice=orderItem.product.price * orderItem.quantity
        console.log(totalPrice)
        return totalPrice
    }))
    console.log(totalPrices)
    const TotalPricee=totalPrices.reduce((a,b)=>a+b,0)
    let order=new Order({
        orderItems:orderItemsResolved,
        shippingAddress1:req.body.shippingAddress1,
        shippingAddress2:req.body.shippingAddress2,
        city:req.body.city,
        zip:req.body.zip,
        country:req.body.country,
        phone:req.body.phone,
        status:req.body.status,
        totalPrice:TotalPricee,
        user:req.body.user,
    })
    order =await order.save()
    if(!order){
        return res.status(404).send("Users Cannot be Created")
    }
    res.send(order)
})
 
router.get('/get/totalsales', async (req, res)=> {
     
    const totalSales= await Order.aggregate([
        { $group: { _id: null , totalsales : { $sum : '$TotalPricee'}}}
    ])

    if(!totalSales) {
        return res.status(400).send('The order sales cannot be generated')
    }
    console.log(totalSales)
    res.send({totalsales: totalSales.pop().totalsales})
})

router.get('/get/usersorders/:userid',async(req,res)=>{
    const userOrderList=await Order.find({user:req.params.userid})
    .populate({path:'orderItems',populate:{path:'product',populate:{path:'category'}}})
    if(!userOrderList) {
        return res.status(400).send('The userOrderList cannot be generated')
    }else if(userOrderList.length == 0){
        res.send("You Have No Orders")
    }
    // console.log(totalSales)
    res.json({"Your Total Orders Are ":userOrderList.length,"Orders":userOrderList})

})
router.put('/:id',async(req,res)=>{
    const orderUpdate=await Order.findByIdAndUpdate(
        req.params.id,
        {
            status:req.body.status
        },{new:true}
    )
    if(!orderUpdate){
        return res.status(404).send("Status Cannot Be Updated")
    }
    res.send(orderUpdate)
})
router.delete('/:id',(req,res)=>{
    Order.findByIdAndRemove(req.params.id)
    .then(async(order)=>{
        if(order){
            await order.orderItems.map(async(OrderItem)=>{
                await OrderItems.findByIdAndRemove(OrderItem)
            })
            return res.status(200).json({success:true,message:"The Order Is Deleted"})
        }else{
            return res.status(404).json({success:false,message:"The Order Is Not Found To Delete"})
        }
    }).catch((err)=>{
        return res.status(500).json({success:false,message:"Internal Server Error"})
    })
})
module.exports=router