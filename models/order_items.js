const mongoose=require('mongoose')

const orderItemsSchema=mongoose.Schema({
    quantity:{
        type:Number,
        required:true
    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product'
    }
},{timestamps:true})
orderItemsSchema.virtual('id').get(function(){
    return this._id.toHexString()
})
orderItemsSchema.set('toJSON',{virtuals:true})
const orderItems=mongoose.model('orderItems',orderItemsSchema)
module.exports=orderItems
