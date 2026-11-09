const { Router } = require("express")
const { register, login, verify, getSignUp } = require("../controller/auth.controller")

const authRouter = Router()

authRouter.post("/register", register)
authRouter.post("/login", login)
authRouter.post("/verify", verify)
authRouter.get("/signup", getSignUp)

module.exports = authRouter