const jwt = require('jsonwebtoken')




const authentication = async function (req, res, next) {
    try {
        let token = req.headers["authorization"]

        if (!token) return res.status(400).send({ status: false, msg: "please provide token in request hadder in form of Bearear token " })
        if (!token.startsWith("Bearer")) return res.status(400).send({ status: false, msg: "please provide token in request hadder in form of Bearear token " })


        token = token.split("Bearer")
        token = token[1].trim()


        let validateToken = jwt.verify(token, "Er. Sonu Verma")
        console.log("verify token ", validateToken)


        req.decodedToken = validateToken


        next()

    } catch (err) {


        if (err.message == "invalid token") return res.status(401).send({ status: false, msg: "authentication failed May be your hadder part currupt" }) // failed ka 401 ?
        if (err.message.startsWith("Unexpected")) return res.status(401).send({ status: false, msg: "authentication failed May be your payload part currupt" }) // failed ka 401 ?
        if (err.message == "invalid signature") return res.status(401).send({ status: false, msg: "authentication failed May be your singature part currupt" }) // failed ka 401 ?
        if (err.message == "jwt expired") return res.status(401).send({ status: false, msg: "authentication failed May be your Token is Expired" }) // failed ka 401 ?


        console.log(err)
        return res.status(500).send({ status: false, msg: "error occure for more information move on console", error: err.message })
        // priority wise error catch if any space present in anywhere at token catch only hadder part


    }

}

















module.exports.authentication = authentication



