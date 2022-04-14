const productModel = require("../models/productModel")
const aws= require("aws-sdk")
const currencySymbol = require("currency-symbol-map")
const validator = require("../validator/validator.js")
const awsConnection = require("../configs/awsConnection.js")
const bcrypt=require("bcrypt")
saltRounds=10;



const createProduct = async function (req, res) {
    try {
        const requestBody = req.body;

        if (!validator.isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: 'please provide valid inputs in request body' })
        }

        let { title, description, price, currencyId, isFreeShipping, style, availableSizes, installments } = requestBody;

        if (!validator.isValid(title)) {
            return res.status(400).send({ status: false, message: 'Title is required' })
        }

        const duplicatetitle = await productModel.findOne({ title });

        if (duplicatetitle) {
            return res.status(400).send({ status: false, message: 'Title is already used.' })
        }

        if (!validator.isValid(description)) {
            return res.status(400).send({ status: false, message: 'Description is required' })
        }

        if (!validator.isValid(price)) {
            return res.status(400).send({ status: false, message: 'Price is required' })
        }
        if (isNaN(price)) {
            return res.status(400).send({ status: false, message: 'Price should be a numeric value' })
        }

        if (price <= 0) {
            return res.status(400).send({ status: false, message: `Price should be a valid number` })
        }

        if (!validator.isValid(currencyId)) {
            return res.status(400).send({ status: false, message: 'CurrencyId is required' })
        }

        if (!(currencyId == "INR")) {
            return res.status(400).send({ status: false, message: 'currencyId should be INR' })
        }

        if (validator.isValid(isFreeShipping)) {

            if (!((isFreeShipping === "true") || (isFreeShipping === "false"))) {
                return res.status(400).send({ status: false, message: 'isFreeShipping must be a boolean value' })
            }
        }
        if (installments) {
            if (!validator.isValid(installments)) {
                return res.status(400).send({ status: false, message: "please enter installments" })
            }
            if (isNaN(installments)) {
                return res.status(400).send({ status: false, message: 'Installment should be a numeric value' })
            }
        }
        //let productImage = req.files;
        const productImage = await awsConnection.uploadProfileImage(req.files)
        if (!productImage) return res.status(400).send({ status: false, message: "there is an error to upload profile image. for more details move on console" })
        const newProductData = {
            title,
            description,
            price,
            currencyId,
            currencyFormat: currencySymbol(currencyId),
            isFreeShipping,
            style,
            installments,
            productImage
        }

        if (!validator.isValid(availableSizes)) {
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
        let myQuery = req.query;
        const { size, name, priceGreaterThan, priceLessThan, priceSort } = myQuery
        if (size || name || priceGreaterThan || priceLessThan) {
            let body = {};
            body.isDeleted = false
            if (size) {
                body.availableSizes = size
            }
            if (name) {
                body.title = { $regex: name }
            }
            if (priceGreaterThan) {
                body.price = { $gt: priceGreaterThan }

               
            }
            if (priceLessThan) {
                body.price = { $lt: priceLessThan }
            }
            let productFound = await productModel.find(body).sort({ price: priceSort })
            if (!(productFound.length > 0)) {
                return res.status(404).send({ status: false, message: "Sorry, there is no such product found" });
            }
            return res.status(200).send({ status: true, message: 'Query Product list', data: productFound });
        } else {
            let productFound2 = await productModel.find().sort({ price: priceSort })
            return res.status(200).send({ status: true, message: "Success", data: productFound2 });
        }
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message });
    }
}

module.exports={createProduct,getProductDetails}