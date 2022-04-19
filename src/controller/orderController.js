const orderModel =require('../models/orderModel')
const cartModel =require('../models/cartModel')
const userModel = require('../models/userModel')



const createOrder= async function(req,res){


    const uId =req.params.userId
    if(!uId){return}

    let cartBody =req.body
    let {cancellable,status,isDeleted} =cartBody

    


    let findCart=await cartModel.findOne({userId:uId})
    if(!findCart){
        return  res.send("no cart found ")
    }
    // you can select particular elements form findCart if you Want 



    let {items,totalPrice,totalItems} =findCart

    console.log(items)

    // checking cart is empty or not 

    // there is no cart with no items so we can skip that as of now 

    
    // as total Quantity is not present in cart Model Directly 
    let totalQuantity = 0
        let totalItem = items.length
        for (let i = 0; i < totalItem; i++) {
            totalQuantity = totalQuantity + Number(items[i].quantity)
        };

    if(isDeleted == true){
        var delDate = Date.now()
    }


    let orderBody ={userId:uId,items,totalPrice,totalItems,totalQuantity,cancellable,status,deletedAt:delDate}
    console.log(orderBody)

    let orderCreated =await orderModel.create(orderBody)
    console.log(orderCreated)

    res.send(orderCreated)
}


const cancelOrder = async (req, res) => {
    try {
        let productId = req.body.orderId
        const orderCancel = await orderModel.findOneAndUpdate({ _id: productId }, { isDeleted: true, deletedAt: Date(), status: "cancelled" }, { new: true })
        return res.status(200).send({ status: true, message: 'Order has been cancelled Successfully', data: orderCancel });
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}

module.exports={createOrder,cancelOrder}