const productModel = require("../models/productModel")
const aws= require("aws-sdk")
const currencySymbol = require("currency-symbol-map")
//const bcrypt=require("bcrypt")
//saltRounds=10;
const isValid = function (value) {
  if (typeof (value) === 'undefined' || typeof (value) === 'null') {
    return false
  }
  if (typeof (value) === 'string' && value.trim().length > 0) {
    return true
  }
}
const isValidRequestBody = (requestBody) => {
    if (Object.keys(requestBody).length) return true
    return false;
}
const isValidObjectId = (ObjectId) => {
    return mongoose.Types.ObjectId.isValid(ObjectId)
}


aws.config.update(
    {
        accessKeyId: "AKIAY3L35MCRVFM24Q7U",
        secretAccessKey: "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",
        region: "ap-south-1"
    }
)
let uploadFile = async (file) => {
    return new Promise(function (resolve, reject) {
        let s3 = new aws.S3({ apiVersion: "2006-03-01" })
        var uploadParams = {
            ACL: "public-read",
            Bucket: "classroom-training-bucket",
            Key: "gaurav/" + file.originalname,
            Body: file.buffer
        }
        console.log(uploadFile)
        s3.upload(uploadParams, function (err, data) {
            if (err) {
                return reject({ "error": err })
            }
            return resolve(data.Location)
        }
        )
    }
    )
}


const createProduct = async function (req, res) {
    try {
        const requestBody = req.body;

        if (!isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: 'please provide valid inputs in request body' })
        }

        let { title, description, price, currencyId, isFreeShipping, style, availableSizes, installments } = requestBody;

        if (!isValid(title)) {
            return res.status(400).send({ status: false, message: 'Title is required' })
        }

        const duplicatetitle = await productModel.findOne({ title });

        if (duplicatetitle) {
            return res.status(400).send({ status: false, message: 'Title is already used.' })
        }

        if (!isValid(description)) {
            return res.status(400).send({ status: false, message: 'Description is required' })
        }

        if (!isValid(price)) {
            return res.status(400).send({ status: false, message: 'Price is required' })
        }
        if (isNaN(price)) {
            return res.status(400).send({ status: false, message: 'Price should be a numeric value' })
        }

        if (price <= 0) {
            return res.status(400).send({ status: false, message: `Price should be a valid number` })
        }

        if (!isValid(currencyId)) {
            return res.status(400).send({ status: false, message: 'CurrencyId is required' })
        }

        if (!(currencyId == "INR")) {
            return res.status(400).send({ status: false, message: 'currencyId should be INR' })
        }

        if (isValid(isFreeShipping)) {

            if (!((isFreeShipping === "true") || (isFreeShipping === "false"))) {
                return res.status(400).send({ status: false, message: 'isFreeShipping must be a boolean value' })
            }
        }
        if (installments) {
            if (!isValid(installments)) {
                return res.status(400).send({ status: false, message: "please enter installments" })
            }
            if (isNaN(installments)) {
                return res.status(400).send({ status: false, message: 'Installment should be a numeric value' })
            }
        }
        let productImage = req.files;
        if (!(productImage && productImage.length > 0)) {
            return res.status(400).send({ status: false, msg: "productImage is required" });
        }

        let productImageUrl = await uploadFile(productImage[0]);
        const newProductData = {
            title,
            description,
            price,
            currencyId,
            currencyFormat: currencySymbol(currencyId),
            isFreeShipping,
            style,
            installments,
            productImage: productImageUrl
        }

        if (!isValid(availableSizes)) {
            return res.status(400).send({ status: false, message: 'available Sizes is required' })
        }
        availableSizes = availableSizes.toUpperCase()
        if (availableSizes) {
            let sizeArray = availableSizes.split(",").map(x => x.trim())

            for (let i = 0; i < sizeArray.length; i++) {
                if (!(["S", "XS", "M", "X", "L", "XXL", "XL"].includes(sizeArray[i]))) {
                    return res.status(400).send({ status: false, message: `Available Sizes must be among ${["S", "XS", "M", "X", "L", "XXL", "XL"]}` })
                }
            }

            if (Array.isArray(sizeArray)) {
                newProductData['availableSizes'] = sizeArray
            }
        }
        const saveProductDetails = await productModel.create(newProductData)
        res.status(201).send({ status: true, message: "Success", data: saveProductDetails })

    } catch (error) {
        console.log(error)
        res.status(500).send({ status: false, data: error });
    }
}

const getProductDetails = async (req, res) => {
    try {
        const filterQuery = { isDeleted: false, deletedAt: null }
        const queryParams = req.query;
        if (isValidRequestBody(queryParams)) {
            const { availableSizes, title, price } = queryParams;
            if (isValid(availableSizes)) {
                if(["S", "XS","M","X", "L","XXL", "XL"].indexOf(availableSizes)===-1){
                    return res.status(404).send({ status: false, message: "please select a availableSize" })
                }
                filterQuery['availableSizes'] = availableSizes
            }
            if (isValid(title)) {
                
                filterQuery['title'] = title
            }
            if (isValid(price)) {
                
                filterQuery['price'] = price
            }
        }
        const products = await productModel.find(filterQuery).sort({price:1})
        //
        if (Array.isArray(products) && products.length === 0) {
            return res.status(404).send({ status: false, message: "No product found" })
        }
        res.status(200).send({ status: true,  message: "product list", data: products })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }

}


module.exports={createProduct,getProductDetails}