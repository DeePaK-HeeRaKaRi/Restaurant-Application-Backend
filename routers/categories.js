const Category=require('../models/category')
const express=require('express')
const router=express.Router()

router.get('/',async(req,res)=>{
    const categoryList=await Category.find({})
    if(!categoryList){
        res.status(500).json({message:"categoryList Cannot Be Fetched"})
    }
    res.status(200).send(categoryList)
})

router.get('/:id',async(req,res)=>{
    const categoryList=await Category.findById(req.params.id)
    if(!categoryList){
        res.status(500).json({message:"categoryList Cannot Be Fetched"})
    }
    res.status(200).send(categoryList)
})

router.post('/',async(req,res)=>{
    let category=new Category({
        name:req.body.name,
        icon:req.body.icon,
        color:req.body.color,
    })
    category=await category.save()
    if(!category){
        // res.status(404).send('Category Cannot be Created !!')
        // or
        res.status(404).json({message:"Category Cannot Be Created"})
    }
    res.status(200).send(category)
})

router.put('/:id',async(req,res)=>{
    const category=await Category.findByIdAndUpdate(req.params.id,
        {
            name:req.body.name,
            icon:req.body.icon,
            color:req.body.color,
        },{new:true}
    )
    // category=await category.save()
    if(!category){
        res.status(404).json({message:"Category Cannot Be Created"})
    }
    res.status(200).send(category)
})

router.delete('/:id',(req,res)=>{
    Category.findByIdAndRemove(req.params.id)
    .then((category)=>{
        if(category){
            return res.status(200).json({
                success:true,
                message:"Category Deleted"
            })
        }else{
            res.status(404).json({
                success:false,
                message:"Category Not Found To Delete"
            })
        }
    }).catch((err)=>{
        return res.status(400).json({
            success:false,
            error:err
        })
    })
})

module.exports=router