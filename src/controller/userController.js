const userModel = require("../models/userModel")
const aws= require("aws-sdk")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
saltRounds=10;
const isValid = function (value) {
  if (typeof (value) === 'undefined' || typeof (value) === 'null') {
    return false
  }
  if (typeof (value) === 'string' && value.trim().length > 0) {
    return true
  }
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


const registerUser = async function (req, res) {
    try {
        const userData = req.body
        const files = req.files
        if (Object.keys(userData).length = 0) { return res.status(400).send({ status: "false", message: "Please ptovide required input fields" }) }
        let { fname, lname, email, phone, password, address } = userData
        if (!isValid(fname)) { return res.status(400).send({ status: "false", message: "Please enter first name" }) }
        if (!isValid(lname)) { return res.status(400).send({ status: "false", message: "Please enter last name" }) }
        if (!isValid(email)) { return res.status(400).send({ status: "false", message: "Please enter email" }) }

        if (!/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email)) {
            return res.status(400).send({ status: false, message: `Email should be a valid email address` });
        }
        let duplicateEmail = await userModel.findOne({ email: email })
        if (duplicateEmail) {
            return res.status(400).send({ status: false, message: `Email Already Present` });
        }

        if (!isValid(phone)) {
            return res.status(400).send({ status: false, message: "Invalid request parameter, please provide Phone" });
        }
        if (!/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/.test(phone)) {
            return res.status(400).send({ status: false, message: `Mobile should be a valid number` });
        }
        let duplicatePhone = await userModel.findOne({ phone: phone })
        if (duplicatePhone) {
            return res.status(400).send({ status: false, message: `Phone Number Already Present` });
        }
        if (!isValid(password.trim())) { return res.status(400).send({ status: "false", message: "Please enter a valid password" }) }
        if (!(password.length >= 8 && password.length <= 15)) {
            return res.status(400).send({ status: false, message: "Password should be Valid min 8 and max 15 " });
        }
       address = JSON.parse(address)
       if (Object.keys(address).length = 0) {
          return res.status(400).send({ status: false, message: "Address is required" });
        }

        let { shipping, billing } = address
        if (shipping) {
            let { street, city, pincode } = shipping
            if (street) {
                if (!isValid(street)) {
                    return res.status(400).send({ status: false, message: 'Shipping Street Required' });
                }
            }

            if (city) {
                if (!isValid(city)) {
                    return res.status(400).send({ status: false, message: 'Shipping city is Required' });
                }
            }
            if (pincode) {
                if (!isValid(pincode)) {
                    return res.status(400).send({ status: false, message: 'Shipping pincode Required' });
                }
            }
        } else {
            return res.status(400).send({ status: false, message: "Invalid request parameters, Shipping address cannot be empty" })
        }
        if (billing) {
            let { street, city, pincode } = billing
            if (street) {
                if (!isValid(street)) {
                    return res.status(400).send({ status: false, message: 'billing Street Required' })
                }
            }
            if (city) {
                if (!isValid(city)) {
                    return res.status(400).send({ status: false, message: 'Shipping city is Required' });
                }
            }
            if (pincode) {
                if (!isValid(pincode)) {
                    return res.status(400).send({ status: false, message: 'Shipping pincode Required' });
                }
            }
        } else {
            return res.status(400).send({ status: false, message: "Invalid request parameters, billing address cannot be empty" })
        }
        if (files && files.length > 0) {
            profileImage = await uploadFile(files[0])
        }
        else { return res.status(400).send({ message: "No file found" }) }
        const hash = await bcrypt.hash(password, saltRounds)
        const updatedData = {
            "fname": fname,
            "lname": lname,
            "email": email,
            "phone": phone,
            "password": hash,
            "address": address,
            "profileImage": profileImage,
        }
        let user = await userModel.create(updatedData)
        return res.status(201).send({ status: true, message: "user registered succesfully", data: user })
    }
    catch (err) {
        return res.status(500).send({ status: "false", message: err.message })
    }
}


const loginUser = async (req, res) => {
    try {
        const gEmail = req.body.email
        const gPassword = req.body.password
        let user = await userModel.findOne({ email: gEmail });
        if (user) {
            
            const valPassword = await bcrypt.compare(gPassword, user.password);
            if (!valPassword) {
                return res.status(400).send({ message: "Invalid Password" })
            }
            let payload = { userId: user._id, email: gEmail };
            const generatedToken = jwt.sign(payload, "room13key", { expiresIn: '10080m' });
            
            res.setHeader["authorisation",generatedToken]
            return res.status(200).send({
                status: true,
                message:  " you have logged in Succesfully",
                data: {
                    userId: user._id,
                    token: generatedToken,
                }
            });
        } else {
            return res.status(400).send({ status: false, message: "invalid userid or pwd" });
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
};



const updateProfile = async function (req, res) {
    try {


        if (validator.isValidRequestBody(req.query)) return res.status(400).send({ status: false, msg: "can not pass request query. query is blocked" })


        const requestBody = req.body
        if (!validator.isValidRequestBody(requestBody)) return res.status(400).send({ status: false, msg: "please provide user updation details in form data of request body" })
        let { fname, lname, email, phone, password, address } = requestBody


        const user = await userModel.findById(req.params.userId)
        let updateUserData = {}


        if ('fname' in req.body) {

            if (!validator.isValidRequestValue(fname)) return res.status(400).send({ status: false, message: ` Key Name : 'fname' You can pass only a to z OR A to Z. Make sure you can not pass only key name or a blank key` })
            if (!validator.isStrictString(fname)) return res.status(400).send({ status: false, message: ` Key Name : 'fname' You can pass only a to z OR A to Z. Make sure you can not pass only key name or a blank key` })


            if (!('$set' in updateUserData)) updateUserData["$set"] = {};
            updateUserData['$set']['fname'] = fname

        }


        if ('lname' in req.body) {


            if (!validator.isValidRequestValue(lname)) return res.status(400).send({ status: false, message: ` Key Name : 'lname' You can pass only a to z OR A to Z. Make sure you can not pass only key name or a blank key` })
            if (!validator.isStrictString(lname)) return res.status(400).send({ status: false, message: ` Key Name : 'lname' You can pass only a to z OR A to Z. Make sure you can not pass only key name or a blank key` })


            if (!('$set' in updateUserData)) updateUserData["$set"] = {};
            updateUserData['$set']['lname'] = lname

        }


        if ('email' in req.body) {


            if (!validator.isValidRequestValue(email)) return res.status(400).send({ status: false, message: ` Key Name : 'email' You can pass only a valid email. Make sure you can not pass only key name or a blank key` })
            if (!validator.isValidEmail(email)) return res.status(400).send({ status: false, message: ` Key Name : 'email' You can pass only a valid email. Make sure you can not pass only key name or a blank key` })


            let duplicateEmail = await userModel.findOne({ email: email })
            if (duplicateEmail) return res.status(400).send({ status: false, message: `Email Already Present. Take another email` });


            if (!('$set' in updateUserData)) updateUserData["$set"] = {};
            updateUserData['$set']['email'] = email

        }


        if (req.files && req.files.length > 0) {


            const profileImage = await awsConnection.uploadProfileImage(req.files)
            if (!profileImage) return res.status(400).send({ status: false, message: "there is an error to upload profile image. for more details move on console" })


            if (!('$set' in updateUserData)) updateUserData["$set"] = {};
            updateUserData['$set']['profileImage'] = profileImage

        }


        if ('phone' in req.body) {


            if (!validator.isValidRequestValue(phone)) return res.status(400).send({ status: false, message: ` Key Name : 'phone' You can pass only a valid Indian Mobile No. Make sure you can not pass only key name or a blank key` })
            if (!validator.isValidPhone(phone)) return res.status(400).send({ status: false, message: ` Key Name : 'phone' You can pass only a valid Indian Mobile No. Make sure you can not pass only key name or a blank key` })


            let duplicatePhone = await userModel.findOne({ phone: phone })
            if (duplicatePhone) return res.status(400).send({ status: false, message: `Phone Already Present. Take another Phone Number` });


            if (!('$set' in updateUserData)) updateUserData["$set"] = {};
            updateUserData['$set']['phone'] = phone

        }


        if ('password' in req.body) {


            if (!validator.isValidRequestValue(password)) return res.status(400).send({ status: false, message: ` Key Name : 'password' You can pass only a valid password more than 8 character and less than 15 character. Make sure you can not pass only key name or a blank key` })
            if (!validator.isValidPassword(password)) return res.status(400).send({ status: false, message: ` Key Name : 'password' You can pass only a valid password more than 8 character and less than 15 character. Make sure you can not pass only key name or a blank key` })
            const encryptedPassword = await setEncription.setEncription(password)


            if (!('$set' in updateUserData)) updateUserData["$set"] = {};
            updateUserData['$set']['password'] = encryptedPassword

        }



        if ('address' in req.body) {


            const addressSuggestData = { "shipping": { "street": "abc road", "city": "indb", "pincode": 777777 }, "billing": { "street": "def road", "city": "indb", "pincode": 999979 } }


            const addressData = await validator.isValidAddress(address)
            if (!addressData) return res.status(400).send({ status: false, msg: "please provide address in object form. Make sure you can not pass only key name or a blank key", addressSuggestData: addressSuggestData })


            address = JSON.stringify(user.address)
            const schemaAddress = await validator.isValidAddress(address)


            if (!('$set' in updateUserData)) updateUserData["$set"] = {};
            updateUserData['address'] = schemaAddress


            const { shipping, billing } = addressData;


            if ('shipping' in addressData) {


                const { street, city, pincode } = shipping


                if ('street' in shipping) {
                    if (!validator.isValidRequestValue(street)) return res.status(400).send({ status: false, msg: "please provide 'street' key in billing address. Make sure you can not pass only key name or a blank key" })


                    if (!('$set' in updateUserData)) updateUserData["$set"] = {};
                    updateUserData['address']['shipping']['street'] = street

                }

                
                if ('city' in shipping) {


                    if (!validator.isValidRequestValue(city)) return res.status(400).send({ status: false, msg: "please provide 'city' key in shipping address. Make sure you can not pass only key name or a blank key" })
                    if (!validator.isStrictString(city)) return res.status(400).send({ status: false, message: ` Key Name : 'city' You can pass only a to z OR A to Z. Make sure you can not pass only key name or a blank key` })


                        if (!('$set' in updateUserData)) updateUserData["$set"] = {};
                    updateUserData['address']['shipping']['city'] = city
                    
                }



                if ('pincode' in shipping) {
                    if (!validator.isValidRequestValue(pincode)) return res.status(400).send({ status: false, message: ` Key Name : 'pincode' You can pass only 0 to 9 digit. Make sure you can not pass only key name or a blank key or starting from 0` })
                    if (!validator.isValidPincode(pincode)) return res.status(400).send({ status: false, message: ` Key Name : 'pincode' You can pass only 0 to 9 digit. Make sure you can not pass only key name or a blank key or starting from 0` })


                    if (!('$set' in updateUserData)) updateUserData["$set"] = {};
                    updateUserData['address']['shipping']['pincode'] = pincode

                }

            }



            if ('billing' in addressData) {


                const { street, city, pincode } = billing


                if ('street' in shipping) {


                    if (!validator.isValidRequestValue(street)) return res.status(400).send({ status: false, msg: "please provide 'street' key in billing address. Make sure you can not pass only key name or a blank key" })


                    if (!('$set' in updateUserData)) updateUserData["$set"] = {};
                    updateUserData['address']['billing']['street'] = street

                }



                if ('city' in shipping) {


                    if (!validator.isValidRequestValue(city)) return res.status(400).send({ status: false, msg: "please provide 'city' key in billing address. Make sure you can not pass only key name or a blank key" })
                    if (!validator.isStrictString(city)) return res.status(400).send({ status: false, message: ` Key Name : 'city' You can pass only a to z OR A to Z. Make sure you can not pass only key name or a blank key` })

                    if (!('$set' in updateUserData)) updateUserData["$set"] = {};
                    updateUserData['address']['billing']['city'] = city

                }



                if ('pincode' in shipping) {


                    if (!validator.isValidRequestValue(pincode)) return res.status(400).send({ status: false, message: ` Key Name : 'pincode' You can pass only 0 to 9 digit. Make sure you can not pass only key name or a blank key or starting from 0` })
                    if (!validator.isValidPincode(pincode)) return res.status(400).send({ status: false, message: ` Key Name : 'pincode' You can pass only 0 to 9 digit. Make sure you can not pass only key name or a blank key or starting from 0` })


                    if (!('$set' in updateUserData)) updateUserData["$set"] = {};
                    updateUserData['address']['billing']['pincode'] = pincode

                }

            }

        }


        console.log("updateUserData" , updateUserData)


        const updatedData = await userModel.findOneAndUpdate({ _id: req.params.userId }, updateUserData, { new: true })
        return res.status(200).send({ status: true, message: "User profile updated", data: updatedData })


    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }

}

module.exports={registerUser,loginUser,updateProfile}