const cartModel = require("../model/cartModel")
const orderModel = require("../model/orderModel")
const { isValidate, isValidObjectId, isValidSize, isValidPrice } = require("../Validator/userValidator");

const placeOrder = async function (req, res){
    try{
    let data = req.body
    let userId = req.params.userId

    let {cartId} = data  //destructing


    if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: "please enter a valid  user Id" })

    let checkUser = await cartModel.findOne({userId:userId})
    if(!checkUser){
        return res.status(400).send({status: false, message:" User Does not exist with given ID" })
    }

    let productInCart = await cartModel.findOne({_id:cartId})
    if(!productInCart){
        return res.status(400).send({status:true,message:"user has not added items in cart"})
    }

    if(productInCart.items.length==0){
        return res.status(400).send({status:false, message:"No product added in cart"})

    }
    

    let items = productInCart.items
    let totalPrice = productInCart.totalPrice
    let totalItems = productInCart.totalItems


    let orders= {
        userId: userId,
        items:items,
        totalPrice: totalPrice,
        totalItems: totalItems,
        totalQuantity:  totalQuantity

    }

   let createOrder= await orderModel.create(orders)
    return res.status(201).send({status:true,message:"Success", data :createOrder})

    }
    catch(err){
        return res.status(500).send({status: false, message: err.message})
    }
}


const updateOrder = async function (req, res){
    try{
    let data = req.body

    if(!isValidate(data)) return res.status(400).send({status:false,message:"Input not found"})
   
    if(!data.orderId) return res.status(400).send({status:false,message:"OrderId is required"})
    if(!isValidObjectId(data,orderId)) return res.status(400).send({status:false,message:"OrderId is not valid"})

    let findOrder=await orderModel.findOne({_id:data.orderId,isDeleted:false})
    if (!findOrder) return res.status(400).send({status:false,message:`Order not found by this'${data.orderId}'`})

    if(!isValidate(data.status)) return res.status(400).send({status:false,message:"status is required"})
    if(!(['Pending','Completed','Cancelled'].includes(data.status))) return res.status(400).send({ status: false, message: "Order status should be one of this 'Pending','Completed' and 'Cancelled'" });

    let conditions = {};

    if(data.status == "Cancelled") {
      //checking if the order is cancellable or not
      if(!findOrder.cancellable) return res.status(400).send({ status: false, message: "You cannot cancel this order" });
      conditions.status = data.status;
    }else{
      conditions.status = data.status;
    }

    let resData = await Order.findByIdAndUpdate(
        {_id: findOrder._id},
        conditions,
        {new: true}
      )
      res.status(200).send({ status: true, message: "Success", data: resData });
    }
    catch(err){
        return res.status(500).send({status: false, message: err.message})
    }
}
module.exports.placeOrder = placeOrder
module.exports.updateOrder = updateOrder