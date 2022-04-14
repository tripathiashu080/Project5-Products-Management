const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const cartSchema = new mongoose.Schema({
    userId: {
        type: ObjectId,
        required: true,
        ref: 'user'
    },
    items: [{
        productId: {
            type: ObjectId,
        required: true,
        ref: 'product'
        },
        quantity:
         {
        type:Number,
         required:true,
          min: 1
         },
      }],
      totalPrice: {
          type:Number, 
          required:true,
           
        },
        totalItems: {
            type:Number, 
            required:true,
             
          },
})

module.exports = mongoose.model('cart', cartSchema);