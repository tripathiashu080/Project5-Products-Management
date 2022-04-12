const productModel = require("../models/productModel")
const aws= require("aws-sdk")
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
        const productData = req.body
        const files = req.files
        if (Object.keys(productData).length = 0) { return res.status(400).send({ status: "false", message: "Please ptovide required input fields" }) }
        let { title, description, price, currencyId,  currencyFormat,isFreeShipping,style,availableSizes,installments  } = productData
        if (!isValid(title)) { return res.status(400).send({ status: "false", message: "Please provide title" }) }
        
        let duplicateTitle = await productModel.findOne({ title: title })
        if (duplicateTitle) {
            return res.status(400).send({ status: false, message: `title Already Present` });
        }

        if (!isValid(description)) {
            return res.status(400).send({ status: false, message: " please provide description" });
        }
       
        if (!isValid(price)) {
            return res.status(400).send({ status: false, message: " please enter price" });
        }
        
        if (!isValid(currencyId)) {
            return res.status(400).send({ status: false, message: " please enter currencyId" });
        }

        if (!isValid(currencyFormat)) {
            return res.status(400).send({ status: false, message: " please enter currencyId" });
        }
        
      
        if (files && files.length > 0) {
            productImage = await uploadFile(files[0])
        }
        else { return res.status(400).send({ message: "No file found" }) }
        //const hash = await bcrypt.hash(password, saltRounds)
        const productsData = {
            "title": title,
            "description": description,
            "price": price,
            "currencyId": currencyId,
            "currencyFormat": currencyFormat,
            " isFreeShipping":  isFreeShipping,
            "productImage": productImage,
            "style":style,
            "availableSizes":availableSizes,
            "installments":installments
        }
        let product = await productModel.create(productsData)
        return res.status(201).send({ status: true, message: "product created  succesfully", data: product })
    }
    catch (err) {
        return res.status(500).send({ status: "false", message: err.message })
    }
}

const getProductDetails = async (req, res) => {
    try {
        const filterQuery = { isDeleted: false, deletedAt: null }
        const queryParams = req.query;
        if (isValidRequestBody(queryParams)) {
            const { availableSizes, title, price } = queryParams;
            if (isValid(availableSizes) && isValidObjectId(_Id)) {
                filterQuery['availableSizes'] = availableSizes
            }
            if (isValid(title)) {
                filterQuery['title'] = title
            }
            if (isValid(price)) {
                //const subcatArr = subcategory.trim().split(',').map(subcat => subcat.trim())
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