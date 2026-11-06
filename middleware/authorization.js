const jwt = require("jsonwebtoken")

module.exports = function(req, res, next) {
    try {
        const token = req.headers.authorization

        if (!token) {
            return res.status(400).json({
            message: "Token not found",
        })
    }

    if(token.split(" ")(0) !== "Bearer"){
        return res.status(400).json({
            message: "Bearer token is required",
        })
    }

    const decode = jwt.verify(token.split(" ")(1), process.env.SECRET_KEY)

    if(decode.role !== "admin"){
        return res.status(400).json({
            message: "You are not admin",
        })
    }

    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}