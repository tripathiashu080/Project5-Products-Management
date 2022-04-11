const UserModel =require("../models/userModel")
const aws = require("aws-sdk")

const isValid = function (value) {
  if (typeof (value) === 'undefined' || typeof (value) === 'null') {
    return false
  }
  if (typeof (value) === 'string' && value.trim().length > 0) {
    return true
  }
}

const isValidPhoneNo=/^\+?([6-9]{1})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{5})$/
const isValidPassword=/^[a-zA-Z0-9!@#$%^&*]{8,15}$/
const isValidEmail=/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/
const isValidPinCode= /^[1-9]{1}[0-9]{2}\\s{0, 1}[0-9]{3}$/


aws.config.update(
    {
        accessKeyId: "AKIAY3L35MCRVFM24Q7U",
        secretAccessKeyId: "qGG1HE0qRixcW1T1Wg1bv+08tQrIkFVyDFqSft4J",
        region: "ap-south-1"
    }
)

let uploadFile = async (file) => {
    return new Promise( function(resolve, reject) {
        //this function will upload file to aws and return the link
        let s3 = new aws.S3({ apiVersion: "2006-03-01" }) 
         await uploadFile(data[0])
        var uploadParams = {
            ACL: "public-read",
            Bucket: "classroom-training-bucket", 
            Key: "radhika/" + file.originalname, 
            Body: file.buffer
        }

      s3.upload(uploadParams, function (err, data) {
            if (err) { 
                return reject({ "error": err }) 
            }

            console.log(data)
            console.log(" file uploaded succesfully ")
            return resolve(data.Location) // HERE
          }
        )

    
    }
    )
}



const createUser = async (req, res) => {
    try {
        const data= req.body
        if(!Object.keys(data).length>0) return res.status(400).send({status:true, message:"Please Provide User data in body"})

        if (!isValid(data.fname)) {
            res.status(400).send({ status: false, message: 'please provide first name' })
            return
          }
        if (!isValid(data.lname)) {
            res.status(400).send({ status: false, message: 'please provide last name' })
            return
          }
        if (!isValid(data.email)) {
            res.status(400).send({ status: false, message: 'please provide Email ID' })
            return
          }
          if (!(isValidEmail.test(data.email))) {
            res.status(400).send({ status: false, message: 'please provide valid Email ID' })
            return
          }
          isEmailPresent = await UserModel.findOne({email:data.email})
        if (isEmailPresent) {
            res.status(400).send({ status: false, message: "This  is email already in use,please provide another email" })
            return
          }
        if (!isValid(data.profileImage)) {
            res.status(400).send({ status: false, message: 'please provide profile Image S3 Link' })
            return
          }
        if (!isValid(data.phone)) {
            res.status(400).send({ status: false, message: 'please provide Mobile No.' })
            return
          }
          if (!(isValidPhoneNo.test(data.phone))) {
            res.status(400).send({ status: false, message: 'please provide valid Mobile no.' })
            return
          }
          isPhonePresent = await UserModel.findOne({phone:data.phone})
        if (isPhonePresent) {
            res.status(400).send({ status: false, message: "This mobile is number already in use,please provide another mobile number" })
            return
          }
        if (!isValid(data.password)) {
            res.status(400).send({ status: false, message: 'please provide password' })
            return
          }
          if (!(isValidPassword.test(data.password))) {
            res.status(400).send({ status: false, message: 'please provide valid password(minLength=8 , maxLength=15)' })
            return
          }
        if (!isValid(data.address.shipping.street)) {
            res.status(400).send({ status: false, message: 'please provide shipping Street name' })
            return
          }
        if (!isValid(data.address.shipping.city)) {
            res.status(400).send({ status: false, message: 'please provide shipping City name' })
            return
          }
        if (!isValid(data.address.shipping.pincode)) {
            res.status(400).send({ status: false, message: 'please provide shipping pincode' })
            return
          }
          
        if (!(isValidPinCode.test(data.address.shipping.pincode))) {
            res.status(400).send({ status: false, message: 'please provide valid shipping Pincode.' })
            return
          }
        if (!isValid(data.address.billing.street)) {
            res.status(400).send({ status: false, message: 'please provide billing Street name' })
            return
          }
        if (!isValid(data.address.billing.city)) {
            res.status(400).send({ status: false, message: 'please provide billing City name' })
            return
          }
        if (!isValid(data.address.billing.bPincode)) {
            res.status(400).send({ status: false, message: 'please provide billing Pincode' })
            return
          }
        if (!(isValidPinCode.test(data.address.billing.pincode))) {
            res.status(400).send({ status: false, message: 'please provide valid billing Pincode.' })
            return
          }
        
        

        const createdUser = await UserModel.create(data)
        res.status(201).send({status:true, message:"User created successfully", data: createdUser })


    } catch (err) {
        res.status(500).send({status:false, message:err.message})
    }
}

module.exports = {createUser}