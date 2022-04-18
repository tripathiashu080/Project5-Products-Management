const mongoose = require('mongoose');

const isValid = (value) => {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    if (typeof value === 'number' && value.toString().trim().length === 0) return false
    return true;
}
const isValidRequestBody = (requestBody) => {
    if (Object.keys(requestBody).length) return true
    return false;
}
const isValidObjectId = (ObjectId) => {
    return mongoose.Types.ObjectId.isValid(ObjectId)
}
const isStrictString = function (value) {
    if (typeof value !== 'string') return false
    let flag = 0
    value = value.trim()
    for (let i = 0; i < value.length; i++)
        if ((value.charCodeAt(i) >= 97 && value.charCodeAt(i) <= 122) || (value.charCodeAt(i) >= 65 && value.charCodeAt(i) <= 90)) flag++
    if (flag !== value.length) return false
    return true
}

const isObjectId = function (ObjectId) {
    return  mongoose.isValidObjectId(ObjectId)
    }
    const isValidEmail = function (email) {
        email = email.trim()
        let regexForEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        return regexForEmail.test(email)
    };

    const isValidPhone = function (phone) {
        phone = phone.trim()
        let regexForphone = /^(?:(?:\+|0{0,2})91(\s*|[\-])?|[0]?)?([6789]\d{2}([ -]?)\d{3}([ -]?)\d{4})$/
        return regexForphone.test(phone)
    };
    
    const isValidPassword = function (password) {
        password = password.trim()
        if (password.length > 7 && password.length < 16) return true
        return false
    }

    const isValidAddress = async function (address) {
        try {
            return await JSON.parse(address)
        }
        catch (err) {
            console.log(err)
            if (err) return false
        }
    }
    
    
    
    const isValidPincode = function (pincode) {
        try{
    
    
        if (typeof pincode !== 'number') return false
        pincode = `${pincode}`
    
    
        if (pincode.length !== 6) return false
        if (pincode[0] === 0) return false
    
    
        let flag = 0
        pincode = pincode.trim()
        for (let i = 1; i < pincode.length; i++)
            if ((pincode.charCodeAt(i) >= 48 && pincode.charCodeAt(i) <= 57)) flag++
    
    
        if (flag !== pincode.length-1) return false
        return true
        }
        catch(err){
            console.log(err)
        }
    }
    
    const isNormalString = function (value) {
        let flag = 0
        value = value.trim()
        for (let i = 0; i < value.length; i++)
            if ((value.charCodeAt(i) >= 97 && value.charCodeAt(i) <= 122) || (value.charCodeAt(i) >= 65 && value.charCodeAt(i) <= 90)) flag++
        if (flag === 0) return false
        return true
    }
    
    
    
    
    const isValidPrice = function (price) {
        try {
    
    
            if (isNaN(price)) return false
    
    
            if (price <= 0) return false
    
    
            return true
        }
    
        catch (err) {
            console.log(err)
    
        }
    
    }
    
    
    
    
    
    const isValidCurrency = function (currencyId) {
    
        const currencyList = ['USD', 'BTC', 'INR', 'EUR']
        return currencyList.includes(currencyId)
    
    }
    
    
    
    
    const isValidAvailableSizes = function (availableSize) {
    
        if (availableSize[0] !== '[' || availableSize[availableSize.length - 1] !== ']') return false
    
    
        availableSize = availableSize.toUpperCase()
    
    
        availableSize = availableSize.replace("[", "")
        availableSize = availableSize.replace("]", "")
        let sizeArray = availableSize.split(",").map((ele) => ele.trim())
    
    
        for (let i = 0; i < sizeArray.length; i++)
            if (!(["S", "XS", "M", "X", "L", "XXL", "XL"].includes(sizeArray[i]))) return false
    
    
        return sizeArray
    
    
    }
    
    
    
    
    const isValidInstallments = function (installments) {
        try {
    
    
            if (isNaN(installments)) return false
            installments = Number(installments)
    
    
            if (installments < 0) return false
    
    
            if (installments !== parseInt(installments)) return false
    
    
            return true
    
        }
    
    
        catch (err) {
    
            console.log(err)
    
        }
    
    }
    
    
    const isValidAvailableSizesForUpdate = function (availableSize, dbData) {


        if (availableSize[0] !== '[' || availableSize[availableSize.length - 1] !== ']') return false
    
    
        availableSize = availableSize.toUpperCase()
    
    
        availableSize = availableSize.replace("[", "")
        availableSize = availableSize.replace("]", "")
        let sizeArray = availableSize.split(",").map((ele) => ele.trim())
    
    
        for (let i = 0; i < sizeArray.length; i++)
            if (!(["S", "XS", "M", "X", "L", "XXL", "XL"].includes(sizeArray[i]))) return false
    
    
    
        // if you replace
        // return sizeArray
    
    
        // if you don't replace
        sizeArray.filter((ele) => dbData.includes(ele) == false ? dbData.push(ele) : ele * ele)
        return dbData
    
    }
    
    
    
    const isValidPriceSort = function (priceSort) {
    
        if (priceSort != -1 && priceSort != 1) return false
    
        return true
    
    }
    
    
    
    

module.exports = { 
    isValid, 
    isValidRequestBody, 
    isValidObjectId,
    isStrictString,
    isObjectId,
    isValidEmail,
    isValidPhone,
    isValidPassword,
    isValidAddress,
    isValidPincode,
    isNormalString,
    isValidPrice,
    isValidCurrency,
    isValidAvailableSizes,
    isValidInstallments,
    isValidPriceSort,
    isValidAvailableSizesForUpdate
 }